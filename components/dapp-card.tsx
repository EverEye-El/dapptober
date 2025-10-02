"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Users } from "lucide-react"
import { useState } from "react"
import type { DappPrompt } from "@/lib/dapp-prompts"
import Image from "next/image"
import Link from "next/link"

interface DappCardProps {
  dapp: DappPrompt
}

export function DappCard({ dapp }: DappCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="glass-card group relative overflow-hidden transition-all duration-300 border-primary/30 hover:border-primary/60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center justify-center w-10 h-10 rounded-full glass-card border-primary/50 neon-glow-orange">
          <span className="text-xs font-bold gradient-text">{dapp.day}</span>
        </div>
      </div>

      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10">
        <Image
          src={dapp.image || "/placeholder.svg"}
          alt={dapp.title}
          width={384}
          height={192}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-all duration-300 group-hover:neon-glow-orange" />
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-balance leading-tight gradient-text">{dapp.title}</h3>
          <p className="text-xs text-accent italic">{dapp.vibe}</p>
          <p className="text-sm text-muted-foreground text-pretty leading-relaxed line-clamp-2">{dapp.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {dapp.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-0.5 glass-card border-primary/20 text-accent"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-primary/30">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 opacity-70" />
              <span>{Math.floor(Math.random() * 500) + 100}k</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 opacity-70" />
              <span>{Math.floor(Math.random() * 100) + 10}+</span>
            </div>
          </div>
          <Link href={`/dapp/${dapp.day}`}>
            <Button
              size="sm"
              variant="default"
              className="h-8 text-xs font-semibold neon-glow-orange bg-primary/80 hover:bg-primary border border-primary/50"
            >
              View Prompt
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  )
}
