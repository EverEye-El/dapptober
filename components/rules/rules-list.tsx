"use client"

import type { ReactNode } from "react"
import { InteractiveGlassCard } from "@/components/terminal/interactive-glass-card"
import { searchSlug } from "@/lib/search-pages"

interface RuleItem {
  emoji: string
  title: string
  body: ReactNode
}

interface RulesListProps {
  rules: RuleItem[]
}

export function RulesList({ rules }: RulesListProps) {
  return (
    <div className="space-y-8">
      {rules.map((rule, index) => (
        <InteractiveGlassCard
          key={rule.title}
          id={searchSlug(rule.title)}
          className="p-6 border border-primary/20 rounded-xl scroll-mt-24"
          title={rule.title}
          typewriterTitle
          titleStartDelay={index * 120}
          titleClassName="text-2xl font-bold gradient-text inline"
          titlePrefix={<span>{rule.emoji} </span>}
        >
          {rule.body}
        </InteractiveGlassCard>
      ))}

      <InteractiveGlassCard
        id={searchSlug("Bonus Rule: Don't Just Build. Vibe.")}
        className="p-6 border border-primary/30 rounded-xl bg-primary/5 scroll-mt-24"
        title="Bonus Rule: Don't Just Build. Vibe."
        typewriterTitle
        titleStartDelay={rules.length * 120}
        titleClassName="text-2xl font-bold gradient-text inline"
        titlePrefix={<span>🪩 </span>}
      >
        <p className="text-white/70 mb-2">Remember, Dapptober isn&apos;t about perfection.</p>
        <p className="text-white/70">
          It&apos;s about momentum, memes, and making the chain (and its agents) a little weirder every day.
        </p>
      </InteractiveGlassCard>

      <div className="text-center py-8">
        <p className="text-lg text-white/90 font-medium mb-2">gm & good luck, builder.</p>
        <p className="text-white/70">Your commit history is your legacy. Your agent&apos;s logs are its alibi. ⚡</p>
      </div>
    </div>
  )
}
