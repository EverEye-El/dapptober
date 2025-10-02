"use server"

import { createClient } from "./server"

export interface Profile {
  id: string
  wallet_address: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  twitter_handle: string | null
  github_handle: string | null
  website_url: string | null
  created_at: string
  updated_at: string
}

export interface Submission {
  id: string
  user_id: string
  day: number
  title: string
  description: string
  tags: string[]
  technical_implementation: string | null
  key_features: string[]
  demo_url: string | null
  github_url: string | null
  image_url: string | null
  status: string
  created_at: string
  updated_at: string
}

export async function getProfileByWallet(walletAddress: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", walletAddress.toLowerCase())
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, profile: data as Profile }
  } catch (error) {
    console.error("[v0] Get profile error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get profile",
    }
  }
}

export async function getUserSubmissions(userId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", userId)
      .order("day", { ascending: true })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, submissions: data as Submission[] }
  } catch (error) {
    console.error("[v0] Get submissions error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get submissions",
    }
  }
}

export async function getUserCommentCount(userId: string) {
  try {
    const supabase = await createClient()

    const { count, error } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, count: count || 0 }
  } catch (error) {
    console.error("[v0] Get comment count error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get comment count",
    }
  }
}
