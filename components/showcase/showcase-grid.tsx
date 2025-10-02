"use client"

import { useEffect, useState } from "react"
import { ShowcaseCard } from "./showcase-card"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Submission {
  id: string
  dapp_day: number
  title: string
  description: string
  demo_url?: string
  github_url?: string
  image_url?: string
  created_at: string
  profile: {
    display_name?: string
    wallet_address: string
    avatar_url?: string
  }
  likes_count: number
  comments_count: number
}

export function ShowcaseGrid() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch("/api/showcase")
        if (!response.ok) {
          throw new Error("Failed to fetch submissions")
        }
        const data = await response.json()
        setSubmissions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading showcase...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Alert variant="destructive" className="glass-card border-destructive/50">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="glass-card max-w-md mx-auto p-8 space-y-4">
          <h3 className="text-xl font-bold gradient-text">No Submissions Yet</h3>
          <p className="text-sm text-muted-foreground">
            Be the first to submit your Dapptober project! Check out the prompts and start building.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {submissions.map((submission) => (
        <ShowcaseCard key={submission.id} submission={submission} />
      ))}
    </div>
  )
}
