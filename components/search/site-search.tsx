"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { emptySearchResults, isSearchable, type SearchHit, type SearchKind, type SearchResults } from "@/lib/search"

const GROUPS: { kind: SearchKind; label: string }[] = [
  { kind: "profile", label: "Builders" },
  { kind: "prompt", label: "Prompts" },
  { kind: "build", label: "Showcase" },
  { kind: "agent", label: "Competition" },
]

function hitsFor(results: SearchResults, kind: SearchKind): SearchHit[] {
  switch (kind) {
    case "profile":
      return results.profiles
    case "prompt":
      return results.prompts
    case "build":
      return results.builds
    case "agent":
      return results.agents
    default: {
      const unreachable: never = kind
      throw new Error(`Unknown search group: ${unreachable}`)
    }
  }
}

export function SiteSearch() {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults>(emptySearchResults())
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle")
  const [active, setActive] = useState(0)

  const flat = GROUPS.flatMap((group) => hitsFor(results, group.kind))
  const showPanel = open && isSearchable(query)

  useEffect(() => {
    if (!isSearchable(query)) {
      setResults(emptySearchResults())
      setStatus("idle")
      return
    }

    setStatus("loading")
    const controller = new AbortController()
    const handle = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((response) => response.json())
        .then((data: SearchResults) => {
          setResults(data)
          setActive(0)
          setStatus("ready")
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return
          setStatus("ready")
        })
    }, 160)

    return () => {
      window.clearTimeout(handle)
      controller.abort()
    }
  }, [query])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false)
      return
    }
    if (!showPanel || flat.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((index) => (index + 1) % flat.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((index) => (index - 1 + flat.length) % flat.length)
    } else if (event.key === "Enter") {
      const hit = flat[active]
      if (!hit) return
      event.preventDefault()
      setOpen(false)
      router.push(hit.href)
    }
  }

  return (
    <div ref={rootRef} className="relative z-30 mx-auto w-full max-w-sm px-4 pt-6">
      <label htmlFor="site-search" className="sr-only">
        Search builders, wallets, and prompts
      </label>
      <div className="glass-card flex items-center gap-2 px-3 py-2 shadow-[0_16px_40px_oklch(0_0_0/0.45)]">
        <Search className="h-3.5 w-3.5 shrink-0 text-copper" aria-hidden="true" />
        <input
          id="site-search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="jev, mcp, wallets"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          className="w-full bg-transparent font-mono text-sm text-copper-bright outline-none placeholder:text-copper-dim"
        />
      </div>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="glass-modal absolute left-4 right-4 top-[calc(100%+0.45rem)] max-h-80 overflow-y-auto p-2"
        >
          {status === "loading" && flat.length === 0 ? (
            <p className="px-2 py-2 text-xs text-copper-dim">Scanning…</p>
          ) : null}
          {status === "ready" && flat.length === 0 ? <p className="px-2 py-2 text-xs text-copper-dim">No hits.</p> : null}
          {GROUPS.map((group) => {
            const hits = hitsFor(results, group.kind)
            if (hits.length === 0) return null
            return (
              <div key={group.kind} className="py-1">
                <p className="px-2 pb-1 text-[10px] uppercase tracking-[0.16em] text-copper-dim">{group.label}</p>
                {hits.map((hit) => {
                  const index = flat.indexOf(hit)
                  const selected = index === active
                  return (
                    <Link
                      key={hit.id}
                      href={hit.href}
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => setOpen(false)}
                      className={`block px-2 py-1.5 ${selected ? "bg-copper/15" : "hover:bg-copper/10"}`}
                    >
                      <span className="block truncate text-sm text-copper-bright">{hit.title}</span>
                      <span className="block truncate text-[11px] text-copper-dim">{hit.detail}</span>
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
