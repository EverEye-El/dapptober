"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParallaxTiltCard } from "@/components/terminal/parallax-tilt-card"
import type { DappPrompt } from "@/lib/dapp-prompts"
import type { ReactNode } from "react"

interface PromptPreviewCardProps {
  title: string
  image: string
}

export function PromptPreviewCard({ title, image }: PromptPreviewCardProps) {
  return (
    <ParallaxTiltCard
      pulseOnButtonClick
      className="glass-card border-primary/30 overflow-hidden prompt-page-card"
    >
      <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 parallax-tilt-card__media-shell">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover parallax-tilt-card__media" priority />
        <div className="absolute inset-0 border-2 border-primary/30 neon-glow-orange pointer-events-none" />
        <div className="absolute inset-0 flex items-end p-6">
          <Button
            size="lg"
            className="interactive-action-btn h-11 px-5 bg-copper text-ink hover:bg-copper-bright border-0 tracking-[0.14em] uppercase text-xs font-semibold"
          >
            Launch Interactive Demo
          </Button>
        </div>
      </div>
    </ParallaxTiltCard>
  )
}

interface PromptDetailCardProps {
  dapp: DappPrompt
}

export function PromptDetailCard({ dapp }: PromptDetailCardProps) {
  return (
    <ParallaxTiltCard className="glass-card border-primary/30 p-6 space-y-4 prompt-page-card">
      <h2 className="text-2xl font-bold gradient-text parallax-tilt-card__float">Full Prompt</h2>
      <div className="space-y-4 text-white leading-relaxed">
        <p className="text-lg">{dapp.description}</p>

        <div className="space-y-2 pt-4 border-t border-primary/20">
          <h3 className="text-lg font-semibold text-neon-purple">The Brief</h3>
          <p>{dapp.brief}</p>
        </div>

        <div className="space-y-2 pt-4 border-t border-primary/20">
          <h3 className="text-lg font-semibold text-neon-purple">Vibe Aesthetic</h3>
          <p className="italic text-white">{dapp.vibe}</p>
        </div>

        <div className="space-y-2 pt-4 border-t border-primary/20">
          <h3 className="text-lg font-semibold text-neon-purple">Key Features</h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {dapp.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 pt-4 border-t border-primary/20">
          <h3 className="text-lg font-semibold text-neon-purple">Suggested Stack</h3>
          <div className="flex flex-wrap gap-2">
            {dapp.stack.map((tool) => (
              <Badge key={tool} variant="outline" className="interactive-chip border-accent/40 text-accent px-3 py-1">
                {tool}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-white/70">
            Swap in whatever you like. Ship on a testnet first, and keep agent spending limits enforced onchain, not
            just in the prompt.
          </p>
        </div>
      </div>
    </ParallaxTiltCard>
  )
}

interface PromptCommentsCardProps {
  commentCount: number
  children: ReactNode
}

export function PromptCommentsCard({ commentCount, children }: PromptCommentsCardProps) {
  return (
    <ParallaxTiltCard pulseOnButtonClick className="glass-card border-primary/30 p-6 space-y-6 prompt-page-card">
      <div className="flex items-center justify-between parallax-tilt-card__float">
        <h3 className="text-2xl font-bold gradient-text">Community Discussion</h3>
        <span className="text-sm text-white">{commentCount} comments</span>
      </div>
      {children}
    </ParallaxTiltCard>
  )
}
