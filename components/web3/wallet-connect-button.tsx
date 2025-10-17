"use client"

import { useState, useEffect } from "react"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "@/lib/web3/thirdweb-client"
import { createWallet } from "thirdweb/wallets"
import { Wallet } from "lucide-react"
import { signInWithSupabaseWeb3, signOutSupabase } from "@/lib/web3/supabase-web3"

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
  const [isSupabaseAuthed, setIsSupabaseAuthed] = useState(false)
  const account = useActiveAccount()

  useEffect(() => {
    if (account?.address && !isSupabaseAuthed) {
      console.log("[v0] Wallet connected, signing in to Supabase")
      signInWithSupabaseWeb3(account.address)
        .then(() => {
          console.log("[v0] Supabase auth successful")
          setIsSupabaseAuthed(true)
        })
        .catch((error) => {
          console.error("[v0] Supabase auth failed:", error)
        })
    } else if (!account?.address && isSupabaseAuthed) {
      console.log("[v0] Wallet disconnected, signing out from Supabase")
      signOutSupabase()
        .then(() => {
          setIsSupabaseAuthed(false)
        })
        .catch((error) => {
          console.error("[v0] Supabase sign-out failed:", error)
        })
    }
  }, [account?.address, isSupabaseAuthed])

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
