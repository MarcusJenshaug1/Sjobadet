import { NextRequest, NextResponse } from 'next/server';
import { updateAllSaunasAvailability } from '@/lib/availability-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // Verify secret to prevent unauthorized scraping runs (cost/bandwidth protection)
    const authHeader = req.headers.get('authorization');
    const secret = process.env.CRON_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const results = await updateAllSaunasAvailability();
        return NextResponse.json({
            success: true,
            message: `Processed ${results.length} saunas`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[Cron Scraper] Batch update failed:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
