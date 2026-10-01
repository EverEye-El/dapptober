import { DAPPTOBER_YEAR, dappPrompts } from "@/lib/dapp-prompts"

export type SearchKind = "profile" | "prompt" | "build" | "agent"

export interface SearchHit {
  id: string
  kind: SearchKind
  title: string
  detail: string
  href: string
}

export interface SearchResults {
  profiles: SearchHit[]
  prompts: SearchHit[]
  builds: SearchHit[]
  agents: SearchHit[]
}

const EMPTY_RESULTS: SearchResults = {
  profiles: [],
  prompts: [],
  builds: [],
  agents: [],
}

export function emptySearchResults(): SearchResults {
  return EMPTY_RESULTS
}

export function normalizeQuery(raw: string) {
  return raw.trim().replace(/\s+/g, " ").slice(0, 80)
}

export function ilikeTerm(raw: string) {
  return normalizeQuery(raw).replace(/[%_,.()"'\\]/g, "").slice(0, 64)
}

export function isSearchable(raw: string) {
  const query = normalizeQuery(raw)
  if (/^0x[a-f0-9]{3,40}$/i.test(query)) return true
  if (/^\d{1,2}$/.test(query)) {
    const day = Number(query)
    return day >= 1 && day <= 31
  }
  return query.length >= 2
}

export function isFullWallet(raw: string) {
  return /^0x[a-f0-9]{40}$/i.test(normalizeQuery(raw))
}

export function shortAddress(address: string) {
  const clean = address.toLowerCase()
  if (clean.length < 12) return clean
  return `${clean.slice(0, 6)}...${clean.slice(-4)}`
}

export function profileLabel(displayName: string | null | undefined, wallet: string) {
  const name = displayName?.trim()
  if (!name || name.toLowerCase() === wallet.toLowerCase()) return shortAddress(wallet)
  return name
}

export function searchPrompts(raw: string): SearchHit[] {
  const query = normalizeQuery(raw).toLowerCase()
  if (!isSearchable(raw)) return []

  const dayQuery = /^\d{1,2}$/.test(query) ? Number(query) : null

  const ranked = dappPrompts
    .map((prompt) => {
      const title = prompt.title.toLowerCase()
      const description = prompt.description.toLowerCase()
      const vibe = prompt.vibe.toLowerCase()
      const brief = prompt.brief.toLowerCase()
      const tags = prompt.tags.map((tag) => tag.toLowerCase())
      const stack = prompt.stack.map((item) => item.toLowerCase())
      const features = prompt.features.map((feature) => feature.toLowerCase())
      let score = 0
      const matchedTag = prompt.tags.find((tag) => tag.toLowerCase().includes(query))

      if (dayQuery === prompt.day || query === `day ${prompt.day}`) score += 120
      if (tags.some((tag) => tag === query)) score += 100
      else if (matchedTag) score += 70
      if (title.includes(query)) score += 55
      if (stack.some((item) => item.includes(query))) score += 35
      if (description.includes(query)) score += 25
      if (vibe.includes(query)) score += 15
      if (brief.includes(query) || features.some((feature) => feature.includes(query))) score += 10

      const detailParts = [`Day ${String(prompt.day).padStart(2, "0")}`]
      if (matchedTag) detailParts.push(matchedTag)

      return {
        score,
        day: prompt.day,
        hit: {
          id: `prompt-${prompt.day}`,
          kind: "prompt" as const,
          title: prompt.title,
          detail: detailParts.join(" · "),
          href: `/dapp/${prompt.day}`,
        },
      }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.day - b.day)

  return ranked.slice(0, 8).map((entry) => entry.hit)
}

export function walletHref(address: string) {
  return `/profile/${address.toLowerCase()}`
}

export function editionDetail(day: number, editionYear: number | null) {
  const label = editionYear && editionYear < DAPPTOBER_YEAR ? String(editionYear) : String(editionYear ?? DAPPTOBER_YEAR)
  return `Day ${String(day).padStart(2, "0")} · ${label}`
}
