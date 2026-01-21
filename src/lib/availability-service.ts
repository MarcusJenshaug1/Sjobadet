import { revalidatePath } from 'next/cache';
import prisma from './prisma';
import { createScraperBrowser, fetchAvailability } from './availability-scraper';
import type { Browser } from 'puppeteer-core';
import { logAdminAction } from './admin-log';
import { clearSaunaCaches } from './sauna-service';

type AvailabilityUpdateResult = {
    data: { days: Record<string, { from: string; to: string; availableSpots: number }[]>; timestamp: string };
    status: 'success' | 'empty' | 'unchanged';
};

export async function updateSaunaAvailability(saunaId: string, options: { browser?: Browser } = {}): Promise<AvailabilityUpdateResult | null> {
    const sauna = await prisma.sauna.findUnique({
        where: { id: saunaId },
        select: {
            id: true,
            slug: true,
            availabilityData: true,
            bookingAvailabilityUrlDropin: true,
            name: true,
        }
    });

    if (!sauna || !sauna.bookingAvailabilityUrlDropin) {
        console.log(`[AvailabilityService] Skipping ${sauna?.name || saunaId} - no URL`);
        return null;
    }

    try {
        console.log(`[AvailabilityService] Updating ${sauna.name}...`);
        const attemptAt = new Date();
        console.log(`[AvailabilityService] Updating ${sauna.name}...`);
        // lastScrapeAttemptAt removed from schema


        const fresh = await fetchAvailability(sauna.bookingAvailabilityUrlDropin, { browser: options.browser });

        const existing = (() => {
            try {
                return sauna.availabilityData ? JSON.parse(sauna.availabilityData) : { days: {} };
            } catch {
                return { days: {} };
            }
        })();

        const todayKey = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Europe/Oslo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());

        // Keep future dates, merge fresh data for "today"
        const sanitizedExistingDays = Object.entries(existing.days || {})
            .filter(([key]) => Boolean(key?.trim()) && key >= todayKey)
            .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

        const freshDays = fresh.days || {};
        const freshHasSlots = Object.values(freshDays).some((slots) => (slots || []).length > 0);

        if (!freshHasSlots) {
            console.warn(`[AvailabilityService] Empty scrape for ${sauna.name} - keeping previous availability data`);
            const emptyDiagnostics = fresh.diagnostics && Object.keys(fresh.diagnostics).length > 0
                ? JSON.stringify(fresh.diagnostics)
                : 'Ingen diagnostikk tilgjengelig';

            /*
            await logAdminAction(
                'AVAILABILITY_CHECK',
                `${sauna.name}: Ingen tider funnet i scrape. Beholder forrige tilgjengelighet.`,
                'INFO', // Valid response, just empty
                'System'
            );
            */

            return {
                data: existing.days ? { ...existing, timestamp: existing.timestamp ?? new Date().toISOString() } : { days: {}, timestamp: new Date().toISOString() },
                status: 'empty'
            };
        }

        const mergedDays = {
            ...sanitizedExistingDays,
            ...freshDays,
        };

        const dataHasChanged = JSON.stringify(mergedDays) !== JSON.stringify(existing.days || {});

        const payload = JSON.stringify({
            days: mergedDays,
            timestamp: new Date().toISOString(),
        });

        const updated = await prisma.sauna.update({
            where: { id: saunaId },
            data: {
                ...(dataHasChanged ? { previousAvailabilityData: sauna.availabilityData } : {}),
                availabilityData: payload,
                lastScrapedAt: new Date(),
            }
        });

        // Bust in-memory caches so the homepage cards and detail pages pick up fresh availability immediately
        clearSaunaCaches(sauna.slug);

        // Trigger ISR revalidation for pages that surface next available slot info
        try {
            revalidatePath('/');
            if (sauna.slug) {
                revalidatePath(`/home/${sauna.slug}`);
            }
        } catch (revalidateError) {
            console.warn('[AvailabilityService] Failed to revalidate paths:', revalidateError);
        }

        console.log(`[AvailabilityService] Success for ${sauna.name}`);

        // Add log entry for the individual scrape
        const slotSummary = Object.values(freshDays)
            .flat()
            .slice(0, 3)
            .map(s => `${s.from}: ${s.availableSpots}`)
            .join(', ');

        if (freshHasSlots) {
            // We generally don't need to bloat the main Activity Log with every successful scrape anymore
            // since we have the dedicated Scraper History.
            // Uncomment if you want major changes logged:
            /*
            const totalSlots = Object.values(freshDays).reduce((acc, slots) => acc + (slots?.length ?? 0), 0);
            await logAdminAction(
                'AVAILABILITY_CHECK',
                `${sauna.name}: Oppdatert ${Object.keys(freshDays).length} dager. Totalt ${totalSlots} tider.`,
                'SUCCESS',
                'System'
            );
            */
        } else {
            // If no slots, just do nothing in the main log.
            // The specific "Empty" status is handled in the Scraper Logs.
        }

        return {
            data: JSON.parse(payload),
            status: dataHasChanged ? 'success' : 'unchanged'
        };
    } catch (error) {
        console.error(`[AvailabilityService] Failed for ${sauna.name}:`, error);
        await logAdminAction(
            'AVAILABILITY_CHECK',
            `Feilet for ${sauna.name}: ${error instanceof Error ? error.message : String(error)}`,
            'FAILURE',
            'System'
        );
        throw error;
    }
}

export async function updateAllSaunasAvailability() {
    // Get all active saunas
    const allActiveSaunas = await prisma.sauna.findMany({
        where: { status: 'active' },
        select: { id: true, name: true, bookingAvailabilityUrlDropin: true }
    });

    // Only scrape those with URLs
    const saunasWithUrls = allActiveSaunas.filter(s => s.bookingAvailabilityUrlDropin?.trim());

    console.log(`[AvailabilityService] Running batch update for ${saunasWithUrls.length}/${allActiveSaunas.length} saunas with URLs...`);

    const results = [] as Array<{ saunaId?: string; status?: string; error?: string }>;
    let successCount = 0;
    let emptyCount = 0;
    let failureCount = 0;

    if (saunasWithUrls.length > 0) {
        const browser = await createScraperBrowser();
        try {
            // Process saunas with URLs
            for (const sauna of saunasWithUrls) {
                try {
                    const result = await updateSaunaAvailability(sauna.id, { browser });
                    if (result?.status === 'empty') emptyCount += 1;
                    else successCount += 1;
                    results.push({ saunaId: sauna.id, status: result?.status });
                } catch (e) {
                    failureCount += 1;
                    results.push({ saunaId: sauna.id, error: String(e) });
                }
            }
        } finally {
            await browser.close();
        }
    }

    console.log(`[AvailabilityService] Batch summary: total=${saunasWithUrls.length}, success=${successCount}, empty=${emptyCount}, failures=${failureCount}`);

    // Log saunas without URLs
    for (const sauna of allActiveSaunas.filter(s => !s.bookingAvailabilityUrlDropin?.trim())) {
        console.log(`[AvailabilityService] Skipping ${sauna.name} - no booking URL configured`);
        await logAdminAction(
            'AVAILABILITY_CHECK',
            `${sauna.name}: Ingen booking-URL konfigurert. Kan ikke hente ledighet.`,
            'INFO',
            'System'
        );
    }

    return results;
}
