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
        // Use raw SQL to bypass out-of-date Prisma client if necessary
        const saunas = await prisma.$queryRaw`SELECT * FROM Sauna WHERE id = ${saunaId} LIMIT 1` as any[];
        const sauna = saunas[0];

        if (!sauna) {
            return NextResponse.json({ error: 'Sauna not found' }, { status: 404 });
        }

        const availabilityData = sauna.availabilityData;
        const lastScrapedAt = sauna.lastScrapedAt;
        const previousAvailabilityData = sauna.previousAvailabilityData;

        const now = new Date();
        const FIVE_MINUTES = 1000 * 60 * 5;
        const isFresh = lastScrapedAt && (now.getTime() - new Date(lastScrapedAt).getTime() < FIVE_MINUTES);

        // If data is stale OR missing, trigger background refresh
        if (!isFresh) {
            console.log(`[Availability] Data for ${saunaId} is stale or missing. Triggering background refresh.`);

            const refreshData = async () => {
                try {
                    const dropinUrl = sauna.bookingAvailabilityUrlDropin ||
                        (sauna.bookingUrlDropin?.includes('periode.no') ? sauna.bookingUrlDropin : null);
                    const privatUrl = sauna.bookingAvailabilityUrlPrivat ||
                        (sauna.bookingUrlPrivat?.includes('periode.no') ? sauna.bookingUrlPrivat : null);

                    const [dropin, privat] = await Promise.all([
                        dropinUrl ? fetchAvailability(dropinUrl) : Promise.resolve([]),
                        privatUrl ? fetchAvailability(privatUrl) : Promise.resolve([]),
                    ]);

                    const result = {
                        dropin,
                        privat,
                        timestamp: new Date().toISOString(),
                    };

                    const resultJson = JSON.stringify(result);

                    // Update DB with raw SQL to ensure it works even if client isn't updated
                    await prisma.$executeRaw`
                        UPDATE Sauna 
                        SET previousAvailabilityData = ${availabilityData}, 
                            availabilityData = ${resultJson}, 
                            lastScrapedAt = ${new Date().toISOString()}
                        WHERE id = ${saunaId}
                    `;

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
            // Very first time, no data at all. We might have to wait or return empty.
            // But background refresh is already running. We'll return empty for now
            // and the frontend will poll again.
            return NextResponse.json({
                dropin: [],
                privat: [],
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
