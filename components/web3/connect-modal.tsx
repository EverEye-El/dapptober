"use client"

import { X } from "lucide-react"
import { ConnectButton } from "thirdweb/react"
import { client } from "@/lib/web3/thirdweb-client"
import { createWallet } from "thirdweb/wallets"
import { useEffect } from "react"
import { createPortal } from "react-dom"

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
]

interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal content with glassmorphic design */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="glass-modal rounded-2xl p-8 space-y-6 relative overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-orange/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-purple/20 rounded-full blur-3xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold gradient-text">Connect Your Wallet</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                To post comments and interact with the community, please connect your Web3 wallet.
              </p>
            </div>

            <div className="pt-2">
              <ConnectButton
                client={client}
                wallets={wallets}
                theme="dark"
                connectButton={{
                  label: "Connect Wallet",
                  className:
                    "!w-full !bg-gradient-to-r !from-neon-purple !to-neon-orange !text-white !font-semibold !px-6 !py-3 !rounded-xl !transition-all hover:!opacity-90 hover:!scale-[1.02] !text-base neon-glow-orange",
                }}
                connectModal={{
                  size: "compact",
                  title: "Choose Your Wallet",
                  titleIcon: "",
                }}
              />
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-xs text-gray-400 text-center">
                New to Web3?{" "}
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-orange hover:text-neon-orange/80 transition-colors underline"
                >
                  Get MetaMask
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
