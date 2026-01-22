import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ScraperService } from '@/lib/scraper-service';
import { runScraper } from '@/lib/scraper-runner';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

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

        // Run inside this request to ensure it completes on Vercel
        await runScraper({
            mode,
            saunaIds,
            runId: run.id,
            trigger: 'manual'
        });

        return NextResponse.json({ success: true, runId: run.id });
    } catch (error) {
        console.error('Failed to trigger run:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
