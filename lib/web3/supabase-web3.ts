"use client"

import { createBrowserClient } from "@supabase/ssr"
import { signMessage as thirdwebSignMessage } from "thirdweb/utils"
import type { Account } from "thirdweb/wallets"

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
 * Ensure user has a Supabase session, creating one if needed
 * This is called lazily when user tries to perform an action
 */
export async function ensureSupabaseSession(account: Account): Promise<boolean> {
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

  console.log("[v0] No session found, initiating sign-in")

  isSigningIn = true
  signInPromise = (async () => {
    try {
      const address = account.address.toLowerCase()

      const nonceResponse = await fetch("/api/auth/web3/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })

      if (!nonceResponse.ok) {
        throw new Error("Failed to get nonce")
      }

      const { nonce } = await nonceResponse.json()
      console.log("[v0] Received nonce, requesting signature")

      const message = `Sign this message to authenticate with Dapptober.\n\nNonce: ${nonce}\nAddress: ${address}`

      const signature = await thirdwebSignMessage({
        message,
        account,
      })

      console.log("[v0] Message signed, verifying with backend")

      const verifyResponse = await fetch("/api/auth/web3/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          signature,
          message,
        }),
      })

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json()
        throw new Error(error.error || "Failed to verify signature")
      }

      const { session } = await verifyResponse.json()
      console.log("[v0] Supabase session created successfully")

      return session
    } catch (error: any) {
      console.error("[v0] Supabase sign-in error:", error)

      if (error?.code === -32002 || error?.message?.includes("already pending")) {
        throw new Error("You have a pending signature request in your wallet. Please approve or reject it first.")
      }

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
