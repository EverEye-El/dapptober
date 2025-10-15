import { type NextRequest, NextResponse } from "next/server"
import { createAuth } from "thirdweb/auth"
import { privateKeyToAccount } from "thirdweb/wallets"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Creates a thirdweb Auth instance with dynamic domain detection
 */
function getAuthForRequest(req: NextRequest) {
  const domain = req.headers.get("host") || "localhost:3000"

  const privateKey = process.env.THIRDWEB_AUTH_PRIVATE_KEY
  if (!privateKey) {
    throw new Error("THIRDWEB_AUTH_PRIVATE_KEY environment variable is required")
  }

  return createAuth({
    domain,
    adminAccount: privateKeyToAccount(privateKey),
  })
}

/**
 * GET /api/me
 * Returns the currently authenticated user's wallet address and profile
 * Requires valid thirdweb Auth cookie
 */
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthForRequest(req)
    const user = await auth.getUser(req)

    if (!user?.address) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()
    const walletAddress = user.address.toLowerCase()

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", walletAddress)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error fetching profile:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json({
      address: user.address,
      profile: profile || null,
    })
  } catch (error) {
    console.error("[v0] /api/me error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
