import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAuth } from "thirdweb/auth"
import { privateKeyToAccount } from "thirdweb/wallets"
import { createAdminClient } from "@/lib/supabase/admin"
import { serverClient } from "@/lib/web3/thirdweb-server-client"

/**
 * Creates a thirdweb Auth instance with dynamic domain detection
 */
function getAuthForRequest(req: NextRequest) {
  const domain = req.headers.get("host") || "localhost:3000"

  const privateKey = process.env.THIRDWEB_AUTH_PRIVATE_KEY
  if (!privateKey || privateKey.trim() === "") {
    throw new Error(
      "THIRDWEB_AUTH_PRIVATE_KEY environment variable is required. " + "Please add it to your environment variables.",
    )
  }

  const formattedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`

  return createAuth({
    domain,
    client: serverClient,
    adminAccount: privateKeyToAccount({ privateKey: formattedKey }),
  })
}

/**
 * GET /api/me
 * Returns the currently authenticated user's wallet address and profile
 * Requires valid thirdweb Auth JWT cookie
 */
export async function GET(req: NextRequest) {
  try {
    console.log("[v0] /api/me called")

    // Get the JWT from cookies
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    console.log("[v0] All cookies:", allCookies.map((c) => c.name).join(", "))

    const jwtCookie = cookieStore.get("thirdweb_auth_token")

    if (!jwtCookie?.value) {
      console.log("[v0] No JWT cookie found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const domain = req.headers.get("host") || "localhost:3000"
    const privateKey = process.env.THIRDWEB_AUTH_PRIVATE_KEY

    if (!privateKey) {
      console.log("[v0] Server configuration error")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const formattedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`

    const auth = createAuth({
      domain,
      client: serverClient,
      adminAccount: privateKeyToAccount({ privateKey: formattedKey }),
    })

    const verifiedJWT = await auth.verifyJWT({ jwt: jwtCookie.value })

    if (!verifiedJWT.valid) {
      console.log("[v0] Invalid JWT")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract wallet address from JWT (it's in the 'sub' field)
    const walletAddress = verifiedJWT.parsedJWT.sub
    if (!walletAddress) {
      console.log("[v0] No wallet address in JWT")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Verified wallet address:", walletAddress)

    const supabase = createAdminClient()
    const normalizedAddress = walletAddress.toLowerCase()

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", normalizedAddress)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error fetching profile:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json({
      address: walletAddress,
      profile: profile || null,
    })
  } catch (error) {
    console.error("[v0] /api/me error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
