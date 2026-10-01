"use client"

import { TypewriterText } from "@/components/terminal/typewriter-text"

interface PromptPageHeaderProps {
  title: string
  vibe: string
}

export function PromptPageHeader({ title, vibe }: PromptPageHeaderProps) {
  const vibeDelay = startDelayFor(title) + 280

  return (
    <div className="space-y-2 flex-1">
      <TypewriterText
        text={title}
        as="h1"
        className="text-3xl md:text-4xl font-bold gradient-text-main text-balance"
      />
      <TypewriterText
        text={vibe}
        as="p"
        startDelay={vibeDelay}
        className="text-lg text-white italic"
        charMs={22}
      />
    </div>
  )
}

function startDelayFor(text: string) {
  return Math.min(text.length * 28 + 120, 2400)
}
