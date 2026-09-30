"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type TypewriterElement = "h1" | "h2" | "h3" | "p" | "span"

interface TypewriterTextProps {
  text: string
  className?: string
  as?: TypewriterElement
  startDelay?: number
  charMs?: number
}

export function TypewriterText({
  text,
  className,
  as: Tag = "span",
  startDelay = 0,
  charMs = 28,
}: TypewriterTextProps) {
  const [visible, setVisible] = useState("")
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    setVisible("")
    setTyping(true)

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setVisible(text)
      setTyping(false)
      return
    }

    let index = 0
    let intervalId: ReturnType<typeof setInterval> | null = null
    const delayId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1
        setVisible(text.slice(0, index))
        if (index >= text.length) {
          if (intervalId) clearInterval(intervalId)
          setTyping(false)
        }
      }, charMs)
    }, startDelay)

    return () => {
      clearTimeout(delayId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, startDelay, charMs])

  return (
    <Tag className={cn("typewriter-text", typing ? "typewriter-text--typing" : "typewriter-text--done", className)}>
      {visible}
    </Tag>
  )
}
