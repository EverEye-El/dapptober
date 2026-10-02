"use client"

import { useEffect, useState } from "react"
import { ShowcaseCard } from "./showcase-card"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"

type Edition = "current" | "archive"

interface Submission {
  id: string
  dapp_day: number
  title: string
  description: string
  demo_url?: string
  github_url?: string
  image_url?: string
  banner_position?: string | null
  created_at: string
  edition_year?: number
  profile: {
    display_name?: string
    wallet_address: string
    avatar_url?: string
  }
  likes_count: number
  comments_count: number
}

export function ShowcaseGrid() {
  const [edition, setEdition] = useState<Edition>("current")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchSubmissions() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(edition === "archive" ? "/api/showcase?edition=archive" : "/api/showcase")
        if (!response.ok) {
          throw new Error("Failed to fetch submissions")
        }
        const data = await response.json()
        if (!cancelled) setSubmissions(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSubmissions()
    return () => {
      cancelled = true
    }
  }, [edition])

  const toggle = (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => {
          setLoading(true)
          setEdition("current")
        }}
        className={`term-btn h-10 px-4 ${edition === "current" ? "" : "opacity-55"}`}
        aria-pressed={edition === "current"}
      >
        {DAPPTOBER_YEAR}
      </button>
      <button
        type="button"
        onClick={() => {
          setLoading(true)
          setEdition("archive")
        }}
        className={`term-btn h-10 px-4 ${edition === "archive" ? "" : "opacity-55"}`}
        aria-pressed={edition === "archive"}
      >
        Archive
      </button>
      <p className="text-xs tracking-[0.14em] uppercase text-copper-dim">
        {edition === "current" ? `Agents shipped in ${DAPPTOBER_YEAR}` : "Earlier Dapptobers"}
      </p>
    </div>
  )

  if (loading) {
    return (
      <div>
        {toggle}
        <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading showcase...</p>
        </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {toggle}
        <div className="max-w-2xl mx-auto py-12">
        <Alert variant="destructive" className="glass-card border-destructive/50">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        </div>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div>
        {toggle}
        <div className="text-center py-20">
          <div className="glass-card max-w-md mx-auto p-8 space-y-4">
            <h3 className="text-xl font-bold gradient-text">
              {edition === "current" ? "No Submissions Yet" : "Archive is empty"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {edition === "current"
                ? `Be the first to submit your Dapptober ${DAPPTOBER_YEAR} build. Pick a prompt, give your agent a wallet, and ship it.`
                : "Earlier years will show up here."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {toggle}
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
      {submissions.map((submission, index) => (
        <div key={submission.id} className="w-[min(85vw,22rem)] shrink-0 snap-start">
          <ShowcaseCard submission={submission} titleStartDelay={index * 80} />
        </div>
      ))}
      </div>
    </div>
  )
}
