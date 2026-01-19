/**
 * Cleanup script to remove old SCRAPER_RUN logs from the AdminLog table
 * This is a one-time cleanup to remove the old logging entries
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function cleanupOldLogs() {
    try {
        console.log('[Cleanup] Starting to remove old SCRAPER_RUN logs...')

        // Delete all SCRAPER_RUN logs
        const { data, error, count } = await (supabase as any)
            .from('AdminLog')
            .delete()
            .eq('action', 'SCRAPER_RUN')
            .select('*', { count: 'exact' })

        if (error) {
            console.error('[Cleanup] Error deleting logs:', error)
            process.exit(1)
        }

        console.log(`[Cleanup] Successfully removed ${count} old SCRAPER_RUN log entries`)
        console.log('[Cleanup] Done! New logs will use AVAILABILITY_CHECK action.')
        process.exit(0)
    } catch (err) {
        console.error('[Cleanup] Failed:', err)
        process.exit(1)
    }
}

cleanupOldLogs()
