"use client"

import { createBrowserClient } from "@supabase/ssr"

let isSigningIn = false
let signInPromise: Promise<any> | null = null

export function supabaseBrowser() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

/**
 * Check if user has an active Supabase session
 */
export async function hasSupabaseSession(): Promise<boolean> {
  const supabase = supabaseBrowser()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return !!session
}

/**
 * Reset sign-in state
 */
export function resetSignInState() {
  isSigningIn = false
  signInPromise = null
  console.log("[v0] Sign-in state reset")
}

/**
 * Ensure user has a Supabase session, creating one if needed using SIWE
 * This is called lazily when user tries to perform an action
 */
export async function ensureSupabaseSession(
  walletAddress: string,
  signMessage: (message: string) => Promise<string>,
): Promise<boolean> {
  const hasSession = await hasSupabaseSession()
  if (hasSession) {
    console.log("[v0] Already has Supabase session")
    return true
  }

  if (isSigningIn && signInPromise) {
    console.log("[v0] Sign-in already in progress, waiting...")
    await signInPromise
    return await hasSupabaseSession()
  }

  console.log("[v0] No session found, initiating SIWE sign-in")

  isSigningIn = true
  signInPromise = (async () => {
    try {
      const nonceRes = await fetch("/api/auth/web3/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress }),
      })

      if (!nonceRes.ok) {
        throw new Error(`Failed to get nonce: ${nonceRes.statusText}`)
      }

      const { nonce } = await nonceRes.json()
      console.log("[v0] Got nonce from server")

      const message = `Sign in to Dapptober\n\nAddress: ${walletAddress}\nNonce: ${nonce}`
      const signature = await signMessage(message)
      console.log("[v0] Message signed by wallet")

      const verifyRes = await fetch("/api/auth/web3/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: walletAddress,
          signature,
          message,
        }),
      })

      if (!verifyRes.ok) {
        const errorText = await verifyRes.text()
        throw new Error(`Verification failed: ${errorText}`)
      }

      const { session } = await verifyRes.json()
      console.log("[v0] Session created successfully")

      const supabase = supabaseBrowser()
      await supabase.auth.setSession(session)

      return session
    } catch (error: any) {
      console.error("[v0] Supabase sign-in error:", error.message || error)
      throw error
    } finally {
      isSigningIn = false
      signInPromise = null
    }
  })()

  try {
    await signInPromise
    return true
  } catch (error) {
    console.error("[v0] Failed to create session:", error)
    return false
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
  resetSignInState()
}
