import { dappPrompts } from "@/lib/dapp-prompts"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Eye, Users } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { LikeButton } from "@/components/web3/like-button"
import { CommentsSection } from "@/components/web3/comments-section"

interface DappPageProps {
  params: {
    day: string
  }
}

export function generateStaticParams() {
  return dappPrompts.map((dapp) => ({
    day: dapp.day.toString(),
  }))
}

export default async function DappPage({ params }: DappPageProps) {
  const dapp = dappPrompts.find((d) => d.day === Number.parseInt(params.day))

  if (!dapp) {
    notFound()
  }

  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get likes count and check if current user liked
  const { count: likesCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("dapp_day", dapp.day)

  const { data: userLike } = user
    ? await supabase.from("likes").select("id").eq("user_id", user.id).eq("dapp_day", dapp.day).single()
    : { data: null }

  // Get comments with user_id
  const { data: commentsData } = await supabase
    .from("comments")
    .select("id, content, created_at, user_id")
    .eq("dapp_day", dapp.day)
    .order("created_at", { ascending: false })

  // Get unique user IDs from comments
  const userIds = commentsData ? [...new Set(commentsData.map((c) => c.user_id))] : []

  // Fetch profiles for those users
  const { data: profilesData } =
    userIds.length > 0
      ? await supabase.from("profiles").select("id, display_name, wallet_address").in("id", userIds)
      : { data: [] }

  // Create a map of profiles for quick lookup
  const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || [])

  // Combine comments with profile data
  const comments = commentsData?.map((comment) => ({
    id: comment.id,
    content: comment.content,
    created_at: comment.created_at,
    profiles: profilesMap.get(comment.user_id) || null,
  }))

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-6xl">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full glass-card border-primary/50 neon-glow-orange">
                    <span className="text-sm font-bold gradient-text">{dapp.day}</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold gradient-text-main text-balance">{dapp.title}</h1>
                </div>
                <p className="text-lg text-accent italic">{dapp.vibe}</p>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 500) + 100}k views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 100) + 10}+ users</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {dapp.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="glass-card border-primary/30 text-accent px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* DApp Preview Section */}
          <Card className="glass-card border-primary/30 overflow-hidden">
            <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10">
              <Image src={dapp.image || "/placeholder.svg"} alt={dapp.title} fill className="object-cover" priority />
              <div className="absolute inset-0 border-2 border-primary/30 neon-glow-orange" />

              {/* Interactive Preview Overlay */}
              <div className="absolute inset-0 flex items-end p-6">
                <Button
                  size="lg"
                  className="neon-glow-orange bg-primary/80 hover:bg-primary border border-primary/50 font-semibold"
                >
                  Launch Interactive Demo
                </Button>
              </div>
            </div>
          </Card>

          {/* Full Prompt Section */}
          <Card className="glass-card border-primary/30 p-6 space-y-4">
            <h2 className="text-2xl font-bold gradient-text">Full Prompt</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">{dapp.description}</p>

              <div className="space-y-2 pt-4 border-t border-primary/20">
                <h3 className="text-lg font-semibold text-foreground">Vibe Aesthetic</h3>
                <p className="italic text-accent">{dapp.vibe}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-primary/20">
                <h3 className="text-lg font-semibold text-foreground">Technical Implementation</h3>
                <p>
                  This DApp leverages blockchain technology to create a decentralized experience that embodies the{" "}
                  {dapp.vibe} aesthetic. Built with modern Web3 tools and frameworks, it provides users with a seamless,
                  trustless interaction model while maintaining the unique character and vision of the project.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-primary/20">
                <h3 className="text-lg font-semibold text-foreground">Key Features</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Decentralized architecture ensuring transparency and security</li>
                  <li>Smart contract integration for automated, trustless operations</li>
                  <li>User-friendly interface designed with Web3 best practices</li>
                  <li>Community-driven governance and participation mechanisms</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Interaction Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Like Button Card */}
            <Card className="glass-card border-primary/30 p-6 space-y-4">
              <h3 className="text-xl font-bold gradient-text">Show Your Support</h3>
              <div className="flex items-center gap-4">
                <LikeButton dappDay={dapp.day} initialLikes={likesCount || 0} initialIsLiked={!!userLike} />
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to like this DApp and show your appreciation to the creator.
              </p>
            </Card>

            {/* Quick Stats Card */}
            <Card className="glass-card border-primary/30 p-6 space-y-4">
              <h3 className="text-xl font-bold gradient-text">Community Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-accent">{comments?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Comments</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-accent">{likesCount || 0}</div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-accent">{Math.floor(Math.random() * 30) + 5}</div>
                  <div className="text-xs text-muted-foreground">Contributors</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-accent">#{dapp.day}</div>
                  <div className="text-xs text-muted-foreground">Day</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Comments Section */}
          <Card className="glass-card border-primary/30 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold gradient-text">Community Discussion</h3>
              <span className="text-sm text-muted-foreground">{comments?.length || 0} comments</span>
            </div>

            <CommentsSection dappDay={dapp.day} initialComments={comments || []} />
          </Card>
        </div>
      </div>
    </div>
  )
}
