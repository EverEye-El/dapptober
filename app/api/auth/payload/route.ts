import { type NextRequest, NextResponse } from "next/server"
import { createAuth } from "thirdweb/auth"
import { privateKeyToAccount } from "thirdweb/wallets"
import { serverClient } from "@/lib/web3/thirdweb-server-client"

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json()

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

    const payload = await auth.generatePayload({ address })

    return NextResponse.json(payload)
  } catch (error) {
    console.error("[v0] Error generating payload:", error)
    return NextResponse.json({ error: "Failed to generate payload" }, { status: 500 })
  }
}
