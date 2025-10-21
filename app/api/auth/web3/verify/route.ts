import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyMessage } from "ethers"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { address, signature, message } = await request.json()

    if (!address || !signature || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const recoveredAddress = verifyMessage(message, signature)

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    console.log("[API] Signature verified for address:", address)

    const email = `${address.toLowerCase()}@wallet.dapptober.local`

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    let user = existingUsers?.users.find((u) => u.email === email)

    if (!user) {
      console.log("[API] Creating new user for address:", address)
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { wallet_address: address.toLowerCase() },
      })

      if (createError) throw createError
      user = newUser.user
    }

    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createSession({
      user_id: user.id,
    })

    if (sessionError) throw sessionError

    await supabaseAdmin.from("profiles").upsert(
      {
        user_id: user.id,
        wallet_address: address.toLowerCase(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )

    console.log("[API] Session created for user:", user.id)

    return NextResponse.json({ session: sessionData.session })
  } catch (error: any) {
    console.error("[API] Verification error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
