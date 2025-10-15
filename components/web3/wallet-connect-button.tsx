"use client"

import { ConnectButton } from "thirdweb/react"
import { client } from "@/lib/web3/thirdweb-client"
import { createWallet } from "thirdweb/wallets"
import { Wallet } from "lucide-react"

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
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme="dark"
      auth={{
        isLoggedIn: async (address) => {
          // Check if user has valid auth session
          const response = await fetch("/api/me")
          if (!response.ok) return false
          const data = await response.json()
          return data.address?.toLowerCase() === address.toLowerCase()
        },
        doLogin: async (params) => {
          // thirdweb handles the SIWE flow and calls /api/auth/[...thirdweb]
          console.log("[v0] User logged in:", params.address)
        },
        getLoginPayload: async ({ address }) => ({
          address,
          statement: "Sign this message to authenticate with Dapptober",
        }),
        doLogout: async () => {
          console.log("[v0] User logged out")
        },
      }}
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
