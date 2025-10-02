import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifySignature } from "thirdweb/auth"
import { client } from "@/lib/web3/thirdweb-client"

export async function POST(request: NextRequest) {
  try {
    const { address, signature, message } = await request.json()

    console.log("[v0] API: Authenticating wallet:", address)

    // Verify the signature using thirdweb
    const isValid = await verifySignature({
      client,
      message,
      signature,
      address,
    })

    if (!isValid) {
      console.error("[v0] API: Invalid signature")
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 })
    }

    const supabase = await createClient()
    const normalizedAddress = address.toLowerCase()

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, wallet_address, display_name")
      .eq("wallet_address", normalizedAddress)
      .maybeSingle()

    if (existingProfile) {
      console.log("[v0] API: Profile exists, signing in existing user")
      const email = `${normalizedAddress}@wallet.local`
      const password = normalizedAddress // Use wallet address as password

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("[v0] API: Sign in error:", signInError.message)
        return NextResponse.json({ success: false, error: signInError.message }, { status: 400 })
      }

      console.log("[v0] API: Signed in successfully")
      return NextResponse.json({
        success: true,
        profile: existingProfile,
        session: signInData.session,
      })
    }

    console.log("[v0] API: Creating new user for wallet")
    const email = `${normalizedAddress}@wallet.local`
    const password = normalizedAddress // Use wallet address as password

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // No email confirmation needed
        data: {
          wallet_address: normalizedAddress,
        },
      },
    })

    if (authError || !authData.user) {
      console.error("[v0] API: User creation error:", authError?.message)
      return NextResponse.json(
        { success: false, error: authError?.message || "Failed to create user" },
        { status: 400 },
      )
    }

    console.log("[v0] API: User created, creating profile")

    const { data: newProfile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        wallet_address: normalizedAddress,
        display_name: `${address.slice(0, 6)}...${address.slice(-4)}`,
      })
      .select("id, wallet_address, display_name")
      .single()

    if (profileError) {
      console.error("[v0] API: Profile creation error:", profileError.message)
      return NextResponse.json({ success: false, error: profileError.message }, { status: 400 })
    }

    console.log("[v0] API: Profile created successfully")
    return NextResponse.json({
      success: true,
      profile: newProfile,
      session: authData.session,
    })
  } catch (error) {
    console.error("[v0] API: Auth error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 500 },
    )
  }
}
