"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import type { EngagementTarget } from "@/lib/community/engagement"
import { isPromptTarget } from "@/lib/community/engagement"
import { ensureProfile } from "./profiles"

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

function revalidateEngagement(target: EngagementTarget) {
  if (isPromptTarget(target)) {
    revalidatePath(`/dapp/${target.dappDay}`)
    return
  }
  revalidatePath("/showcase")
  revalidatePath(`/showcase/${target.submissionId}`)
}

export async function toggleLike(target: EngagementTarget, walletAddress: string) {
  try {
    const profileResult = await ensureProfile(walletAddress)

    if (!profileResult.success) {
      return { success: false, error: "Failed to create profile. Please try again." }
    }

    const normalizedAddress = walletAddress.toLowerCase()

    let existingQuery = supabaseAdmin.from("likes").select("id").eq("wallet_address", normalizedAddress)

    if (isPromptTarget(target)) {
      existingQuery = existingQuery.eq("dapp_day", target.dappDay).is("submission_id", null)
    } else {
      existingQuery = existingQuery.eq("submission_id", target.submissionId)
    }

    const { data: existingLike } = await existingQuery.maybeSingle()

    if (existingLike) {
      const { error } = await supabaseAdmin.from("likes").delete().eq("id", existingLike.id)

      if (error) {
        return { success: false, error: error.message }
      }

      revalidateEngagement(target)
      return { success: true, isLiked: false }
    }

    const row = isPromptTarget(target)
      ? { wallet_address: normalizedAddress, dapp_day: target.dappDay, submission_id: null }
      : {
          wallet_address: normalizedAddress,
          dapp_day: target.dappDay,
          submission_id: target.submissionId,
        }

    const { error } = await supabaseAdmin.from("likes").insert(row)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidateEngagement(target)
    return { success: true, isLiked: true }
  } catch {
    return { success: false, error: "Failed to toggle like" }
  }
}
