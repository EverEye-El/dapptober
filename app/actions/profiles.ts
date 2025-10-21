"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function ensureProfile(walletAddress: string) {
  try {
    console.log("[v0] Server: Ensuring profile for", walletAddress)

    const normalizedAddress = walletAddress.toLowerCase().replace("@wallet.local", "")

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, wallet_address, display_name")
      .eq("wallet_address", normalizedAddress)
      .single()

    if (existingProfile) {
      console.log("[v0] Server: Profile exists", existingProfile)
      return { success: true, profile: existingProfile }
    }

    // Create profile with clean wallet address
    const { data: newProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        wallet_address: normalizedAddress,
        display_name: null, // Will be set by user later
      })
      .select("id, wallet_address, display_name")
      .single()

    if (profileError) {
      console.error("[v0] Server: Profile creation error", profileError)
      return { success: false, error: profileError.message }
    }

    console.log("[v0] Server: Profile created successfully", newProfile)
    return { success: true, profile: newProfile }
  } catch (error) {
    console.error("[v0] Server: Unexpected error", error)
    return { success: false, error: "Failed to ensure profile" }
  }
}

export async function getProfile(walletAddress: string) {
  try {
    const normalizedAddress = walletAddress.toLowerCase().replace("@wallet.local", "")

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("wallet_address", normalizedAddress)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, profile }
  } catch (error) {
    return { success: false, error: "Failed to fetch profile" }
  }
}

export async function updateProfile(
  walletAddress: string,
  updates: { display_name?: string; bio?: string; avatar_url?: string },
) {
  try {
    const normalizedAddress = walletAddress.toLowerCase().replace("@wallet.local", "")

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("wallet_address", normalizedAddress)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, profile: data }
  } catch (error) {
    return { success: false, error: "Failed to update profile" }
  }
}

export async function getProfileSubmissions(walletAddress: string) {
  try {
    const normalizedAddress = walletAddress.toLowerCase().replace("@wallet.local", "")

    const { data, error } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .eq("wallet_address", normalizedAddress)
      .order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, submissions: data }
  } catch (error) {
    return { success: false, error: "Failed to fetch submissions" }
  }
}
