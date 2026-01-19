import { NextRequest, NextResponse } from 'next/server';
import { updateAllSaunasAvailability } from '@/lib/availability-service';
import { getActiveSaunas } from '@/lib/sauna-service';

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
        
        // PRELOAD: Warm up the cache by fetching active saunas with computed next available slots
        // This ensures data is ready for users without delay
        console.log('[Cron Scraper] Preloading cache...');
        await getActiveSaunas({ includeOpeningHours: false });
        
        return NextResponse.json({
            success: true,
            message: `Processed ${results.length} saunas and preloaded cache`,
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
