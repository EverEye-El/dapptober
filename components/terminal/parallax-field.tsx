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
    let pointerX = 0
    let pointerY = 0
    let scroll = 0

    const clamp = (value: number) => Math.max(-0.9, Math.min(0.9, value))

    const apply = () => {
      frame = 0
      const travel = Math.min(scroll / 640, 1)
      const x = clamp(pointerX + (travel - 0.2) * 0.65)
      const y = clamp(pointerY + travel * 0.4)
      root.style.setProperty("--px", x.toFixed(4))
      root.style.setProperty("--py", y.toFixed(4))
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${x * -28}px, ${y * -18 + scroll * 0.18}px, 0)`
      }
      if (midRef.current) {
        midRef.current.style.transform = `translate3d(${x * 36}px, ${y * 22 - scroll * 0.28}px, 0)`
      }
      if (farRef.current) {
        farRef.current.style.transform = `translate3d(${x * -18}px, ${scroll * -0.42}px, 0)`
      }
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply)
    }

    const onPointer = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5
      pointerY = event.clientY / window.innerHeight - 0.5
      schedule()
    }

    const onScroll = () => {
      scroll = window.scrollY
      schedule()
    }

    window.addEventListener("pointermove", onPointer, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="parallax-field pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div ref={gridRef} className="parallax-grid absolute -inset-[10%]" />
      <div ref={farRef} className="absolute inset-x-0 top-[34%] flex justify-center">
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
