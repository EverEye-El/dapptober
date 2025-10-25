"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, ExternalLink, Github, Sparkles } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface ShowcaseCardProps {
  submission: {
    id: string
    dapp_day: number
    title: string
    description: string
    demo_url?: string
    github_url?: string
    image_url?: string
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

export function ShowcaseCard({ submission }: ShowcaseCardProps) {
  const [isHovered, setIsHovered] = useState(false)
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

  const getGradientColors = (id: string) => {
    const colors = [
      "from-orange-500 via-red-500 to-pink-500",
      "from-purple-500 via-pink-500 to-red-500",
      "from-blue-500 via-purple-500 to-pink-500",
      "from-green-500 via-teal-500 to-blue-500",
      "from-yellow-500 via-orange-500 to-red-500",
      "from-indigo-500 via-purple-500 to-pink-500",
    ]
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <Card
      className="glass-card group relative overflow-hidden transition-all duration-300 border-primary/30 hover:border-primary/60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center justify-center w-10 h-10 rounded-full glass-card border-primary/50 neon-glow-orange">
          <span className="text-xs font-bold gradient-text">{submission.dapp_day}</span>
        </div>
      </div>

      <div className="relative h-48 overflow-hidden">
        {!imageError && submission.image_url ? (
          <Image
            src={submission.image_url || "/placeholder.svg"}
            alt={submission.title}
            width={384}
            height={192}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br ${getGradientColors(
              submission.id,
            )} relative`}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white mb-1">{submission.title}</p>
                <p className="text-sm text-white/80 font-medium">Day {submission.dapp_day}</p>
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-all duration-300 group-hover:neon-glow-orange" />
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-balance leading-tight text-white">{submission.title}</h3>
          <p className="text-sm text-gray-300 text-pretty leading-relaxed line-clamp-2">{submission.description}</p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Avatar className="w-6 h-6 border border-primary/30">
            <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.display_name || "User"} />
            <AvatarFallback className="text-xs bg-primary/20">
              {profile.display_name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
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
            {submission.demo_url && (
              <Link href={submission.demo_url} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-gray-300 hover:bg-primary/20 hover:text-white"
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
                  className="h-7 w-7 p-0 text-gray-300 hover:bg-primary/20 hover:text-white"
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
    </Card>
  )
}
