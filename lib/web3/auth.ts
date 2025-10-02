"use server"

import { createClient } from "@/lib/supabase/server"
import { verifySignature } from "thirdweb/auth"
import { client } from "./thirdweb-client"

export async function authenticateWithWallet(address: string, signature: string, message: string) {
  try {
    // Verify the signature using thirdweb
    const isValid = await verifySignature({
      client,
      message,
      signature,
      address,
    })

    if (!isValid) {
      return { success: false, error: "Invalid signature" }
    }

    const supabase = await createClient()

    // Check if user exists with this wallet
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", address.toLowerCase())
      .single()

    if (existingProfile) {
      // User exists, sign them in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${address.toLowerCase()}@wallet.local`,
        password: address.toLowerCase(),
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user }
    } else {
      // Create new user
      const { data, error } = await supabase.auth.signUp({
        email: `${address.toLowerCase()}@wallet.local`,
        password: address.toLowerCase(),
        options: {
          data: {
            wallet_address: address.toLowerCase(),
            display_name: `${address.slice(0, 6)}...${address.slice(-4)}`,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user }
    }
  } catch (error) {
    console.error("[v0] Auth error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
