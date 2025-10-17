"use client"

import { createBrowserClient } from "@supabase/ssr"

export function supabaseBrowser() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

/**
 * Call this right after the wallet connects (e.g., ConnectButton onConnect)
 * - Mints Supabase session via SIWE
 * - Ensures a profile row exists and attaches the wallet address (lowercased)
 */
export async function signInWithSupabaseWeb3(address?: string) {
  const supabase = supabaseBrowser()

  console.log("[v0] Signing in with Supabase Web3 for address:", address)

  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        wallet_address: address ? address.toLowerCase() : null,
      },
    },
  })

  if (error) {
    console.error("[v0] Supabase Web3 sign-in error:", error)
    throw error
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    console.log("[v0] Upserting profile for user:", user.id)
    const { error: upsertError } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        wallet_address: address ? address.toLowerCase() : null,
        last_login_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )

    if (upsertError) {
      console.error("[v0] Profile upsert error:", upsertError)
    }
  }

  console.log("[v0] Supabase Web3 sign-in successful")
  return data
}

/**
 * Sign out from Supabase
 */
export async function signOutSupabase() {
  const supabase = supabaseBrowser()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("[v0] Supabase sign-out error:", error)
    throw error
  }
}
