import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { refreshWaterTemperatureForSaunaId } from '@/lib/water-temperature-service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');
    const authHeader = request.headers.get('authorization');
    const secret = process.env.CRON_SECRET;

    const isAuthorized = secret && (
        querySecret === secret ||
        authHeader === `Bearer ${secret}`
    );

    if (secret && !isAuthorized) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const saunas = await prisma.sauna.findMany({
            where: {
                latitude: { not: null },
                longitude: { not: null },
            },
            select: { id: true },
        });

        let refreshed = 0;
        let failed = 0;

        for (const sauna of saunas) {
            const data = await refreshWaterTemperatureForSaunaId(sauna.id);
            if (data) {
                refreshed += 1;
            } else {
                failed += 1;
            }
        }

        return NextResponse.json({
            message: 'Water temperature refresh completed',
            total: saunas.length,
            refreshed,
            failed,
        });
    } catch (error) {
        console.error('Water temperature refresh failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
