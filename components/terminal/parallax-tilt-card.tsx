"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

interface ParallaxTiltCardProps {
  children: ReactNode
  className?: string
  id?: string
  /** Pulse the card when a button or link inside is clicked */
  pulseOnButtonClick?: boolean
}

export function ParallaxTiltCard({ children, className, id, pulseOnButtonClick = false }: ParallaxTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pulsed, setPulsed] = useState(false)
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    let frame = 0

    const applyScroll = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const view = window.innerHeight || 1
      const progress = (view / 2 - (rect.top + rect.height / 2)) / view
      el.style.setProperty("--card-scroll", `${(progress * 14).toFixed(2)}px`)
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(applyScroll)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    applyScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty("--tilt-x", x.toFixed(4))
    el.style.setProperty("--tilt-y", y.toFixed(4))
  }, [])

  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--tilt-x", "0")
    el.style.setProperty("--tilt-y", "0")
  }, [])

  const triggerPulse = useCallback(() => {
    setPulsed(true)
    if (pulseTimer.current) clearTimeout(pulseTimer.current)
    pulseTimer.current = setTimeout(() => setPulsed(false), 480)
  }, [])

  const onClickCapture = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!pulseOnButtonClick) return
      const target = event.target as HTMLElement
      if (target.closest("button, a[href], [role='button']")) {
        triggerPulse()
      }
    },
    [pulseOnButtonClick, triggerPulse],
  )

  return (
    <div
      ref={ref}
      id={id}
      className={cn("parallax-tilt-card scroll-mt-24", pulsed && "parallax-tilt-card--pulse", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClickCapture={onClickCapture}
    >
      <div className="parallax-tilt-card__glare" aria-hidden="true" />
      <div className="parallax-tilt-card__inner">{children}</div>
    </div>
  )
}
