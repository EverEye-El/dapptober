import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"

interface Submission {
  id: string
  day: number
  title: string
  description: string
  created_at: string
  status: string
  edition_year?: number | null
}

export function ProfileSubmissions({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No builds yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {submissions.map((submission) => {
        const year = submission.edition_year
        const archived = year != null && year < DAPPTOBER_YEAR
        return (
          <Link key={submission.id} href={`/showcase/${submission.id}`} className="block">
            <Card className="glass-card border-primary/30 p-4 hover:border-primary/50 transition-colors h-full">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white line-clamp-1">{submission.title}</h3>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {archived ? `${year} archive` : `${year ?? DAPPTOBER_YEAR}`} · Day {submission.day}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{submission.description}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                </p>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
