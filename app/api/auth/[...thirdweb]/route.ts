import type { NextRequest } from "next/server"
import { createAuth } from "thirdweb/auth"
import { privateKeyToAccount } from "thirdweb/wallets"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Creates a thirdweb Auth instance with dynamic domain detection.
 * The domain is auto-detected from the request host header, which allows
 * the same code to work across v0.app, Vercel previews, and production.
 */
function getAuthForRequest(req: NextRequest) {
  // Prefer explicit env var, otherwise use incoming Host header, fallback to localhost
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
 * GET handler for thirdweb Auth
 * Handles SIWE message generation and verification
 */
export async function GET(req: NextRequest) {
  const auth = getAuthForRequest(req)
  return auth.handlers().GET!(req)
}

/**
 * POST handler for thirdweb Auth
 * 1. Verifies SIWE signature and sets secure HTTP-only cookie
 * 2. Upserts user profile in Supabase with lowercased wallet address
 */
export async function POST(req: NextRequest) {
  const auth = getAuthForRequest(req)

  // Step 1: thirdweb verifies SIWE signature and sets secure HTTP-only cookie
  const res = await auth.handlers().POST!(req)

  // Step 2: Upsert profile in Supabase (non-blocking)
  try {
    const user = await auth.getUser(req)
    if (user?.address) {
      const supabase = createAdminClient()
      const walletAddress = user.address.toLowerCase()

      console.log("[v0] Upserting profile for wallet:", walletAddress)

      await supabase.from("profiles").upsert(
        {
          wallet_address: walletAddress,
          last_login_at: new Date().toISOString(),
        },
        { onConflict: "wallet_address" },
      )

      console.log("[v0] Profile upserted successfully")
    }
  } catch (e) {
    console.error("[v0] Profile upsert error:", e)
    // Don't fail the auth response if profile upsert fails
  }

  return res
}
