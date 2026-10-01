"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { submitDayValidationError } from "@/lib/community/dapptober-calendar"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"
import { ensureProfile } from "./profiles"

const SUBMISSION_IMAGE_BUCKET = "submission-images"
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function uploadSubmissionImage(formData: FormData) {
  try {
    const file = formData.get("file")
    if (!(file instanceof File)) {
      return { success: false as const, error: "Choose an image file." }
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return { success: false as const, error: "Use a PNG, JPG, WEBP, or GIF." }
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { success: false as const, error: "Image must be 5 MB or smaller." }
    }

    const { error: bucketError } = await supabaseAdmin.storage.createBucket(SUBMISSION_IMAGE_BUCKET, {
      public: true,
    })
    if (bucketError && !/already exists/i.test(bucketError.message)) {
      return { success: false as const, error: bucketError.message }
    }

    const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "png"
    const path = `${crypto.randomUUID()}.${ext}`
    const bytes = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage.from(SUBMISSION_IMAGE_BUCKET).upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    })
    if (uploadError) {
      return { success: false as const, error: uploadError.message }
    }

    const { data } = supabaseAdmin.storage.from(SUBMISSION_IMAGE_BUCKET).getPublicUrl(path)
    return { success: true as const, url: data.publicUrl }
  } catch {
    return { success: false as const, error: "Failed to upload image." }
  }
}

export async function submitDapp(
  dappDay: number,
  walletAddress: string,
  data: {
    title: string
    description: string
    demo_url: string
    github_url?: string
    image_url?: string
  },
) {
  try {
    console.log("[v0] Server: Submitting DApp", { dappDay, walletAddress })

    const profileResult = await ensureProfile(walletAddress)

    if (!profileResult.success || !profileResult.profile) {
      console.error("[v0] Server: Failed to ensure profile", profileResult.error)
      return { success: false, error: "Failed to create profile. Please try again." }
    }

    const dayError = submitDayValidationError(dappDay)
    if (dayError) {
      return { success: false, error: dayError }
    }

    const normalizedAddress = walletAddress.toLowerCase()

    const { data: existingSubmission } = await supabaseAdmin
      .from("submissions")
      .select("id")
      .eq("wallet_address", normalizedAddress)
      .eq("day", dappDay)
      .eq("edition_year", DAPPTOBER_YEAR)
      .maybeSingle()

    if (existingSubmission) {
      return { success: false, error: "You have already submitted a DApp for this day" }
    }

    const { data: submission, error } = await supabaseAdmin
      .from("submissions")
      .insert({
        wallet_address: normalizedAddress,
        day: dappDay,
        title: data.title.trim(),
        description: data.description.trim(),
        demo_url: data.demo_url.trim(),
        github_url: data.github_url?.trim() || null,
        image_url: data.image_url?.trim() || null,
        edition_year: DAPPTOBER_YEAR,
        status: "published",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Server: Submission insert error", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Server: DApp submitted successfully", submission)
    revalidatePath(`/dapp/${dappDay}`)
    revalidatePath("/showcase")
    revalidatePath("/")
    return { success: true, data: submission }
  } catch (error) {
    console.error("[v0] Server: Unexpected error", error)
    return { success: false, error: "Failed to submit DApp" }
  }
}

export async function updateSubmission(
  submissionId: string,
  walletAddress: string,
  data: {
    title: string
    description: string
    demo_url: string
    github_url?: string
    image_url?: string | null
  },
) {
  try {
    const normalizedAddress = walletAddress.toLowerCase()
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("submissions")
      .select("id, wallet_address, day")
      .eq("id", submissionId)
      .maybeSingle()

    if (lookupError || !existing) {
      return { success: false as const, error: "That build was not found." }
    }
    if (existing.wallet_address?.toLowerCase() !== normalizedAddress) {
      return { success: false as const, error: "Only the wallet that submitted this build can edit it." }
    }

    const { error } = await supabaseAdmin
      .from("submissions")
      .update({
        title: data.title.trim(),
        description: data.description.trim(),
        demo_url: data.demo_url.trim(),
        github_url: data.github_url?.trim() || null,
        image_url: data.image_url?.trim() || null,
      })
      .eq("id", submissionId)

    if (error) return { success: false as const, error: error.message }

    revalidatePath("/showcase")
    revalidatePath(`/showcase/${submissionId}`)
    revalidatePath(`/dapp/${existing.day}`)
    revalidatePath(`/profile/${normalizedAddress}`)
    return { success: true as const }
  } catch {
    return { success: false as const, error: "Failed to update this build." }
  }
}
