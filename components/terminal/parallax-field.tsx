"use client"

import { useEffect, useRef } from "react"

const FLOATERS = [
  { text: "0xD4A574", top: "7%", left: "86%" },
  { text: "NODE::ONLINE", top: "92%", left: "84%" },
]

export function ParallaxField() {
  const gridRef = useRef<HTMLDivElement>(null)
  const midRef = useRef<HTMLDivElement>(null)
  const farRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--px", "0")
    root.style.setProperty("--py", "0")

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    let frame = 0
    let x = 0
    let y = 0
    let scroll = 0

    const apply = () => {
      frame = 0
      root.style.setProperty("--px", x.toFixed(4))
      root.style.setProperty("--py", y.toFixed(4))
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${x * -16}px, ${y * -12 + scroll * 0.05}px, 0)`
      }
      if (midRef.current) {
        midRef.current.style.transform = `translate3d(${x * 26}px, ${y * 18 - scroll * 0.16}px, 0)`
      }
      if (farRef.current) {
        farRef.current.style.transform = `translate3d(${x * -10}px, ${scroll * 0.22}px, 0)`
      }
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply)
    }

    const onMove = (event: MouseEvent) => {
      x = event.clientX / window.innerWidth - 0.5
      y = event.clientY / window.innerHeight - 0.5
      schedule()
    }

    const onScroll = () => {
      scroll = window.scrollY
      schedule()
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="parallax-field pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div ref={gridRef} className="parallax-grid absolute -inset-[10%]" />
      <div ref={farRef} className="absolute inset-x-0 top-[58%] flex justify-center">
        <pre className="parallax-watermark">31</pre>
      </div>
      <div ref={midRef} className="absolute inset-0">
        {FLOATERS.map((floater) => (
          <span
            key={floater.text}
            className="parallax-glyph absolute font-mono tracking-[0.22em]"
            style={{ top: floater.top, left: floater.left }}
          >
            {floater.text}
          </span>
        ))}
      </div>
      <div className="scanlines absolute inset-0" />
    </div>
  )
}
