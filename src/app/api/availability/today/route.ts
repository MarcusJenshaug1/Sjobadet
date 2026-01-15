import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { fetchAvailability } from '@/lib/availability-scraper';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const saunaId = searchParams.get('saunaId');

    if (!saunaId) {
        return NextResponse.json({ error: 'Missing saunaId' }, { status: 400 });
    }

    try {
        // Use standard Prisma query
        const sauna = await prisma.sauna.findUnique({ where: { id: saunaId } });

        if (!sauna) {
            return NextResponse.json({ error: 'Sauna not found' }, { status: 404 });
        }

        const availabilityData = sauna.availabilityData;
        const lastScrapedAt = sauna.lastScrapedAt;
        const previousAvailabilityData = sauna.previousAvailabilityData;

        const now = new Date();
        const TEN_MINUTES = 1000 * 60 * 10;
        const { searchParams } = new URL(req.url); // Use the same searchParams from earlier
        const force = searchParams.get('force') === 'true';
        const isFresh = !force && lastScrapedAt && (now.getTime() - new Date(lastScrapedAt).getTime() < TEN_MINUTES);

        // If data is stale OR missing OR forced, trigger background refresh
        if (!isFresh) {
            console.log(`[Availability] Data for ${saunaId} is stale or missing. Triggering background refresh.`);

            const refreshData = async () => {
                try {
                    const dropinUrl = sauna.bookingUrlDropin;

                    // Fetch new structure { date, slots }
                    const scrapeResult = dropinUrl && dropinUrl.includes('periode.no')
                        ? await fetchAvailability(dropinUrl)
                        : { date: null, slots: [] };

                    const result = {
                        date: scrapeResult.date,
                        slots: scrapeResult.slots,
                        timestamp: new Date().toISOString(),
                    };

                    const resultJson = JSON.stringify(result);

                    await prisma.sauna.update({
                        where: { id: saunaId },
                        data: {
                            previousAvailabilityData: availabilityData,
                            availabilityData: resultJson,
                            lastScrapedAt: new Date().toISOString()
                        }
                    });

                    console.log(`[Availability] Background refresh complete for ${saunaId}`);
                } catch (err) {
                    console.error(`[Availability] Background refresh failed for ${saunaId}:`, err);
                }
            };

            // Start background work without awaiting
            refreshData();
        }

        // Return current data immediately (or fallback to previous if current is null)
        const currentData = availabilityData ? JSON.parse(availabilityData) : null;
        const fallbackData = previousAvailabilityData ? JSON.parse(previousAvailabilityData) : null;

        const resultData = currentData || fallbackData;

        if (!resultData) {
            return NextResponse.json({
                date: null,
                slots: [],
                timestamp: new Date().toISOString(),
                isInitial: true
            });
        }

        return NextResponse.json(resultData);
    } catch (error) {
        console.error('Error in availability API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
