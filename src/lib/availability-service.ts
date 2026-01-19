import { revalidatePath } from 'next/cache';
import prisma from './prisma';
import { fetchAvailability } from './availability-scraper';
import { logAdminAction } from './admin-log';
import { clearSaunaCaches } from './sauna-service';

export async function updateSaunaAvailability(saunaId: string) {
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
        const fresh = await fetchAvailability(sauna.bookingAvailabilityUrlDropin);

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

        const shouldMergeFresh = Boolean(fresh.date && fresh.slots && fresh.slots.length > 0);

        const mergedDays = {
            ...sanitizedExistingDays,
            ...(shouldMergeFresh ? { [fresh.date as string]: fresh.slots } : {}),
        };

        // Check if availability data has actually changed (compare slots, not timestamp)
        const existingDateSlots = existing.days?.[fresh.date as string];
        const dataHasChanged = !existingDateSlots || 
            JSON.stringify(existingDateSlots) !== JSON.stringify(fresh.slots);

        const payload = JSON.stringify({
            days: mergedDays,
            timestamp: new Date().toISOString(),
        });

        const updated = await prisma.sauna.update({
            where: { id: saunaId },
            data: {
                previousAvailabilityData: sauna.availabilityData,
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
        if (shouldMergeFresh) {
            const slotSummary = fresh.slots.slice(0, 3).map(s => `${s.from}: ${s.availableSpots}`).join(', ');
            
            if (dataHasChanged) {
                // Data has changed - log as SUCCESS with details
                const status = fresh.slots.some(s => s.availableSpots > 0) ? 'SUCCESS' : 'INFO';
                await logAdminAction(
                    'AVAILABILITY_CHECK',
                    `${sauna.name}: Oppdatert ${fresh.date}. Totalt ${fresh.slots.length} tider. (Eks: ${slotSummary}...)`,
                    status,
                    'System'
                );
            } else {
                // Data is unchanged - log as OK
                await logAdminAction(
                    'AVAILABILITY_CHECK',
                    `${sauna.name}: ${fresh.date}. Ingen endringer siden sist (${fresh.slots.length} tider, samme som før)`,
                    'OK',
                    'System'
                );
            }
        } else {
            // No slots found in scrape result
            console.warn(`[AvailabilityService] No slots found for ${sauna.name} on the expected date`);
            await logAdminAction(
                'AVAILABILITY_CHECK',
                `${sauna.name}: Fant ingen tider på siden. Mulig URL-endring, nettsted ute, eller alle tider booket.`,
                'WARNING',
                'System'
            );
        }

        return JSON.parse(payload);
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

    const results = [];
    
    // Process saunas with URLs
    for (const sauna of saunasWithUrls) {
        try {
            results.push(await updateSaunaAvailability(sauna.id));
        } catch (e) {
            results.push({ error: String(e) });
        }
    }

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
