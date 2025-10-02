"use server"

import { createClient } from "./server"

export interface Comment {
  id: string
  content: string
  created_at: string
  profiles: {
    display_name: string | null
    wallet_address: string | null
    avatar_url: string | null
  } | null
}

export async function getCommentsByDappDay(dappDay: number) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        profiles (
          display_name,
          wallet_address,
          avatar_url
        )
      `,
      )
      .eq("dapp_day", dappDay)
      .order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, comments: data as Comment[] }
  } catch (error) {
    console.error("[v0] Get comments error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get comments",
    }
  }
}

export async function createComment(dappDay: number, content: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        dapp_day: dappDay,
        content: content.trim(),
      })
      .select(
        `
        id,
        content,
        created_at,
        profiles (
          display_name,
          wallet_address,
          avatar_url
        )
      `,
      )
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, comment: data as Comment }
  } catch (error) {
    console.error("[v0] Create comment error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create comment",
    }
  }
}

export async function deleteComment(commentId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("user_id", user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Delete comment error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete comment",
    }
  }
}
