"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, ExternalLink, Github } from "lucide-react"
import { useState } from "react"
import { ParallaxTiltCard } from "@/components/terminal/parallax-tilt-card"
import { TypewriterText } from "@/components/terminal/typewriter-text"
import Image from "next/image"
import Link from "next/link"
import { formatBannerPosition, parseBannerPosition } from "@/lib/community/banner-position"
import { isDisplayableImageUrl } from "@/lib/community/image-url"

interface ShowcaseCardProps {
  titleStartDelay?: number
  submission: {
    id: string
    dapp_day: number
    title: string
    description: string
    demo_url?: string
    github_url?: string
    image_url?: string
    banner_position?: string | null
    created_at: string
    profile: {
      display_name?: string
      wallet_address: string
      avatar_url?: string
    }
    likes_count: number
    comments_count: number
  }
}

export function ShowcaseCard({ submission, titleStartDelay = 0 }: ShowcaseCardProps) {
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const profile = submission.profile || {
    display_name: null,
    wallet_address: "Unknown",
    avatar_url: null,
  }

  return (
    <ParallaxTiltCard
      pulseOnButtonClick
      className="glass-card group relative overflow-hidden transition-all duration-300 border-primary/30 hover:border-primary/60 prompt-page-card"
    >
      <div className="absolute top-3 left-3 z-10">
        <div className="term-chip">
          <span>DAY</span>
          <span className="text-sm tracking-normal">{String(submission.dapp_day).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="relative h-48 overflow-hidden parallax-tilt-card__media-shell">
        {!imageError && isDisplayableImageUrl(submission.image_url) ? (
          <Image
            src={submission.image_url}
            alt={submission.title}
            width={384}
            height={192}
            className="w-full h-full object-cover parallax-tilt-card__media transition-transform duration-300 group-hover:scale-110"
            style={{ objectPosition: formatBannerPosition(parseBannerPosition(submission.banner_position)) }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[oklch(0.16_0.014_55)] relative">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(0.78 0.11 62 / 0.18) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.11 62 / 0.18) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
              <span className="term-kicker">no.signal</span>
              <p className="text-lg font-bold text-copper-bright">{submission.title}</p>
              <p className="text-xs tracking-[0.16em] uppercase text-copper-dim">Day {submission.dapp_day}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-all duration-300 group-hover:neon-glow-orange" />
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <TypewriterText
            text={submission.title}
            as="h3"
            startDelay={titleStartDelay}
            className="text-lg font-bold text-balance leading-tight text-white"
          />
          <p className="text-sm text-gray-300 text-pretty leading-relaxed line-clamp-2">{submission.description}</p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Link href={`/profile/${profile.wallet_address}`} aria-label="View profile">
            <Avatar className="w-6 h-6 border border-primary/30">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.display_name || "User"} />
              <AvatarFallback className="text-xs bg-primary/20">
                {profile.display_name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-200 truncate">
              {profile.display_name || truncateAddress(profile.wallet_address)}
            </p>
            <p className="text-xs text-gray-400">{formatDate(submission.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-primary/30">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{submission.likes_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{submission.comments_count}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link href={`/showcase/${submission.id}`}>
              <Button size="sm" variant="outline" className="term-btn interactive-action-btn h-7 px-2 text-[10px]">
                View
              </Button>
            </Link>
            {submission.demo_url && (
              <Link href={submission.demo_url} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="ghost"
                  className="interactive-action-btn h-7 w-7 p-0 text-gray-300 hover:bg-primary/20 hover:text-white"
                  title="View Demo"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </Link>
            )}
            {submission.github_url && (
              <Link href={submission.github_url} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="ghost"
                  className="interactive-action-btn h-7 w-7 p-0 text-gray-300 hover:bg-primary/20 hover:text-white"
                  title="View Code"
                >
                  <Github className="w-3.5 h-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </ParallaxTiltCard>
  )
}
