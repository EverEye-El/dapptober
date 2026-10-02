"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import type { EngagementTarget } from "@/lib/community/engagement"
import { ensureProfile } from "./profiles"

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

function revalidateEngagement(target: EngagementTarget) {
  switch (target.kind) {
    case "prompt":
      revalidatePath(`/dapp/${target.dappDay}`)
      return
    case "submission":
      revalidatePath("/showcase")
      revalidatePath(`/showcase/${target.submissionId}`)
      return
    case "entry":
      revalidatePath("/showcase")
      revalidatePath(`/competition/${target.entryId}`)
      return
    default: {
      const unreachable: never = target
      return unreachable
    }
  }
}

function commentRow(target: EngagementTarget, content: string, walletAddress: string) {
  const wallet = walletAddress.toLowerCase()
  const text = content.trim()
  switch (target.kind) {
    case "prompt":
      return {
        wallet_address: wallet,
        dapp_day: target.dappDay,
        submission_id: null,
        entry_id: null,
        content: text,
      }
    case "submission":
      return {
        wallet_address: wallet,
        dapp_day: target.dappDay,
        submission_id: target.submissionId,
        entry_id: null,
        content: text,
      }
    case "entry":
      return {
        wallet_address: wallet,
        dapp_day: null,
        submission_id: null,
        entry_id: target.entryId,
        content: text,
      }
    default: {
      const unreachable: never = target
      return unreachable
    }
  }
}

export async function addComment(target: EngagementTarget, content: string, walletAddress: string) {
  try {
    const profileResult = await ensureProfile(walletAddress)

    if (!profileResult.success || !profileResult.profile) {
      return { success: false, error: "Failed to create profile. Please try again." }
    }

    const row = commentRow(target, content, walletAddress)

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
