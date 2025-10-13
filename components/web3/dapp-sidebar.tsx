"use client"

import { useState } from "react"
import { Heart, MessageSquare, Eye, Users, Share2, ArrowLeft, Upload } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LikeButton } from "@/components/web3/like-button"
import { SubmitButton } from "@/components/web3/submit-button"
import Link from "next/link"

interface DappSidebarProps {
  dappDay: number
  dappTitle: string
  likesCount: number
  commentsCount: number
  viewsCount: number
  usersCount: number
  isLiked: boolean
}

export function DappSidebar({
  dappDay,
  dappTitle,
  likesCount,
  commentsCount,
  viewsCount,
  usersCount,
  isLiked,
}: DappSidebarProps) {
  const [showMobileActions, setShowMobileActions] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dappTitle,
          text: `Check out ${dappTitle} on Dapptober!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("[v0] Share cancelled or failed")
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const scrollToComments = () => {
    const commentsSection = document.getElementById("comments-section")
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      {/* Desktop Sidebar - Sticky */}
      <aside className="hidden lg:block sticky top-8 h-fit space-y-4">
        {/* Back Button */}
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>

        {/* Submit DApp Card */}
        <Card className="glass-card border-accent/30 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-neon-purple">
            <Upload className="w-4 h-4" />
            <span className="font-semibold">Submit Your Build</span>
          </div>
          <SubmitButton dappDay={dappDay} variant="card" />
          <p className="text-xs text-white">Built something for Day {dappDay}? Share it with the community!</p>
        </Card>

        {/* Like Card */}
        <Card className="glass-card border-primary/30 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-neon-purple">
            <Heart className="w-4 h-4" />
            <span className="font-semibold">Show Support</span>
          </div>
          <LikeButton dappDay={dappDay} initialLikes={likesCount} initialIsLiked={isLiked} />
        </Card>

        {/* Stats Card */}
        <Card className="glass-card border-primary/30 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-neon-purple">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white">
                <Heart className="w-4 h-4" />
                <span>Likes</span>
              </div>
              <span className="text-sm font-bold text-accent">{likesCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white">
                <MessageSquare className="w-4 h-4" />
                <span>Comments</span>
              </div>
              <span className="text-sm font-bold text-accent">{commentsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white">
                <Eye className="w-4 h-4" />
                <span>Views</span>
              </div>
              <span className="text-sm font-bold text-accent">{viewsCount}k</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white">
                <Users className="w-4 h-4" />
                <span>Users</span>
              </div>
              <span className="text-sm font-bold text-accent">{usersCount}+</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions Card */}
        <Card className="glass-card border-primary/30 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-neon-purple">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-sm text-white border-primary/30 hover:bg-primary/10 bg-transparent"
              onClick={scrollToComments}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Jump to Comments
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm text-white border-primary/30 hover:bg-primary/10 bg-transparent"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share DApp
            </Button>
          </div>
        </Card>

        {/* Day Badge */}
        <Card className="glass-card border-primary/30 p-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full glass-card border-primary/50 neon-glow-orange">
              <span className="text-lg font-bold gradient-text">{dappDay}</span>
            </div>
            <div className="text-left">
              <div className="text-xs text-white">Dapptober Day</div>
              <div className="text-sm font-semibold text-neon-purple">#{dappDay} of 31</div>
            </div>
          </div>
        </Card>
      </aside>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        {showMobileActions && (
          <div className="absolute bottom-16 right-0 space-y-2 mb-2">
            <Button
              size="icon"
              className="w-12 h-12 rounded-full glass-card border-primary/30 neon-glow-orange shadow-lg"
              onClick={scrollToComments}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              className="w-12 h-12 rounded-full glass-card border-primary/30 neon-glow-orange shadow-lg"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        )}
        <Button
          size="icon"
          className="w-14 h-14 rounded-full neon-glow-purple bg-primary/90 hover:bg-primary border-2 border-primary/50 shadow-xl"
          onClick={() => setShowMobileActions(!showMobileActions)}
        >
          <Heart className={`w-6 h-6 transition-all ${isLiked ? "fill-current" : ""}`} />
        </Button>
      </div>
    </>
  )
}
