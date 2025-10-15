import { NextResponse } from "next/server"

/**
 * DEPRECATED: This route has been replaced by /api/auth/[...thirdweb]
 *
 * The new authentication flow uses thirdweb Auth with SIWE (Sign-In with Ethereum)
 * and secure HTTP-only cookies. It also features dynamic domain detection that works
 * across v0.app, Vercel previews, and production without configuration changes.
 *
 * Migration: Update your code to use the ConnectButton with the auth prop instead.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Deprecated",
      message:
        "This endpoint has been replaced. Please use /api/auth/[...thirdweb] via the ConnectButton auth integration.",
    },
    { status: 410 }, // 410 Gone - indicates the resource is permanently unavailable
  )
}
