import { dappPrompts } from "@/lib/dapp-prompts"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { CommentsSection } from "@/components/web3/comments-section"
import { DappSidebar } from "@/components/web3/dapp-sidebar"
import { Sidebar } from "@/components/sidebar"

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

  const { count: likesCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("dapp_day", dapp.day)

  const { data: commentsData } = await supabase
    .from("comments")
    .select("id, content, created_at, wallet_address")
    .eq("dapp_day", dapp.day)
    .order("created_at", { ascending: false })

  // Get unique wallet addresses from comments
  const walletAddresses = commentsData ? [...new Set(commentsData.map((c) => c.wallet_address).filter(Boolean))] : []

  // Fetch profiles for those wallet addresses
  const { data: profilesData } =
    walletAddresses.length > 0
      ? await supabase.from("profiles").select("id, display_name, wallet_address").in("wallet_address", walletAddresses)
      : { data: [] }

  // Create a map of profiles for quick lookup by wallet address
  const profilesMap = new Map(profilesData?.map((p) => [p.wallet_address?.toLowerCase(), p]) || [])

  // Combine comments with profile data
  const comments = commentsData?.map((comment) => ({
    id: comment.id,
    content: comment.content,
    created_at: comment.created_at,
    wallet_address: comment.wallet_address,
    profiles: comment.wallet_address ? profilesMap.get(comment.wallet_address.toLowerCase()) || null : null,
  }))

  const viewsCount = Math.floor(Math.random() * 500) + 100
  const usersCount = Math.floor(Math.random() * 100) + 10

  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full glass-card border-primary/50 neon-glow-orange lg:hidden">
                      <span className="text-sm font-bold gradient-text">{dapp.day}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold gradient-text-main text-balance">{dapp.title}</h1>
                  </div>
                  <p className="text-lg text-white italic">{dapp.vibe}</p>
                </div>

                {/* Stats - Mobile Only */}
                <div className="flex flex-col gap-2 text-sm text-white lg:hidden">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{viewsCount}k views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{usersCount}+ users</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {dapp.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="glass-card border-primary/30 text-white px-3 py-1">
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
              <div className="space-y-4 text-white leading-relaxed">
                <p className="text-lg">{dapp.description}</p>

                <div className="space-y-2 pt-4 border-t border-primary/20">
                  <h3 className="text-lg font-semibold text-neon-purple">Vibe Aesthetic</h3>
                  <p className="italic text-white">{dapp.vibe}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-primary/20">
                  <h3 className="text-lg font-semibold text-neon-purple">Technical Implementation</h3>
                  <p>
                    This DApp leverages blockchain technology to create a decentralized experience that embodies the{" "}
                    {dapp.vibe} aesthetic. Built with modern Web3 tools and frameworks, it provides users with a
                    seamless, trustless interaction model while maintaining the unique character and vision of the
                    project.
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-primary/20">
                  <h3 className="text-lg font-semibold text-neon-purple">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Decentralized architecture ensuring transparency and security</li>
                    <li>Smart contract integration for automated, trustless operations</li>
                    <li>User-friendly interface designed with Web3 best practices</li>
                    <li>Community-driven governance and participation mechanisms</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <Card id="comments-section" className="glass-card border-primary/30 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold gradient-text">Community Discussion</h3>
                <span className="text-sm text-white">{comments?.length || 0} comments</span>
              </div>

              <CommentsSection dappDay={dapp.day} initialComments={comments || []} />
            </Card>
          </div>

          <div className="hidden lg:block w-80 flex-shrink-0">
            <DappSidebar
              dappDay={dapp.day}
              dappTitle={dapp.title}
              likesCount={likesCount || 0}
              commentsCount={comments?.length || 0}
              viewsCount={viewsCount}
              usersCount={usersCount}
              isLiked={false} // Assuming no user context for simplicity
            />
          </div>
        </div>
      </div>
    </div>
  )
}
