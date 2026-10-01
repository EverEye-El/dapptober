"use client"

import type { ReactNode } from "react"
import { ParallaxTiltCard } from "@/components/terminal/parallax-tilt-card"
import { TypewriterText } from "@/components/terminal/typewriter-text"
import { cn } from "@/lib/utils"

interface InteractiveGlassCardProps {
  children: ReactNode
  className?: string
  title?: string
  titleAs?: "h2" | "h3"
  titleClassName?: string
  titlePrefix?: ReactNode
  titleStartDelay?: number
  typewriterTitle?: boolean
  pulseOnButtonClick?: boolean
  id?: string
}

export function InteractiveGlassCard({
  children,
  className,
  title,
  titleAs = "h2",
  titleClassName,
  titlePrefix,
  titleStartDelay = 0,
  typewriterTitle = false,
  pulseOnButtonClick = false,
  id,
}: InteractiveGlassCardProps) {
  const TitleTag = titleAs

  return (
    <ParallaxTiltCard
      id={id}
      pulseOnButtonClick={pulseOnButtonClick}
      className={cn("glass-card prompt-page-card", className)}
    >
      {title ? (
        <TitleTag
          className={cn(titleAs === "h3" ? "mb-2" : "mb-3", "parallax-tilt-card__float", titleClassName)}
        >
          {titlePrefix}
          {typewriterTitle ? (
            <TypewriterText text={title} as="span" startDelay={titleStartDelay} className="inline" />
          ) : (
            title
          )}
        </TitleTag>
      ) : null}
      {children}
    </ParallaxTiltCard>
  )
}
