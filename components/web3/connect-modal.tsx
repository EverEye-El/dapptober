"use client"

import { X } from "lucide-react"
import { ConnectButton } from "thirdweb/react"
import { dapptoberConnectButtonDefaults, dapptoberConnectModalOptions } from "@/lib/web3/thirdweb-theme"
import { client } from "@/lib/web3/thirdweb-client"
import { useEffect } from "react"
import { createPortal } from "react-dom"

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
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="glass-modal p-8 space-y-6 relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 term-btn !h-9 !w-9 !min-w-0 !px-0 border-primary/40 text-copper-dim hover:text-copper-bright"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold gradient-text tracking-wide">Connect Your Wallet</h2>
              <p className="text-copper-dim text-sm leading-relaxed">
                To post comments and interact with the community, connect a Web3 wallet.
              </p>
            </div>

            <div className="pt-2">
              <ConnectButton
                client={client}
                {...dapptoberConnectButtonDefaults}
                connectModal={{
                  ...dapptoberConnectModalOptions,
                  title: "Choose wallet",
                }}
                connectButton={{
                  label: "Connect Wallet",
                  className: "term-btn !w-full !px-6 !py-3 !text-sm",
                }}
              />
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-xs text-copper-dim text-center">
                New to Web3?{" "}
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-copper-bright hover:text-copper transition-colors underline underline-offset-2"
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
