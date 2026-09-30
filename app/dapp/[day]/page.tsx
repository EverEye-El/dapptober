import { dappPrompts, getDappStats } from "@/lib/dapp-prompts"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Eye, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PromptCommentsCard, PromptDetailCard, PromptPreviewCard } from "@/components/dapp/prompt-page-cards"
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

  const { views: viewsCount, users: usersCount } = getDappStats(dapp.day)

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
                    <div className="term-chip lg:hidden">
                      <span>DAY</span>
                      <span className="text-sm tracking-normal">{String(dapp.day).padStart(2, "0")}</span>
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

            <PromptPreviewCard title={dapp.title} image={dapp.image || "/placeholder.svg"} />

            <PromptDetailCard dapp={dapp} />

            <div id="comments-section">
              <PromptCommentsCard commentCount={comments?.length || 0}>
                <CommentsSection dappDay={dapp.day} initialComments={comments || []} />
              </PromptCommentsCard>
            </div>
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
