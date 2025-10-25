"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { ensureProfile } from "./profiles"

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

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

    const normalizedAddress = walletAddress.toLowerCase()

    const { data: existingSubmission } = await supabaseAdmin
      .from("submissions")
      .select("id")
      .eq("wallet_address", normalizedAddress)
      .eq("day", dappDay)
      .single()

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
    revalidatePath("/")
    return { success: true, data: submission }
  } catch (error) {
    console.error("[v0] Server: Unexpected error", error)
    return { success: false, error: "Failed to submit DApp" }
  }
}
