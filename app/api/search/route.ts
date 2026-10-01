import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"
import {
  editionDetail,
  emptySearchResults,
  ilikeTerm,
  isFullWallet,
  isSearchable,
  profileLabel,
  searchPrompts,
  shortAddress,
  walletHref,
  type SearchHit,
  type SearchResults,
} from "@/lib/search"
import { searchPages } from "@/lib/search-pages"

export const dynamic = "force-dynamic"

interface ProfileRow {
  wallet_address: string
  display_name: string | null
}

interface BuildRow {
  id: string
  title: string
  day: number
  edition_year: number | null
  wallet_address: string
}

interface AgentRow {
  id: string
  name: string
  wallet_address: string
}

interface CommentRow {
  id: string
  content: string
  dapp_day: number
  submission_id: string | null
  wallet_address: string | null
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? ""
  if (!isSearchable(query)) {
    return NextResponse.json(emptySearchResults())
  }

  const results: SearchResults = {
    profiles: [],
    prompts: searchPrompts(query),
    builds: [],
    agents: [],
    pages: searchPages(query),
    comments: [],
  }

  const term = ilikeTerm(query)
  if (!term || !isSupabaseConfigured()) {
    return NextResponse.json(results)
  }

  try {
    const supabase = await createClient()
    const pattern = `%${term}%`
    const walletish = /^0x[a-f0-9]{3,40}$/i.test(term)
    const profileFilter = walletish
      ? `display_name.ilike."${pattern}",wallet_address.ilike."${pattern}"`
      : `display_name.ilike."${pattern}"`
    const textOrWallet = (columns: string[]) => {
      const fields = walletish ? [...columns, "wallet_address"] : columns
      return fields.map((column) => `${column}.ilike."${pattern}"`).join(",")
    }

    const [profilesResponse, buildsResponse, agentsResponse, commentsResponse] = await Promise.all([
      supabase.from("profiles").select("wallet_address, display_name").or(profileFilter).limit(6),
      supabase
        .from("submissions")
        .select("id, title, day, edition_year, wallet_address")
        .or(textOrWallet(["title", "description"]))
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("competition_entries")
        .select("id, name, wallet_address")
        .eq("status", "registered")
        .or(textOrWallet(["name", "description"]))
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("comments")
        .select("id, content, dapp_day, submission_id, wallet_address")
        .ilike("content", pattern)
        .order("created_at", { ascending: false })
        .limit(6),
    ])

    const profiles = (profilesResponse.data ?? []) as ProfileRow[]
    results.profiles = profiles.map((profile) => ({
      id: `profile-${profile.wallet_address}`,
      kind: "profile" as const,
      title: profileLabel(profile.display_name, profile.wallet_address),
      detail: profileLabel(profile.display_name, profile.wallet_address) === shortAddress(profile.wallet_address)
        ? "Profile"
        : shortAddress(profile.wallet_address),
      href: walletHref(profile.wallet_address),
    }))

    if (isFullWallet(query)) {
      const address = query.trim().toLowerCase()
      const already = results.profiles.some((hit) => hit.href === walletHref(address))
      if (!already) {
        const direct: SearchHit = {
          id: `profile-${address}`,
          kind: "profile",
          title: shortAddress(address),
          detail: "Profile",
          href: walletHref(address),
        }
        results.profiles = [direct, ...results.profiles].slice(0, 6)
      }
    }

    const builds = (buildsResponse.data ?? []) as BuildRow[]
    results.builds = builds.map((build) => ({
      id: `build-${build.id}`,
      kind: "build" as const,
      title: build.title,
      detail: editionDetail(build.day, build.edition_year),
      href: `/showcase/${build.id}`,
    }))

    const agents = (agentsResponse.data ?? []) as AgentRow[]
    results.agents = agents.map((agent) => ({
      id: `agent-${agent.id}`,
      kind: "agent" as const,
      title: agent.name,
      detail: shortAddress(agent.wallet_address),
      href: `/competition/${agent.id}`,
    }))

    const comments = (commentsResponse.data ?? []) as CommentRow[]
    results.comments = comments.map((comment) => {
      const text = comment.content.replace(/\s+/g, " ").trim()
      const wallet = comment.wallet_address ? shortAddress(comment.wallet_address) : "Comment"
      const place = comment.submission_id ? "Showcase" : `Day ${String(comment.dapp_day).padStart(2, "0")}`
      const href = comment.submission_id
        ? `/showcase/${comment.submission_id}#comment-${comment.id}`
        : `/dapp/${comment.dapp_day}#comment-${comment.id}`
      return {
        id: `comment-${comment.id}`,
        kind: "comment" as const,
        title: text.length > 80 ? `${text.slice(0, 77)}...` : text,
        detail: `${place} · ${wallet}`,
        href,
      }
    })
  } catch (error) {
    console.error("[search] lookup failed", error)
  }

  return NextResponse.json(results)
}
