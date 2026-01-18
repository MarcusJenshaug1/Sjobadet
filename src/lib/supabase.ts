import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabaseAdminInstance: SupabaseClient | null = null

export const getSupabaseAdmin = (): SupabaseClient => {
    if (supabaseAdminInstance) return supabaseAdminInstance

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase credentials missing. Operation cannot proceed.')
    }

    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey)
    return supabaseAdminInstance
}

// Deprecated: Use getSupabaseAdmin() instead. 
// Kept for brief compatibility if absolutely needed, but better to update all callers.
export const supabaseAdmin = (function () {
    const proxy = new Proxy({}, {
        get(_, prop) {
            return (getSupabaseAdmin() as any)[prop]
        }
    })
    return proxy as SupabaseClient
})()
