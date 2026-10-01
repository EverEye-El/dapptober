import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"

export async function GET(request: Request) {
  try {
    console.log("[v0] Fetching submissions from database...")

    const supabase = await createClient()
    const edition = new URL(request.url).searchParams.get("edition")
    const archive = edition === "archive"

    let query = supabase
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
        banner_position,
        created_at,
        wallet_address,
        edition_year
      `,
      )
      .order("created_at", { ascending: false })

    query = archive ? query.lt("edition_year", DAPPTOBER_YEAR) : query.eq("edition_year", DAPPTOBER_YEAR)

    const { data: submissions, error } = await query

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
          .eq("submission_id", sub.id)

        const { count: commentsCount } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("submission_id", sub.id)

        return {
          id: sub.id,
          dapp_day: sub.day,
          title: sub.title,
          description: sub.description,
          demo_url: sub.demo_url,
          github_url: sub.github_url,
          image_url: sub.image_url,
          banner_position: sub.banner_position,
          created_at: sub.created_at,
          edition_year: sub.edition_year,
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
