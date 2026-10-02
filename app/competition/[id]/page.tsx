import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { ParallaxTiltCard } from "@/components/terminal/parallax-tilt-card"
import { AgentDemoFrame } from "@/components/competition/agent-demo-frame"
import { VoteButton } from "@/components/competition/vote-button"
import { PromptCommentsCard } from "@/components/dapp/prompt-page-cards"
import { CommentsSection } from "@/components/web3/comments-section"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"

interface CompetitionEntryPageProps {
  params: Promise<{ id: string }>
}

export default async function CompetitionEntryPage(props: CompetitionEntryPageProps) {
  const params = await props.params;
  if (!isSupabaseConfigured()) notFound()
  const supabase = await createClient()
  const { data: entry } = await supabase
    .from("competition_entries")
    .select("id, onchain_entry_id, name, description, demo_url, image_url, wallet_address, day")
    .eq("id", params.id)
    .maybeSingle()

  if (!entry) notFound()

  const { count } = await supabase
    .from("competition_votes")
    .select("*", { count: "exact", head: true })
    .eq("entry_id", entry.id)

  const { data: commentsData } = await supabase
    .from("comments")
    .select("id, content, created_at, wallet_address")
    .eq("entry_id", entry.id)
    .order("created_at", { ascending: false })

  const walletAddresses = commentsData
    ? [...new Set(commentsData.map((comment) => comment.wallet_address).filter(Boolean))]
    : []

  const { data: profilesData } =
    walletAddresses.length > 0
      ? await supabase.from("profiles").select("id, display_name, wallet_address").in("wallet_address", walletAddresses)
      : { data: [] }

  const profilesMap = new Map(profilesData?.map((profile) => [profile.wallet_address?.toLowerCase(), profile]) || [])
  const comments =
    commentsData?.map((comment) => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      wallet_address: comment.wallet_address,
      profiles: comment.wallet_address ? profilesMap.get(comment.wallet_address.toLowerCase()) || null : null,
    })) ?? []

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
        <Link href="/showcase#votes">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to votes
          </Button>
        </Link>
        {entry.demo_url ? <AgentDemoFrame url={entry.demo_url} title={`${entry.name} demo`} /> : null}
        <ParallaxTiltCard className="glass-card border-primary/30 overflow-hidden">
          <div className="relative h-64 bg-[oklch(0.16_0.014_55)]">
            {entry.image_url ? <Image src={entry.image_url} alt="" fill className="object-cover" /> : null}
          </div>
          <div className="space-y-4 p-6">
            {entry.day ? (
              <div className="term-chip w-fit">
                <span>DAY</span>
                <span className="text-sm tracking-normal">{String(entry.day).padStart(2, "0")}</span>
              </div>
            ) : null}
            <h1 className="text-3xl font-bold gradient-text">{entry.name}</h1>
            <p className="text-white">{entry.description}</p>
            {entry.demo_url ? (
              <a href={entry.demo_url} className="text-copper-bright underline" target="_blank" rel="noreferrer">
                Open demo
              </a>
            ) : null}
            {entry.onchain_entry_id !== null ? (
              <VoteButton entryId={entry.id} onchainEntryId={entry.onchain_entry_id} voteCount={count ?? 0} />
            ) : null}
          </div>
        </ParallaxTiltCard>
        <div id="comments-section">
          <PromptCommentsCard commentCount={comments.length}>
            <CommentsSection target={{ kind: "entry", entryId: entry.id }} initialComments={comments} />
          </PromptCommentsCard>
        </div>
      </div>
    </div>
  )
}
