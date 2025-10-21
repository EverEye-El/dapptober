import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // Generate a random nonce
    const nonce = Math.random().toString(36).substring(2, 15)

    // Store nonce temporarily (in production, use Redis or similar)
    // For now, we'll just return it and verify the signature matches
    return NextResponse.json({ nonce })
  } catch (error: any) {
    console.error("[API] Nonce generation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
