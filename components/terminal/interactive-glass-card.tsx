"use client"

import type { ReactNode } from "react"
import { ParallaxTiltCard } from "@/components/terminal/parallax-tilt-card"
import { cn } from "@/lib/utils"

interface InteractiveGlassCardProps {
  children: ReactNode
  className?: string
  title?: string
  titleAs?: "h2" | "h3"
  titleClassName?: string
  titlePrefix?: ReactNode
  pulseOnButtonClick?: boolean
}

export function InteractiveGlassCard({
  children,
  className,
  title,
  titleAs = "h2",
  titleClassName,
  titlePrefix,
  pulseOnButtonClick = false,
}: InteractiveGlassCardProps) {
  const TitleTag = titleAs

  return (
    <ParallaxTiltCard pulseOnButtonClick={pulseOnButtonClick} className={cn("glass-card prompt-page-card", className)}>
      {title ? (
        <TitleTag
          className={cn(titleAs === "h3" ? "mb-2" : "mb-3", "parallax-tilt-card__float", titleClassName)}
        >
          {titlePrefix}
          {title}
        </TitleTag>
      ) : null}
      {children}
    </ParallaxTiltCard>
  )
}
