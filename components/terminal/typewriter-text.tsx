"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { cn } from "@/lib/utils"

type TypewriterElement = "h1" | "h2" | "h3" | "p" | "span"

interface TypewriterTextProps {
  text: string
  className?: string
  as?: TypewriterElement
  /** Delay after a run starts (on scroll-in or idle repeat). */
  startDelay?: number
  charMs?: number
  showCursor?: boolean
  /** Fraction of the element that must be visible to count as "in section". */
  viewThreshold?: number
  /** Intersection root margin; positive bottom starts typing before the target reaches the fold. */
  viewRootMargin?: string
  /** Observe this element for visibility instead of the text node (e.g. whole card). */
  observeRef?: RefObject<Element | null>
  /** While in view, re-run the effect after this many ms once typing finishes. `0` disables. */
  idleRepeatMs?: number
}

export function TypewriterText({
  text,
  className,
  as: Tag = "span",
  startDelay = 0,
  charMs = 28,
  showCursor = false,
  viewThreshold = 0.12,
  viewRootMargin = "0px 0px -4% 0px",
  observeRef,
  idleRepeatMs = 60_000,
}: TypewriterTextProps) {
  const ref = useRef<HTMLElement>(null)
  const inViewRef = useRef(false)
  const runIdRef = useRef(0)

  const [visible, setVisible] = useState("")
  const [typing, setTyping] = useState(false)
  const [inView, setInView] = useState(false)
  const [playKey, setPlayKey] = useState(0)

  useEffect(() => {
    inViewRef.current = inView
  }, [inView])

  useEffect(() => {
    runIdRef.current += 1
    setInView(false)
    setVisible("")
    setTyping(false)
    setPlayKey(0)

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const observerOptions = { threshold: viewThreshold, rootMargin: viewRootMargin }
    let observer: IntersectionObserver | null = null
    let rafId = 0

    const attachObserver = () => {
      const node = observeRef?.current ?? ref.current
      if (!node) {
        rafId = requestAnimationFrame(attachObserver)
        return
      }

      if (reduce) {
        const showFull = () => {
          setVisible(text)
          setTyping(false)
          setInView(true)
          inViewRef.current = true
        }
        showFull()
        observer = new IntersectionObserver(([entry]) => {
          inViewRef.current = entry.isIntersecting
          setInView(entry.isIntersecting)
          if (entry.isIntersecting) showFull()
        }, observerOptions)
        observer.observe(node)
        return
      }

      observer = new IntersectionObserver(([entry]) => {
        const intersecting = entry.isIntersecting
        inViewRef.current = intersecting
        setInView(intersecting)

        if (intersecting) {
          setPlayKey((key) => key + 1)
        } else {
          runIdRef.current += 1
          setVisible("")
          setTyping(false)
        }
      }, observerOptions)
      observer.observe(node)
    }

    attachObserver()

    return () => {
      cancelAnimationFrame(rafId)
      observer?.disconnect()
    }
  }, [text, viewThreshold, viewRootMargin, observeRef])

  useEffect(() => {
    if (!inView || playKey === 0) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setVisible(text)
      setTyping(false)
      return
    }

    const runId = ++runIdRef.current
    setVisible("")
    setTyping(true)

    let intervalId: ReturnType<typeof setInterval> | null = null
    let idleTimeoutId: ReturnType<typeof setTimeout> | null = null

    let index = 0
    const delayId = setTimeout(() => {
      if (runId !== runIdRef.current) return

      intervalId = setInterval(() => {
        if (runId !== runIdRef.current) return

        index += 1
        setVisible(text.slice(0, index))
        if (index >= text.length) {
          if (intervalId) clearInterval(intervalId)
          intervalId = null
          setTyping(false)

          if (idleRepeatMs > 0 && inViewRef.current) {
            idleTimeoutId = setTimeout(() => {
              if (runId !== runIdRef.current || !inViewRef.current) return
              setPlayKey((key) => key + 1)
            }, idleRepeatMs)
          }
        }
      }, charMs)
    }, startDelay)

    return () => {
      if (runId === runIdRef.current) {
        runIdRef.current += 1
      }
      clearTimeout(delayId)
      if (intervalId) clearInterval(intervalId)
      if (idleTimeoutId) clearTimeout(idleTimeoutId)
    }
  }, [playKey, inView, text, startDelay, charMs, idleRepeatMs])

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "typewriter-text",
        showCursor && "typewriter-text--cursor",
        typing ? "typewriter-text--typing" : "typewriter-text--done",
        className,
      )}
    >
      {visible}
    </Tag>
  )
}
