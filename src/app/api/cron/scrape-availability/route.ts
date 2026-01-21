import { NextRequest, NextResponse } from 'next/server';
import { runScraper } from '@/lib/scraper-runner';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // Verify secret to prevent unauthorized scraping runs (cost/bandwidth protection)
    const authHeader = req.headers.get('authorization');
    const secret = process.env.CRON_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('[Cron Scraper] triggered');

        // Use the new runner to ensure it shows up in history and logs events
        await runScraper({
            mode: 'all',
            trigger: 'cron'
        });

        return NextResponse.json({
            success: true,
            message: `Scraper run initiated successfully`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[Cron Scraper] Update failed:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
