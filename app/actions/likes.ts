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

export async function toggleLike(dappDay: number, walletAddress: string) {
  try {
    console.log("[v0] Server: Toggling like", { dappDay, walletAddress })

    const profileResult = await ensureProfile(walletAddress)

    if (!profileResult.success) {
      console.error("[v0] Server: Failed to ensure profile", profileResult.error)
      return { success: false, error: "Failed to create profile. Please try again." }
    }

    const normalizedAddress = walletAddress.toLowerCase()

    const { data: existingLike } = await supabaseAdmin
      .from("likes")
      .select("id")
      .eq("wallet_address", normalizedAddress)
      .eq("dapp_day", dappDay)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await supabaseAdmin
        .from("likes")
        .delete()
        .eq("wallet_address", normalizedAddress)
        .eq("dapp_day", dappDay)

      if (error) {
        console.error("[v0] Server: Unlike error", error)
        return { success: false, error: error.message }
      }

      console.log("[v0] Server: Unliked successfully")
      revalidatePath(`/dapp/${dappDay}`)
      return { success: true, isLiked: false }
    } else {
      const { error } = await supabaseAdmin.from("likes").insert({
        wallet_address: normalizedAddress,
        dapp_day: dappDay,
      })

      if (error) {
        console.error("[v0] Server: Like error", error)
        return { success: false, error: error.message }
      }

      console.log("[v0] Server: Liked successfully")
      revalidatePath(`/dapp/${dappDay}`)
      return { success: true, isLiked: true }
    }
  } catch (error) {
    console.error("[v0] Server: Unexpected error", error)
    return { success: false, error: "Failed to toggle like" }
  }
}
