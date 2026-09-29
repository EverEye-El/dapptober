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
      autoConnect={false}
      connectButton={{
        label: isCollapsed ? <Wallet className="w-4 h-4" aria-label="Connect Wallet" /> : "Connect Wallet",
        className: isCollapsed
          ? "term-btn !px-2 !h-8 !w-full !min-w-0 !text-xs"
          : "term-btn !px-4 !h-8 !w-full !text-xs",
      }}
      detailsButton={{
        className: isCollapsed
          ? "term-btn !px-2 !h-8 !w-full !min-w-0 !truncate !text-xs"
          : "term-btn !px-4 !h-8 !w-full !truncate !text-xs",
      }}
    />
  )
}
