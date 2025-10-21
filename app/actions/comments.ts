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

export async function addComment(dappDay: number, content: string, walletAddress: string) {
  try {
    console.log("[v0] Server: Adding comment", { dappDay, walletAddress })

    const profileResult = await ensureProfile(walletAddress)

    if (!profileResult.success || !profileResult.profile) {
      console.error("[v0] Server: Failed to ensure profile", profileResult.error)
      return { success: false, error: "Failed to create profile. Please try again." }
    }

    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert({
        wallet_address: walletAddress.toLowerCase(),
        dapp_day: dappDay,
        content: content.trim(),
      })
      .select(
        `
        id,
        content,
        created_at,
        wallet_address
      `,
      )
      .single()

    if (error) {
      console.error("[v0] Server: Comment insert error", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Server: Comment added successfully", data)
    revalidatePath(`/dapp/${dappDay}`)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Server: Unexpected error", error)
    return { success: false, error: "Failed to add comment" }
  }
}
