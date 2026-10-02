"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { submitDayValidationError } from "@/lib/community/dapptober-calendar"
import { ensureProfile } from "./profiles"

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const BUCKET = "submission-images"

export async function uploadCompetitionMetadata(body: {
  name: string
  description: string
  demoUrl: string
  imageUrl: string | null
  owner: string
  day: number
}) {
  const path = `meta/${crypto.randomUUID()}.json`
  const payload = JSON.stringify(body)
  const { error: bucketError } = await supabaseAdmin.storage.createBucket(BUCKET, { public: true })
  if (bucketError && !/already exists/i.test(bucketError.message)) {
    return { success: false as const, error: bucketError.message }
  }
  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, payload, {
    contentType: "application/json",
    upsert: false,
  })
  if (error) return { success: false as const, error: error.message }
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
  return { success: true as const, url: data.publicUrl }
}

export async function recordCompetitionEntry(input: {
  onchainEntryId: number
  walletAddress: string
  name: string
  description: string
  demoUrl: string
  imageUrl?: string | null
  metadataUri: string
  txHash: string
  day: number
}) {
  const dayError = submitDayValidationError(input.day)
  if (dayError) return { success: false as const, error: dayError }

  const profile = await ensureProfile(input.walletAddress)
  if (!profile.success) return { success: false as const, error: "Failed to create profile." }

  const { error } = await supabaseAdmin.from("competition_entries").insert({
    onchain_entry_id: input.onchainEntryId,
    wallet_address: input.walletAddress.toLowerCase(),
    name: input.name.trim(),
    description: input.description.trim(),
    demo_url: input.demoUrl.trim(),
    image_url: input.imageUrl ?? null,
    metadata_uri: input.metadataUri,
    tx_hash: input.txHash,
    day: input.day,
    status: "registered",
  })
  if (error) return { success: false as const, error: error.message }
  revalidatePath("/showcase")
  revalidatePath("/competition")
  return { success: true as const }
}

export async function recordCompetitionVote(input: { entryId: string; walletAddress: string; txHash: string }) {
  const { error } = await supabaseAdmin.from("competition_votes").insert({
    entry_id: input.entryId,
    wallet_address: input.walletAddress.toLowerCase(),
    tx_hash: input.txHash,
  })
  if (error && !/duplicate|unique/i.test(error.message)) {
    return { success: false as const, error: error.message }
  }
  revalidatePath("/showcase")
  revalidatePath("/competition")
  revalidatePath(`/competition/${input.entryId}`)
  return { success: true as const }
}
