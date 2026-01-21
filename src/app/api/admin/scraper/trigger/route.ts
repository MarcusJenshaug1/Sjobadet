import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ScraperService } from '@/lib/scraper-service';
import { runScraper } from '@/lib/scraper-runner';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { mode, saunaIds } = body; // mode: 'all' | 'selected'

        // Create the run entry
        const run = await ScraperService.createRun('manual', `Manual trigger: ${mode}`);

        // Fire and forget (in Vercel this might need waitUntil)
        runScraper({
            mode,
            saunaIds,
            runId: run.id,
            trigger: 'manual'
        }).catch(err => console.error('Background run failed', err));

        return NextResponse.json({ success: true, runId: run.id });

        return NextResponse.json({ success: true, runId: run.id });
    } catch (error) {
        console.error('Failed to trigger run:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
