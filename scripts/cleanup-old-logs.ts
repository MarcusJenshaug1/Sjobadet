/**
 * Cleanup script to remove old SCRAPER_RUN logs from the AdminLog table
 * This is a one-time cleanup to remove the old logging entries
 */

import prisma from '../src/lib/prisma'

async function cleanupOldLogs() {
    try {
        console.log('[Cleanup] Starting to remove old SCRAPER_RUN logs...')

        // Delete all SCRAPER_RUN logs
        const result = await (prisma as any).adminLog.deleteMany({
            where: { action: 'SCRAPER_RUN' }
        })

        console.log(`[Cleanup] Successfully removed ${result.count} old SCRAPER_RUN log entries`)
        console.log('[Cleanup] Done! New logs will use AVAILABILITY_CHECK action.')
        process.exit(0)
    } catch (err) {
        console.error('[Cleanup] Failed:', err)
        process.exit(1)
    }
}

cleanupOldLogs()
