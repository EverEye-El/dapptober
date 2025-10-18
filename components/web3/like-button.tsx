"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabaseBrowser, ensureSupabaseSession } from "@/lib/web3/supabase-web3"
import { useActiveAccount } from "thirdweb/react"
import { useRouter } from "next/navigation"
import { ConnectModal } from "./connect-modal"

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
  const router = useRouter()
  const supabase = supabaseBrowser()

  useEffect(() => {
    setLikes(initialLikes)
    setIsLiked(initialIsLiked)
  }, [initialLikes, initialIsLiked])

  const handleLike = async () => {
    if (!account) {
      console.log("[v0] No wallet connected, showing connect modal")
      setShowConnectModal(true)
      return
    }

    setIsLoading(true)

    try {
      const hasSession = await ensureSupabaseSession(account)
      if (!hasSession) {
        alert("Failed to authenticate. Please try again.")
        setIsLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.log("[v0] No Supabase user, showing connect modal")
        setShowConnectModal(true)
        setIsLoading(false)
        return
      }

      if (isLiked) {
        console.log("[v0] Unliking DApp day:", dappDay)
        const { error } = await supabase.from("likes").delete().eq("user_id", user.id).eq("dapp_day", dappDay)

        if (error) {
          console.error("[v0] Unlike error:", error)
          throw error
        }

        setLikes((prev) => prev - 1)
        setIsLiked(false)
      } else {
        console.log("[v0] Liking DApp day:", dappDay)
        const { error } = await supabase.from("likes").insert({ user_id: user.id, dapp_day: dappDay })

        if (error) {
          console.error("[v0] Like error:", error)
          throw error
        }

        setLikes((prev) => prev + 1)
        setIsLiked(true)
      }

      router.refresh()
    } catch (error) {
      console.error("[v0] Like error:", error)
      alert("Failed to update like. Please try again.")
      // Revert optimistic update
      setLikes(initialLikes)
      setIsLiked(initialIsLiked)
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
          className={`w-full gap-2 transition-all font-semibold ${
            isLiked
              ? "neon-glow-purple bg-primary/80 hover:bg-primary border border-primary/50"
              : "neon-glow-orange bg-primary/80 hover:bg-primary border border-primary/50"
          }`}
        >
          <Heart className={`h-5 w-5 transition-all ${isLiked ? "fill-current" : ""}`} />
          {isLiked ? "Liked" : "Like This DApp"}
          <span className="ml-2 px-2 py-0.5 rounded-full bg-background/20 text-sm">{likes}</span>
        </Button>

        {!account && <p className="text-xs text-white text-center">Connect your wallet to like this DApp</p>}
      </div>
    </>
  )
}
