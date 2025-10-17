import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyMessage } from "ethers"
import { nonces } from "../nonce/route"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { address, signature, message } = await req.json()

    if (!address || !signature || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const lowerAddress = address.toLowerCase()

    // Verify nonce exists and is recent (5 minutes)
    const nonceData = nonces.get(lowerAddress)
    if (!nonceData) {
      return NextResponse.json({ error: "Invalid or expired nonce" }, { status: 400 })
    }

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    if (nonceData.timestamp < fiveMinutesAgo) {
      nonces.delete(lowerAddress)
      return NextResponse.json({ error: "Nonce expired" }, { status: 400 })
    }

    // Verify the signature
    try {
      const recoveredAddress = verifyMessage(message, signature)
      if (recoveredAddress.toLowerCase() !== lowerAddress) {
        return NextResponse.json({ error: "Signature verification failed" }, { status: 401 })
      }
    } catch (error) {
      console.error("[v0] Signature verification error:", error)
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Delete used nonce
    nonces.delete(lowerAddress)

    console.log("[v0] Signature verified for address:", lowerAddress)

    // Find or create user profile
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq("wallet_address", lowerAddress)
      .single()

    let userId: string

    if (existingProfile?.user_id) {
      userId = existingProfile.user_id
      console.log("[v0] Found existing profile for user:", userId)
    } else {
      // Create a new auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: `${lowerAddress}@wallet.local`,
        email_confirm: true,
        user_metadata: {
          wallet_address: lowerAddress,
        },
      })

      if (authError || !authData.user) {
        console.error("[v0] Error creating auth user:", authError)
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
      }

      userId = authData.user.id
      console.log("[v0] Created new auth user:", userId)

      // Create profile
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        user_id: userId,
        wallet_address: lowerAddress,
        last_login_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("[v0] Error creating profile:", profileError)
      }
    }

    // Update last login
    await supabaseAdmin.from("profiles").update({ last_login_at: new Date().toISOString() }).eq("user_id", userId)

    // Generate session token
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: `${lowerAddress}@wallet.local`,
    })

    if (sessionError || !sessionData) {
      console.error("[v0] Error generating session:", sessionError)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    console.log("[v0] Session created successfully for user:", userId)

    return NextResponse.json({
      session: {
        user_id: userId,
        wallet_address: lowerAddress,
      },
    })
  } catch (error) {
    console.error("[v0] Error verifying signature:", error)
    return NextResponse.json({ error: "Failed to verify signature" }, { status: 500 })
  }
}
