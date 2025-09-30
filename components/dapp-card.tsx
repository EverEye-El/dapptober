"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Users } from "lucide-react"
import { useState } from "react"
import type { DappPrompt } from "@/lib/dapp-prompts"

interface DappCardProps {
  dapp: DappPrompt
}

export function DappCard({ dapp }: DappCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 bg-card/50 backdrop-blur-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border">
          <span className="text-xs font-bold">{dapp.day}</span>
        </div>
      </div>

      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10">
        <img
          src={`/.jpg?key=jzbcx&height=192&width=384&query=${encodeURIComponent(dapp.imageQuery)}`}
          alt={dapp.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-balance leading-tight">{dapp.title}</h3>
          <p className="text-xs text-muted-foreground italic">{dapp.vibe}</p>
          <p className="text-sm text-muted-foreground text-pretty leading-relaxed line-clamp-2">{dapp.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {dapp.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{Math.floor(Math.random() * 500) + 100}k</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{Math.floor(Math.random() * 100) + 10}+</span>
            </div>
          </div>
          <Button size="sm" variant={isHovered ? "default" : "ghost"} className="h-7 text-xs">
            View Prompt
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  )
}
