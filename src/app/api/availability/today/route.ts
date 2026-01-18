import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const saunaId = searchParams.get('saunaId');

    if (!saunaId) {
        return NextResponse.json({ error: 'Missing saunaId' }, { status: 400 });
    }

    try {
        // Only select the fields we need for better performance
        const sauna = await prisma.sauna.findUnique({
            where: { id: saunaId },
            select: {
                availabilityData: true
            }
        });

        if (!sauna) {
            return NextResponse.json({
                days: {},
                timestamp: new Date().toISOString(),
                isInitial: true
            });
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
