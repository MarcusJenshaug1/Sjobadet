import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateSaunaAvailability } from '@/lib/availability-service';

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
        const sauna = await prisma.sauna.findUnique({
            where: { id: saunaId },
            select: {
                availabilityData: true,
                lastScrapedAt: true,
                bookingAvailabilityUrlDropin: true,
                bookingUrlDropin: true,
            }
        });

        if (!sauna) {
            return NextResponse.json({ days: {}, timestamp: new Date().toISOString(), isInitial: true });
        }

        const shouldScrape = (() => {
            if (force) return true;
            if (!sauna.lastScrapedAt) return true;
            const ageMs = Date.now() - new Date(sauna.lastScrapedAt).getTime();
            return ageMs > 5 * 60 * 1000; // 5 minutes
        })();

        const availabilityUrl = sauna.bookingAvailabilityUrlDropin || sauna.bookingUrlDropin;
        if (shouldScrape && availabilityUrl) {
            try {
                const refreshedData = await updateSaunaAvailability(saunaId);
                if (refreshedData) return NextResponse.json(refreshedData.data);
            } catch (scrapeError) {
                console.error('[Availability] Scrape failed, falling back to cache:', scrapeError);
            }
        }

        // Return cached data if scraping failed or wasn't needed
        try {
            if (sauna.availabilityData) {
                return NextResponse.json(JSON.parse(sauna.availabilityData));
            }
        } catch (parseError) {
            console.error('[Availability] JSON parse error:', parseError);
        }

        return NextResponse.json({ days: {}, timestamp: new Date().toISOString(), isInitial: true });
    } catch (error) {
        console.error('Error in availability API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
