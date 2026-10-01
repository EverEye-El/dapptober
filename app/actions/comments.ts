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

export async function addComment(target: EngagementTarget, content: string, walletAddress: string) {
  try {
    const profileResult = await ensureProfile(walletAddress)

    if (!profileResult.success || !profileResult.profile) {
      return { success: false, error: "Failed to create profile. Please try again." }
    }

    const row = isPromptTarget(target)
      ? {
          wallet_address: walletAddress.toLowerCase(),
          dapp_day: target.dappDay,
          submission_id: null,
          content: content.trim(),
        }
      : {
          wallet_address: walletAddress.toLowerCase(),
          dapp_day: target.dappDay,
          submission_id: target.submissionId,
          content: content.trim(),
        }

    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert(row)
      .select("id, content, created_at, wallet_address")
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidateEngagement(target)
    return { success: true, data }
  } catch {
    return { success: false, error: "Failed to add comment" }
  }
}
