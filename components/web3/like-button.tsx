"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useActiveAccount } from "thirdweb/react"
import { useRouter } from "next/navigation"

interface LikeButtonProps {
  dappDay: number
  initialLikes: number
  initialIsLiked: boolean
}

export function LikeButton({ dappDay, initialLikes, initialIsLiked }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLoading, setIsLoading] = useState(false)
  const account = useActiveAccount()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setLikes(initialLikes)
    setIsLiked(initialIsLiked)
  }, [initialLikes, initialIsLiked])

  const handleLike = async () => {
    if (!account) {
      alert("Please connect your wallet to like this DApp")
      return
    }

    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("Please connect your wallet to like this DApp")
        setIsLoading(false)
        return
      }

      if (isLiked) {
        // Unlike
        const { error } = await supabase.from("likes").delete().eq("user_id", user.id).eq("dapp_day", dappDay)

        if (error) throw error

        setLikes((prev) => prev - 1)
        setIsLiked(false)
      } else {
        // Like
        const { error } = await supabase.from("likes").insert({ user_id: user.id, dapp_day: dappDay })

        if (error) throw error

        setLikes((prev) => prev + 1)
        setIsLiked(true)
      }

      router.refresh()
    } catch (error) {
      console.error("[v0] Like error:", error)
      alert("Failed to update like. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLike}
      disabled={isLoading}
      size="lg"
      className={`flex-1 gap-2 transition-all font-semibold ${
        isLiked
          ? "neon-glow-purple bg-primary/80 hover:bg-primary border border-primary/50"
          : "neon-glow-orange bg-primary/80 hover:bg-primary border border-primary/50"
      }`}
    >
      <Heart className={`h-5 w-5 transition-all ${isLiked ? "fill-current" : ""}`} />
      {isLiked ? "Liked" : "Like This DApp"}
      <span className="ml-2 px-2 py-0.5 rounded-full bg-background/20 text-sm">{likes}</span>
    </Button>
  )
}
