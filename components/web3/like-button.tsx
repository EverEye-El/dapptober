"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActiveAccount } from "thirdweb/react"
import { ConnectModal } from "./connect-modal"
import { toggleLike } from "@/app/actions/likes"
import { ensureProfile } from "@/app/actions/profiles"

interface LikeButtonProps {
  dappDay: number
  initialLikes: number
  initialIsLiked: boolean
}

export function LikeButton({ dappDay, initialLikes, initialIsLiked }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLoading, setIsLoading] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const account = useActiveAccount()

  const handleLike = async () => {
    if (!account) {
      console.log("[v0] No wallet connected, showing connect modal")
      setShowConnectModal(true)
      return
    }

    setIsLoading(true)

    const previousLikes = likes
    const previousIsLiked = isLiked

    if (isLiked) {
      setLikes((prev) => prev - 1)
      setIsLiked(false)
    } else {
      setLikes((prev) => prev + 1)
      setIsLiked(true)
    }

    try {
      const profileResult = await ensureProfile(account.address)
      if (!profileResult.success) {
        setLikes(previousLikes)
        setIsLiked(previousIsLiked)
        alert(profileResult.error || "Failed to create profile")
        setIsLoading(false)
        return
      }

      const result = await toggleLike(dappDay, account.address)

      if (!result.success) {
        setLikes(previousLikes)
        setIsLiked(previousIsLiked)
        alert(result.error || "Failed to update like")
        setIsLoading(false)
        return
      }

      console.log("[v0] Like toggled successfully:", result.isLiked)
    } catch (error) {
      console.error("[v0] Like error:", error)
      setLikes(previousLikes)
      setIsLiked(previousIsLiked)
      alert("Failed to update like. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ConnectModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleLike}
          disabled={isLoading}
          size="lg"
          className={`w-full gap-2 transition-all duration-300 font-semibold ${
            isLiked
              ? "bg-gradient-to-r from-neon-purple to-neon-orange text-white hover:opacity-90 border-2 border-neon-purple/50 neon-glow-purple"
              : "neon-glow-orange bg-primary/80 hover:bg-primary border border-primary/50 text-white"
          }`}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-300 ${
              isLiked ? "fill-current text-neon-purple" : "fill-transparent text-white"
            }`}
          />
          Love this Dapp
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-sm font-bold transition-all duration-300 ${
              isLiked ? "bg-white/20 text-white" : "bg-background/20 text-white"
            }`}
          >
            {likes}
          </span>
        </Button>

        {!account && <p className="text-xs text-white text-center">Connect your wallet to like this DApp</p>}
      </div>
    </>
  )
}
