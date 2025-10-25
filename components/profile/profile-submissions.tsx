import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"

interface Submission {
  id: string
  dapp_day: number
  title: string
  description: string
  created_at: string
  status: string
  demo_url: string // Added demo_url field
}

interface ProfileSubmissionsProps {
  submissions: Submission[]
}

export function ProfileSubmissions({ submissions }: ProfileSubmissionsProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No DApps submitted yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {submissions.map((submission) => (
        <a key={submission.id} href={submission.demo_url} target="_blank" rel="noopener noreferrer" className="block">
          <Card className="glass-card border-primary/30 p-4 hover:border-primary/50 transition-colors cursor-pointer h-full">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white line-clamp-1 flex items-center gap-2">
                  {submission.title}
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </h3>
                {submission.dapp_day && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    Day {submission.dapp_day}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-400 line-clamp-2">{submission.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}</span>
                <Badge
                  variant="outline"
                  className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                >
                  {submission.status}
                </Badge>
              </div>
            </div>
          </Card>
        </a>
      ))}
    </div>
  )
}
