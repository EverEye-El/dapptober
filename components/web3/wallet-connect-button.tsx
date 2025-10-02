"use client"

import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "@/lib/web3/thirdweb-client"
import { createWallet } from "thirdweb/wallets"
import { useEffect } from "react"
import { authenticateWithWallet } from "@/lib/web3/auth"
import { useRouter } from "next/navigation"
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
  const account = useActiveAccount()
  const router = useRouter()

  useEffect(() => {
    async function handleAuth() {
      if (account?.address) {
        // Sign a message to authenticate
        const message = `Sign this message to authenticate with Dapptober.\n\nWallet: ${account.address}\nTimestamp: ${Date.now()}`

        try {
          const signature = await account.signMessage({ message })
          const result = await authenticateWithWallet(account.address, signature, message)

          if (result.success) {
            router.refresh()
          }
        } catch (error) {
          console.error("[v0] Wallet auth error:", error)
        }
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
