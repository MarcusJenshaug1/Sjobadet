import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const trigger = searchParams.get('trigger');

    const skip = (page - 1) * limit;

    try {
        const where: any = {};
        if (status) where.status = status;
        if (trigger) where.trigger = trigger;

        // Get total count for pagination metadata
        const total = await prisma.scrapeRun.count({ where });

        const runs = await prisma.scrapeRun.findMany({
            where,
            take: limit,
            skip,
            orderBy: { startedAt: 'desc' },
            include: {
                _count: {
                    select: { items: true }
                }
            }
        });

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            runs,
            pagination: {
                total,
                page,
                limit,
                totalPages
            }
        });
    } catch (error) {
        console.error('Failed to fetch runs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
