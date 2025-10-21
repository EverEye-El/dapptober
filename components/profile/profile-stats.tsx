import { Card } from "@/components/ui/card"
import { MessageSquare, Heart, Rocket } from "lucide-react"

interface ProfileStatsProps {
  submissionsCount: number
  commentsCount: number
  likesCount: number
}

export function ProfileStats({ submissionsCount, commentsCount, likesCount }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="glass-card border-primary/30 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-neon-purple/20 border border-neon-purple/50">
            <Rocket className="w-6 h-6 text-neon-purple" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{submissionsCount}</p>
            <p className="text-sm text-gray-400">DApps Submitted</p>
          </div>
        </div>
      </Card>

      <Card className="glass-card border-primary/30 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-neon-orange/20 border border-neon-orange/50">
            <MessageSquare className="w-6 h-6 text-neon-orange" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{commentsCount}</p>
            <p className="text-sm text-gray-400">Comments Posted</p>
          </div>
        </div>
      </Card>

      <Card className="glass-card border-primary/30 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-pink-500/20 border border-pink-500/50">
            <Heart className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{likesCount}</p>
            <p className="text-sm text-gray-400">Likes Given</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
