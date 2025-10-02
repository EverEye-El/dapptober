"use client"

import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "@/lib/web3/thirdweb-client"
import { createWallet } from "thirdweb/wallets"
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Wallet } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
]

interface WalletConnectButtonProps {
  isCollapsed?: boolean
}

export function WalletConnectButton({ isCollapsed = false }: WalletConnectButtonProps) {
  const account = useActiveAccount()
  const router = useRouter()
  const authenticatedAddresses = useRef<Set<string>>(new Set())
  const isAuthenticating = useRef(false)

  useEffect(() => {
    async function handleAuth() {
      if (!account?.address) {
        console.log("[v0] No account connected")
        return
      }

      if (authenticatedAddresses.current.has(account.address)) {
        console.log("[v0] Address already authenticated in this session, skipping")
        return
      }

      if (isAuthenticating.current) {
        console.log("[v0] Authentication already in progress")
        return
      }

      console.log("[v0] Starting authentication for:", account.address)
      isAuthenticating.current = true

      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.log("[v0] Existing Supabase session found, verifying profile")
          const { data: profile } = await supabase
            .from("profiles")
            .select("wallet_address")
            .eq("id", session.user.id)
            .single()

          if (profile?.wallet_address === account.address.toLowerCase()) {
            console.log("[v0] Session matches wallet, authentication complete")
            authenticatedAddresses.current.add(account.address)
            router.refresh()
            isAuthenticating.current = false
            return
          }
        }

        console.log("[v0] Requesting signature from wallet")
        const message = `Sign this message to authenticate with Dapptober.\n\nWallet: ${account.address}\nTimestamp: ${Date.now()}`
        const signature = await account.signMessage({ message })

        console.log("[v0] Signature received, calling auth API")
        const response = await fetch("/api/auth/wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: account.address,
            signature,
            message,
          }),
        })

        const result = await response.json()

        if (result.success && result.session) {
          console.log("[v0] Setting session on client")
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          })

          if (sessionError) {
            console.error("[v0] Failed to set session:", sessionError)
          } else {
            console.log("[v0] Session set successfully, authentication complete")
            authenticatedAddresses.current.add(account.address)
            router.refresh()
          }
        } else {
          console.error("[v0] Authentication failed:", result.error)
        }
      } catch (error) {
        console.error("[v0] Wallet auth error:", error)
      } finally {
        isAuthenticating.current = false
      }
    }

    handleAuth()
  }, [account?.address, router])

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme="dark"
      connectButton={{
        label: isCollapsed ? <Wallet className="w-4 h-4" aria-label="Connect Wallet" /> : "Connect Wallet",
        className: isCollapsed
          ? "!bg-primary/80 hover:!bg-primary !text-white !font-semibold !px-2 !h-8 !rounded-lg !transition-all !text-xs !w-full !min-w-0 !border !border-primary/50 neon-glow-orange !flex !items-center !justify-center"
          : "!bg-primary/80 hover:!bg-primary !text-white !font-semibold !px-4 !h-8 !rounded-lg !transition-all !text-xs !w-full !border !border-primary/50 neon-glow-orange",
      }}
      detailsButton={{
        className: isCollapsed
          ? "!bg-primary/80 hover:!bg-primary !border !border-primary/50 !text-white !rounded-lg !transition-all !px-2 !h-8 !text-xs !w-full !min-w-0 !truncate neon-glow-orange !flex !items-center !justify-center"
          : "!bg-primary/80 hover:!bg-primary !border !border-primary/50 !text-white !rounded-lg !transition-all !px-4 !h-8 !text-xs !w-full !truncate neon-glow-orange",
      }}
    />
  )
}
