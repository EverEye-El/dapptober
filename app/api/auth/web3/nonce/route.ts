import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Store nonces temporarily (in production, use Redis or database)
const nonces = new Map<string, { nonce: string; timestamp: number }>()

// Clean up old nonces every 5 minutes
setInterval(
  () => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    for (const [address, data] of nonces.entries()) {
      if (data.timestamp < fiveMinutesAgo) {
        nonces.delete(address)
      }
    }
  },
  5 * 60 * 1000,
)

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json()

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // Generate a random nonce
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Store nonce with timestamp
    nonces.set(address.toLowerCase(), {
      nonce,
      timestamp: Date.now(),
    })

    console.log("[v0] Generated nonce for address:", address)

    return NextResponse.json({ nonce })
  } catch (error) {
    console.error("[v0] Error generating nonce:", error)
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 })
  }
}

export { nonces }
