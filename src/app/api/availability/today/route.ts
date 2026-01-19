import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { fetchAvailability } from '@/lib/availability-scraper';

// Cache for 5 minutes, revalidate in background
export const revalidate = 300;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const saunaId = searchParams.get('saunaId');
    const force = searchParams.get('force') === 'true';

    if (!saunaId) {
        return NextResponse.json({ error: 'Missing saunaId' }, { status: 400 });
    }

    try {
        // Only select the fields we need for better performance
        const sauna = await prisma.sauna.findUnique({
            where: { id: saunaId },
            select: {
                availabilityData: true,
                previousAvailabilityData: true,
                bookingAvailabilityUrlDropin: true,
                lastScrapedAt: true,
            }
        });

        if (!sauna) {
            return NextResponse.json({
                days: {},
                timestamp: new Date().toISOString(),
                isInitial: true
            });
        }

        const shouldScrape = (() => {
            if (force) return true;
            if (!sauna.lastScrapedAt) return true;
            const ageMs = Date.now() - new Date(sauna.lastScrapedAt).getTime();
            return ageMs > 5 * 60 * 1000; // 5 minutes
        })();

        if (shouldScrape && sauna.bookingAvailabilityUrlDropin) {
            try {
                const fresh = await fetchAvailability(sauna.bookingAvailabilityUrlDropin);
                const existing = (() => {
                    try {
                        return sauna.availabilityData ? JSON.parse(sauna.availabilityData) : { days: {} };
                    } catch {
                        return { days: {} };
                    }
                })();

                const mergedDays = {
                    ...(existing.days || {}),
                    ...(fresh.date ? { [fresh.date]: fresh.slots } : {}),
                };

                const payload = JSON.stringify({
                    days: mergedDays,
                    timestamp: new Date().toISOString(),
                });

                await prisma.sauna.update({
                    where: { id: saunaId },
                    data: {
                        previousAvailabilityData: sauna.availabilityData,
                        availabilityData: payload,
                        lastScrapedAt: new Date(),
                    }
                });

                return NextResponse.json(JSON.parse(payload));
            } catch (scrapeError) {
                console.error('[Availability] Scrape failed, falling back to cache:', scrapeError);
            }
        }

        // Parse and return the data from the database
        let resultData = null;
        try {
            if (sauna.availabilityData) {
                resultData = JSON.parse(sauna.availabilityData);
            }
        } catch (parseError) {
            console.error('[Availability] JSON parse error:', parseError);
        }

        if (!resultData) {
            return NextResponse.json({
                days: {},
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
