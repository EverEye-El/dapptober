"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { client } from "@/lib/web3/thirdweb-client"
import { createWallet } from "thirdweb/wallets"
import { AlertCircle } from "lucide-react"

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
]

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
  const [showConnectPrompt, setShowConnectPrompt] = useState(false)
  const account = useActiveAccount()
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account) {
      setShowConnectPrompt(true)
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setShowConnectPrompt(true)
        setIsSubmitting(false)
        return
      }

      const { data, error } = await supabase
        .from("comments")
        .insert({
          user_id: user.id,
          dapp_day: dappDay,
          content: newComment.trim(),
        })
        .select(`
          id,
          content,
          created_at,
          profiles (
            display_name,
            wallet_address
          )
        `)
        .single()

      if (error) throw error

      setComments([data as Comment, ...comments])
      setNewComment("")
      router.refresh()
    } catch (error) {
      console.error("[v0] Comment error:", error)
      alert("Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this DApp..."
          disabled={isSubmitting}
          className="min-h-[100px] bg-slate-900/90 border-border text-white placeholder:text-gray-400 focus:border-neon-purple/50 transition-colors"
        />

        {showConnectPrompt && !account && (
          <Card className="p-4 bg-slate-900/90 border-neon-orange/50 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-neon-orange flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-sm text-white">Please connect your wallet to post comments</p>
                <ConnectButton
                  client={client}
                  wallets={wallets}
                  theme="dark"
                  connectButton={{
                    label: "Connect Wallet",
                    className:
                      "!bg-gradient-to-r !from-neon-purple !to-neon-orange !text-white !font-semibold !px-4 !py-2 !rounded-lg !transition-opacity hover:!opacity-90 !text-sm",
                  }}
                />
              </div>
            </div>
          </Card>
        )}

        <Button
          type="submit"
          disabled={!account || isSubmitting || !newComment.trim()}
          className="bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>

        {!account && !showConnectPrompt && (
          <p className="text-xs text-gray-400">Connect your wallet to post comments</p>
        )}
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card className="p-6 text-center text-gray-300 bg-slate-900/90 border-border">
            No comments yet. Be the first to share your thoughts!
          </Card>
        ) : (
          comments.map((comment) => (
            <Card
              key={comment.id}
              className="p-4 bg-slate-900/90 border-border hover:border-neon-purple/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neon-purple">
                      {comment.profiles.display_name || "Anonymous"}
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
