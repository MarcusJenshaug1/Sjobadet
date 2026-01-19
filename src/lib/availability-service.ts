import prisma from './prisma';
import { fetchAvailability } from './availability-scraper';
import { logAdminAction } from './admin-log';

export async function updateSaunaAvailability(saunaId: string) {
    const sauna = await prisma.sauna.findUnique({
        where: { id: saunaId },
        select: {
            id: true,
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

        console.log(`[AvailabilityService] Success for ${sauna.name}`);

        // Add log entry for the individual scrape
        if (shouldMergeFresh) {
            const slotSummary = fresh.slots.slice(0, 3).map(s => `${s.from}: ${s.availableSpots}`).join(', ');
            await logAdminAction(
                'SCRAPER_RUN',
                `${sauna.name}: Oppdatert ${fresh.date}. Totalt ${fresh.slots.length} tider. (Eks: ${slotSummary}...)`,
                'SUCCESS',
                'System'
            );
        }

        return JSON.parse(payload);
    } catch (error) {
        console.error(`[AvailabilityService] Failed for ${sauna.name}:`, error);
        await logAdminAction(
            'SCRAPER_RUN',
            `Feilet for ${sauna.name}: ${error instanceof Error ? error.message : String(error)}`,
            'FAILURE',
            'System'
        );
        throw error;
    }
}

export async function updateAllSaunasAvailability() {
    const saunas = await prisma.sauna.findMany({
        where: {
            status: 'active',
            AND: [
                { bookingAvailabilityUrlDropin: { not: null } },
                { bookingAvailabilityUrlDropin: { not: '' } }
            ]
        },
        select: { id: true }
    });

    console.log(`[AvailabilityService] Running batch update for ${saunas.length} saunas...`);

    const results = [];
    for (const sauna of saunas) {
        try {
            results.push(await updateSaunaAvailability(sauna.id));
        } catch (e) {
            results.push({ error: String(e) });
        }
    }

    return results;
}
