"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ParallaxBlockProps {
  children: ReactNode
  className?: string
  depth?: number
}

export function ParallaxBlock({ children, className, depth = 0.35 }: ParallaxBlockProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    let frame = 0

    const apply = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const view = window.innerHeight || 1
      const progress = (view / 2 - (rect.top + rect.height / 2)) / view
      const shift = progress * depth * 72
      const mouse = (depth * 16).toFixed(1)
      const mouseY = (depth * 8).toFixed(1)
      el.style.transform = `translate3d(calc(var(--px) * ${mouse}px), calc(var(--py) * ${mouseY}px + ${shift.toFixed(2)}px), 0)`
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(apply)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    apply()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [depth])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
