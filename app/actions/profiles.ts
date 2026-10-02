"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

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

    revalidatePath(`/profile/${normalizedAddress}`)
    return { success: true, profile: data }
  } catch (error) {
    return { success: false, error: "Failed to update profile" }
  }
}

const AVATAR_BUCKET = "submission-images"
const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

export async function uploadProfileImage(formData: FormData) {
  try {
    const file = formData.get("file")
    if (!(file instanceof File)) return { success: false as const, error: "Choose an image file." }
    if (!AVATAR_TYPES.has(file.type)) return { success: false as const, error: "Use a PNG, JPG, WEBP, or GIF." }
    if (file.size > MAX_AVATAR_BYTES) return { success: false as const, error: "Image must be 5 MB or smaller." }

    const { error: bucketError } = await supabaseAdmin.storage.createBucket(AVATAR_BUCKET, { public: true })
    if (bucketError && !/already exists/i.test(bucketError.message)) {
      return { success: false as const, error: bucketError.message }
    }

    const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "png"
    const path = `avatars/${crypto.randomUUID()}.${ext}`
    const bytes = Buffer.from(await file.arrayBuffer())
    const { error } = await supabaseAdmin.storage.from(AVATAR_BUCKET).upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    })
    if (error) return { success: false as const, error: error.message }

    const { data } = supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(path)
    return { success: true as const, url: data.publicUrl }
  } catch {
    return { success: false as const, error: "Failed to upload profile image." }
  }
}

export async function getProfilePage(walletAddress: string) {
  const normalizedAddress = walletAddress.toLowerCase().replace("@wallet.local", "")
  const profileResult = await getProfile(normalizedAddress)
  if (!profileResult.success || !profileResult.profile) {
    return { success: false as const, error: profileResult.error || "Profile not found" }
  }

  const submissionsResult = await getProfileSubmissions(normalizedAddress)
  const submissions = submissionsResult.success ? submissionsResult.submissions : []

  const { count: commentsCount } = await supabaseAdmin
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("wallet_address", normalizedAddress)

  const { count: likesCount } = await supabaseAdmin
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("wallet_address", normalizedAddress)

  const { data: comments } = await supabaseAdmin
    .from("comments")
    .select("id, content, created_at, dapp_day, submission_id, entry_id")
    .eq("wallet_address", normalizedAddress)
    .order("created_at", { ascending: false })
    .limit(20)

  const { data: agents } = await supabaseAdmin
    .from("competition_entries")
    .select("id, name, description, created_at")
    .eq("wallet_address", normalizedAddress)
    .order("created_at", { ascending: false })

  return {
    success: true as const,
    profile: profileResult.profile,
    submissions: submissions ?? [],
    commentsCount: commentsCount || 0,
    likesCount: likesCount || 0,
    comments: comments ?? [],
    agents: agents ?? [],
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
