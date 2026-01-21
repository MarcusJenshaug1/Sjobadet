import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const cursor = searchParams.get('cursor'); // for potential pagination
    const status = searchParams.get('status');
    const trigger = searchParams.get('trigger');

    try {
        const where: any = {};
        if (status) where.status = status;
        if (trigger) where.trigger = trigger;

        const runs = await prisma.scrapeRun.findMany({
            where,
            take: limit,
            orderBy: { startedAt: 'desc' },
            include: {
                _count: {
                    select: { items: true }
                }
            }
        });

        return NextResponse.json({ runs });
    } catch (error) {
        console.error('Failed to fetch runs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
