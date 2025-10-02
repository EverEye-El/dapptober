"use server"

import { createClient } from "@/lib/supabase/server"
import { verifySignature } from "thirdweb/auth"
import { client } from "./thirdweb-client"

export async function authenticateWithWallet(address: string, signature: string, message: string) {
  try {
    // Verify the signature using thirdweb
    const isValid = await verifySignature({
      client,
      message,
      signature,
      address,
    })

    if (!isValid) {
      return { success: false, error: "Invalid signature" }
    }

    const supabase = await createClient()
    const normalizedAddress = address.toLowerCase()

    // Check if user exists with this wallet
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", normalizedAddress)
      .single()

    if (existingProfile) {
      // User exists, sign them in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${normalizedAddress}@wallet.local`,
        password: normalizedAddress,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user, profile: existingProfile }
    } else {
      // Create new user
      const { data, error } = await supabase.auth.signUp({
        email: `${normalizedAddress}@wallet.local`,
        password: normalizedAddress,
        options: {
          data: {
            wallet_address: normalizedAddress,
            display_name: `${address.slice(0, 6)}...${address.slice(-4)}`,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Fetch the newly created profile
      const { data: newProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("wallet_address", normalizedAddress)
        .single()

      return { success: true, user: data.user, profile: newProfile }
    }
  } catch (error) {
    console.error("[v0] Auth error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    return { success: true, profile }
  } catch (error) {
    console.error("[v0] Get profile error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get profile",
    }
  }
}

export async function updateUserProfile(updates: {
  display_name?: string
  bio?: string
  twitter_handle?: string
  github_handle?: string
  website_url?: string
  avatar_url?: string
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, profile: data }
  } catch (error) {
    console.error("[v0] Update profile error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    }
  }
}
