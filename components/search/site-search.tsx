"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { emptySearchResults, isSearchable, normalizeQuery, type SearchHit, type SearchKind, type SearchResults } from "@/lib/search"

const RECENT_KEY = "dapptober-recent-searches"
const RECENT_LIMIT = 6

const GROUPS: { kind: SearchKind; label: string }[] = [
  { kind: "profile", label: "Builders" },
  { kind: "prompt", label: "Prompts" },
  { kind: "build", label: "Showcase" },
  { kind: "agent", label: "Competition" },
  { kind: "page", label: "Pages" },
  { kind: "comment", label: "Comments" },
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
    case "page":
      return results.pages
    case "comment":
      return results.comments
    default: {
      const unreachable: never = kind
      throw new Error(`Unknown search group: ${unreachable}`)
    }
  }
}

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === "string").slice(0, RECENT_LIMIT)
  } catch {
    return []
  }
}

export function SiteSearch() {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults>(emptySearchResults())
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle")
  const [active, setActive] = useState(0)
  const [recent, setRecent] = useState<string[]>([])

  const flat = GROUPS.flatMap((group) => hitsFor(results, group.kind))
  const showRecent = open && !isSearchable(query) && recent.length > 0
  const showResults = open && isSearchable(query)
  const showPanel = showRecent || showResults
  const optionCount = showRecent ? recent.length : flat.length

  useEffect(() => {
    setRecent(readRecent())
  }, [])

  useEffect(() => {
    const onSlash = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return
      const target = event.target
      if (target instanceof HTMLElement) {
        const tag = target.tagName
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return
      }
      event.preventDefault()
      setRecent(readRecent())
      inputRef.current?.focus()
      setOpen(true)
    }
    document.addEventListener("keydown", onSlash)
    return () => document.removeEventListener("keydown", onSlash)
  }, [])

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
          setResults({
            profiles: data.profiles ?? [],
            prompts: data.prompts ?? [],
            builds: data.builds ?? [],
            agents: data.agents ?? [],
            pages: data.pages ?? [],
            comments: data.comments ?? [],
          })
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

  const remember = (value: string) => {
    const nextQuery = normalizeQuery(value)
    if (!isSearchable(nextQuery)) return
    const next = [nextQuery, ...readRecent().filter((item) => item.toLowerCase() !== nextQuery.toLowerCase())].slice(
      0,
      RECENT_LIMIT,
    )
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    setRecent(next)
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false)
      return
    }
    if (!showPanel || optionCount === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((index) => (index + 1) % optionCount)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((index) => (index - 1 + optionCount) % optionCount)
    } else if (event.key === "Enter" && showRecent) {
      const picked = recent[active]
      if (!picked) return
      event.preventDefault()
      setQuery(picked)
      setOpen(true)
    } else if (event.key === "Enter") {
      const hit = flat[active]
      if (!hit) return
      event.preventDefault()
      remember(query)
      setOpen(false)
      router.push(hit.href)
    }
  }

  return (
    <div ref={rootRef} className="relative z-30 mx-auto w-full max-w-sm px-4 pt-6">
      <label htmlFor="site-search" className="sr-only">
        Search builders, wallets, prompts, rules, and comments
      </label>
      <div className="glass-card flex items-center gap-2 px-3 py-2 shadow-[0_16px_40px_oklch(0_0_0/0.45)]">
        <Search className="h-3.5 w-3.5 shrink-0 text-copper" aria-hidden="true" />
        <input
          ref={inputRef}
          id="site-search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setActive(0)
          }}
          onFocus={() => {
            setRecent(readRecent())
            setOpen(true)
          }}
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
        {query ? null : <span className="text-[10px] tracking-[0.14em] text-copper-dim">/</span>}
      </div>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="glass-modal absolute left-4 right-4 top-[calc(100%+0.45rem)] max-h-80 overflow-y-auto p-2"
        >
          {showRecent ? (
            <div className="py-1">
              <p className="px-2 pb-1 text-[10px] uppercase tracking-[0.16em] text-copper-dim">Recent</p>
              {recent.map((item, index) => {
                const selected = index === active
                return (
                  <button
                    key={item}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => {
                      setQuery(item)
                      setOpen(true)
                    }}
                    className={`block w-full px-2 py-1.5 text-left ${selected ? "bg-copper/15" : "hover:bg-copper/10"}`}
                  >
                    <span className="block truncate text-sm text-copper-bright">{item}</span>
                  </button>
                )
              })}
            </div>
          ) : null}

          {showResults && status === "loading" && flat.length === 0 ? (
            <p className="px-2 py-2 text-xs text-copper-dim">Scanning…</p>
          ) : null}
          {showResults && status === "ready" && flat.length === 0 ? (
            <p className="px-2 py-2 text-xs text-copper-dim">No hits.</p>
          ) : null}
          {showResults
            ? GROUPS.map((group) => {
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
                          onClick={() => {
                            remember(query)
                            setOpen(false)
                          }}
                          className={`block px-2 py-1.5 ${selected ? "bg-copper/15" : "hover:bg-copper/10"}`}
                        >
                          <span className="block truncate text-sm text-copper-bright">{hit.title}</span>
                          <span className="block truncate text-[11px] text-copper-dim">{hit.detail}</span>
                        </Link>
                      )
                    })}
                  </div>
                )
              })
            : null}
        </div>
      ) : null}
    </div>
  )
}
