import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("[v0] Fetching submissions from database...")

    const supabase = await createClient()

    const { data: submissions, error } = await supabase
      .from("submissions")
      .select(
        `
        id,
        day,
        title,
        description,
        demo_url,
        github_url,
        image_url,
        created_at,
        wallet_address
      `,
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log("[v0] Found submissions:", submissions?.length || 0)

    const formattedSubmissions = await Promise.all(
      (submissions || []).map(async (sub: any) => {
        // Fetch profile by wallet_address
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, wallet_address, avatar_url")
          .eq("wallet_address", sub.wallet_address)
          .single()

        const { count: likesCount } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("dapp_day", sub.day)

        const { count: commentsCount } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("dapp_day", sub.day)

        return {
          id: sub.id,
          dapp_day: sub.day,
          title: sub.title,
          description: sub.description,
          demo_url: sub.demo_url,
          github_url: sub.github_url,
          image_url: sub.image_url,
          created_at: sub.created_at,
          profile: profile || {
            display_name: null,
            wallet_address: sub.wallet_address,
            avatar_url: null,
          },
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
        }
      }),
    )

    return NextResponse.json(formattedSubmissions)
  } catch (error) {
    console.error("[v0] Error fetching submissions:", error)
    return NextResponse.json(
      { error: "Failed to fetch submissions", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
