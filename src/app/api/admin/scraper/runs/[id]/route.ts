import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const run = await prisma.scrapeRun.findUnique({
            where: { id },
            include: {
                items: {
                    orderBy: { startedAt: 'asc' }
                },
                events: {
                    orderBy: { createdAt: 'desc' },
                    take: 100 // limit logs initially
                }
            }
        });

        if (!run) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ run });
    } catch (error) {
        console.error('Failed to fetch run:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
