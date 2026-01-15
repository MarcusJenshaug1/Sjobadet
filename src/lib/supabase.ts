import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    // We don't throw error here to allow build to pass, but logic using this will fail if keys are missing
    console.warn('Supabase credentials missing')
}

// Admin client with service role for server-side operations (bypassing RLS)
export const supabaseAdmin = createClient(
    supabaseUrl || '',
    supabaseServiceKey || ''
)
