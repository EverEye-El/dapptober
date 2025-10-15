import { createClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client using the Service Role key.
 * This bypasses Row Level Security (RLS) and should only be used in API routes.
 * DO NOT import this in client-side code.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables for admin client")
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
