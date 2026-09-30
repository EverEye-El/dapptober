import type { ReactNode } from "react"
import { AsciiLogo } from "@/components/terminal/ascii-logo"
import { ParallaxBlock } from "@/components/terminal/parallax-block"

interface PageHeroProps {
  kicker: string
  word: string
  children?: ReactNode
}

export function PageHero({ kicker, word, children }: PageHeroProps) {
  return (
    <header className="container mx-auto px-4 lg:px-8 pt-8 pb-4 relative z-10">
      <ParallaxBlock depth={0.28} className="flex flex-col items-center text-center">
        <p className="term-kicker cursor-blink mb-4">{kicker}</p>
        <AsciiLogo word={word} />
        {children ? <div className="mt-5 max-w-2xl space-y-2">{children}</div> : null}
      </ParallaxBlock>
    </header>
  )
}
