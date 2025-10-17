"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { supabaseBrowser } from "@/lib/web3/supabase-web3"
import { useActiveAccount } from "thirdweb/react"
import { formatDistanceToNow } from "date-fns"
import { ConnectModal } from "./connect-modal"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface Comment {
  id: string
  content: string
  created_at: string
  profiles: {
    display_name: string | null
    wallet_address: string | null
  }
}

interface CommentsSectionProps {
  dappDay: number
  initialComments: Comment[]
}

export function CommentsSection({ dappDay, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const account = useActiveAccount()
  const supabase = supabaseBrowser()

  useEffect(() => {
    if (account && showConnectModal) {
      console.log("[v0] Wallet connected, closing modal")
      setShowConnectModal(false)
    }
  }, [account, showConnectModal])

  useEffect(() => {
    console.log("[v0] Setting up real-time subscription for dapp day:", dappDay)

    const channel = supabase
      .channel(`comments:${dappDay}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `dapp_day=eq.${dappDay}`,
        },
        (payload) => {
          console.log("[v0] New comment received via real-time:", payload)
          supabase
            .from("comments")
            .select(
              `
              id,
              content,
              created_at,
              profiles (
                display_name,
                wallet_address
              )
            `,
            )
            .eq("id", payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setComments((prev) => {
                  if (prev.some((c) => c.id === data.id)) return prev
                  return [data as Comment, ...prev]
                })
              }
            })
        },
      )
      .subscribe()

    return () => {
      console.log("[v0] Cleaning up real-time subscription")
      supabase.removeChannel(channel)
    }
  }, [dappDay, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    console.log("[v0] Comment submit triggered", { account: account?.address })

    if (!account) {
      console.log("[v0] No wallet connected, showing modal")
      setShowConnectModal(true)
      return
    }

    if (!newComment.trim()) {
      console.log("[v0] Empty comment, ignoring")
      return
    }

    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Please connect your wallet to comment")
        setShowConnectModal(true)
        setIsSubmitting(false)
        return
      }

      console.log("[v0] Inserting comment for user:", user.id)

      const { data, error: insertError } = await supabase
        .from("comments")
        .insert({
          user_id: user.id,
          dapp_day: dappDay,
          content: newComment.trim(),
        })
        .select(
          `
          id,
          content,
          created_at,
          profiles (
            display_name,
            wallet_address
          )
        `,
        )
        .single()

      if (insertError) {
        console.error("[v0] Comment insert error:", insertError)
        setError(insertError.message || "Failed to post comment")
        setIsSubmitting(false)
        return
      }

      console.log("[v0] Comment posted successfully:", data)

      // Add comment to local state (real-time will also add it, but this is faster)
      setComments((prev) => {
        if (prev.some((c) => c.id === data.id)) return prev
        return [data as Comment, ...prev]
      })

      setNewComment("")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error("[v0] Comment submission error:", err)
      setError(err instanceof Error ? err.message : "Failed to post comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <ConnectModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this DApp..."
          disabled={isSubmitting}
          className="min-h-[100px] bg-slate-900/90 border-primary/50 neon-glow-orange text-white placeholder:text-gray-400 focus:border-primary/50 focus:neon-glow-orange transition-colors"
        />

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>

          {showSuccess && (
            <div className="flex items-center gap-2 text-green-400 animate-in fade-in slide-in-from-left-2 duration-300">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Comment posted!</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-orange-400 animate-in fade-in slide-in-from-left-2 duration-300">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>

        {!account && <p className="text-xs text-gray-400">Connect your wallet to post comments</p>}
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h3>

        {comments.length === 0 ? (
          <Card className="p-6 text-center text-gray-300 bg-slate-900/90 border-primary/50 neon-glow-orange">
            No comments yet. Be the first to share your thoughts!
          </Card>
        ) : (
          comments.map((comment) => (
            <Card
              key={comment.id}
              className="p-4 bg-slate-900/90 border-primary/50 neon-glow-orange hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neon-purple">
                      {comment.profiles?.display_name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-white leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
