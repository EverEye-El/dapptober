"use client"

import { createBrowserClient } from "@supabase/ssr"

export function supabaseBrowser() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

/**
 * Sign in to Supabase using wallet address
 * Creates a session via backend API that verifies wallet ownership
 */
export async function signInWithSupabaseWeb3(address: string, signMessage: (message: string) => Promise<string>) {
  console.log("[v0] Starting Supabase Web3 sign-in for address:", address)

  try {
    const nonceResponse = await fetch("/api/auth/web3/nonce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: address.toLowerCase() }),
    })

    if (!nonceResponse.ok) {
      throw new Error("Failed to get nonce")
    }

    const { nonce } = await nonceResponse.json()
    console.log("[v0] Received nonce, requesting signature")

    const message = `Sign this message to authenticate with Dapptober.\n\nNonce: ${nonce}\nAddress: ${address.toLowerCase()}`
    const signature = await signMessage(message)
    console.log("[v0] Message signed, verifying with backend")

    const verifyResponse = await fetch("/api/auth/web3/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: address.toLowerCase(),
        signature,
        message,
      }),
    })

    if (!verifyResponse.ok) {
      const error = await verifyResponse.json()
      throw new Error(error.error || "Failed to verify signature")
    }

    const { session } = await verifyResponse.json()
    console.log("[v0] Supabase Web3 sign-in successful")

    return session
  } catch (error) {
    console.error("[v0] Supabase Web3 sign-in error:", error)
    throw error
  }
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
