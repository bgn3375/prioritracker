import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

// No-op lock: disables cross-tab lock coordination via navigator.locks.
// Prevents "Lock was released because another request stole it" errors
// when multiple tabs have the app open.
const noopLock = async (_name, _acquireTimeout, fn) => fn()

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
          flowType: 'implicit',
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
          lock: noopLock,
    },
})
