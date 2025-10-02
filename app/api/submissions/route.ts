import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { title, description, demo_url, github_url, image_url, day } = body

    // Validate required fields
    if (!title || !description || !demo_url || !github_url || !day) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already submitted for this day
    const { data: existingSubmission } = await supabase
      .from("submissions")
      .select("id")
      .eq("user_id", user.id)
      .eq("day", day)
      .single()

    if (existingSubmission) {
      return NextResponse.json({ error: "You have already submitted for this day" }, { status: 400 })
    }

    // Insert submission
    const { data, error } = await supabase
      .from("submissions")
      .insert({
        user_id: user.id,
        title,
        description,
        demo_url,
        github_url,
        image_url: image_url || null,
        day,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Submission error:", error)
      return NextResponse.json({ error: "Failed to create submission" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
