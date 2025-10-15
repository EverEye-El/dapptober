import { type NextRequest, NextResponse } from "next/server"
import { createAuth } from "thirdweb/auth"
import { privateKeyToAccount } from "thirdweb/wallets"
import { serverClient } from "@/lib/web3/thirdweb-server-client"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    const domain = req.headers.get("host") || "localhost:3000"
    const privateKey = process.env.THIRDWEB_AUTH_PRIVATE_KEY

    if (!privateKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const formattedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`

    const auth = createAuth({
      domain,
      client: serverClient,
      adminAccount: privateKeyToAccount({ privateKey: formattedKey }),
    })

    const verifiedPayload = await auth.verifyPayload(payload)

    if (!verifiedPayload.valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Create or update user profile in Supabase
    const supabase = createAdminClient()
    const walletAddress = verifiedPayload.payload.address.toLowerCase()

    const { error: upsertError } = await supabase.from("profiles").upsert(
      {
        wallet_address: walletAddress,
        last_login_at: new Date().toISOString(),
      },
      {
        onConflict: "wallet_address",
      },
    )

    if (upsertError) {
      console.error("[v0] Error upserting profile:", upsertError)
    }

    // Generate JWT token
    const jwt = await auth.generateJWT({
      payload: verifiedPayload.payload,
    })

    // Set JWT cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set("thirdweb_auth_token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Error during login:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
