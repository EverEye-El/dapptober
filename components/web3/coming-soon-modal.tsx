"use client"

import { X, Sparkles, Rocket } from "lucide-react"
import { useEffect } from "react"
import { createPortal } from "react-dom"

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  feature: "comments" | "submissions"
}

export function ComingSoonModal({ isOpen, onClose, feature }: ComingSoonModalProps) {
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

  const featureText = feature === "comments" ? "Comments" : "DApp Submissions"
  const actionText = feature === "comments" ? "share your thoughts" : "submit your amazing DApp"

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal content with glassmorphic design */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="glass-card rounded-2xl p-8 space-y-6 relative overflow-hidden">
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
          <div className="relative space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-orange to-neon-purple rounded-full blur-xl opacity-50" />
                <div className="relative bg-gradient-to-r from-neon-orange to-neon-purple p-4 rounded-full">
                  {feature === "comments" ? (
                    <Sparkles className="w-8 h-8 text-white" />
                  ) : (
                    <Rocket className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-bold gradient-text">{featureText} Coming Soon!</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                We're working hard to bring you the ability to {actionText}. This feature will be available very soon!
              </p>
              <p className="text-gray-400 text-xs leading-relaxed pt-2">
                In the meantime, keep building your amazing DApps and exploring the Dapptober showcase. We can't wait to
                see what you create! 🚀
              </p>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold px-6 py-3 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] neon-glow-orange"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
