import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Github } from "@/components/icons/github"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { ParallaxTiltCard } from "@/components/terminal/parallax-tilt-card"
import { PromptCommentsCard } from "@/components/dapp/prompt-page-cards"
import { CommentsSection } from "@/components/web3/comments-section"
import { LikeButton } from "@/components/web3/like-button"
import { AgentDemoFrame } from "@/components/competition/agent-demo-frame"
import { SubmissionEditor } from "@/components/showcase/submission-editor"
import { formatBannerPosition, parseBannerPosition } from "@/lib/community/banner-position"
import { isDisplayableImageUrl } from "@/lib/community/image-url"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"

interface ShowcaseDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ShowcaseDetailPage(props: ShowcaseDetailPageProps) {
  const params = await props.params;
  if (!isSupabaseConfigured()) {
    notFound()
  }

  const supabase = await createClient()
  const { data: submission } = await supabase
    .from("submissions")
    .select("id, day, title, description, demo_url, github_url, image_url, banner_position, created_at, wallet_address, edition_year")
    .eq("id", params.id)
    .maybeSingle()

  if (!submission) {
    notFound()
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, wallet_address")
    .eq("wallet_address", submission.wallet_address)
    .maybeSingle()

  const { count: likesCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("submission_id", submission.id)

  const { data: commentsData } = await supabase
    .from("comments")
    .select("id, content, created_at, wallet_address")
    .eq("submission_id", submission.id)
    .order("created_at", { ascending: false })

  const walletAddresses = commentsData
    ? [...new Set(commentsData.map((c) => c.wallet_address).filter(Boolean))]
    : []

  const { data: profilesData } =
    walletAddresses.length > 0
      ? await supabase.from("profiles").select("id, display_name, wallet_address").in("wallet_address", walletAddresses)
      : { data: [] }

  const profilesMap = new Map(profilesData?.map((p) => [p.wallet_address?.toLowerCase(), p]) || [])
  const comments =
    commentsData?.map((comment) => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      wallet_address: comment.wallet_address,
      profiles: comment.wallet_address ? profilesMap.get(comment.wallet_address.toLowerCase()) || null : null,
    })) ?? []

  const author = profile?.display_name || `${submission.wallet_address.slice(0, 6)}...${submission.wallet_address.slice(-4)}`
  const target = { kind: "submission" as const, submissionId: submission.id, dappDay: submission.day }
  const cover = isDisplayableImageUrl(submission.image_url) ? submission.image_url : null
  const bannerPosition = formatBannerPosition(parseBannerPosition(submission.banner_position))

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="container mx-auto px-4 lg:px-8 py-4 max-w-6xl space-y-5">
        <Link href="/showcase">
          <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Showcase
          </Button>
        </Link>

        <ParallaxTiltCard className="glass-card border-primary/30 overflow-hidden prompt-page-card">
          <div className={`relative bg-[oklch(0.16_0.014_55)] ${cover ? "h-40 md:h-48" : "h-24"}`}>
            {cover ? (
              <Image src={cover} alt={submission.title} fill className="object-cover" style={{ objectPosition: bannerPosition }} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="term-kicker">no banner image</span>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <div className="term-chip">
                <span>{submission.edition_year && submission.edition_year < DAPPTOBER_YEAR ? submission.edition_year : "DAY"}</span>
                <span className="text-sm tracking-normal">{String(submission.day).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <h1 className="text-3xl font-bold gradient-text">{submission.title}</h1>
            <p className="text-sm text-copper-dim">
              by{" "}
              <Link href={`/profile/${submission.wallet_address}`} className="text-copper-bright hover:underline">
                {author}
              </Link>
            </p>
            <p className="text-white leading-relaxed">{submission.description}</p>
            <div className="flex flex-wrap gap-3">
              {submission.demo_url ? (
                <Link href={submission.demo_url} target="_blank" rel="noopener noreferrer">
                  <Button className="term-btn h-10 gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </Button>
                </Link>
              ) : null}
              {submission.github_url ? (
                <Link href={submission.github_url} target="_blank" rel="noopener noreferrer">
                  <Button className="term-btn h-10 gap-2">
                    <Github className="w-4 h-4" />
                    Code
                  </Button>
                </Link>
              ) : null}
            </div>
            <LikeButton target={target} initialLikes={likesCount ?? 0} initialIsLiked={false} label="Like this build" />
          </div>
        </ParallaxTiltCard>

        <SubmissionEditor
          submissionId={submission.id}
          ownerWallet={submission.wallet_address}
          title={submission.title}
          description={submission.description}
          demoUrl={submission.demo_url}
          githubUrl={submission.github_url}
          imageUrl={submission.image_url}
          bannerPosition={submission.banner_position}
        />

        {submission.demo_url ? <AgentDemoFrame url={submission.demo_url} title={`${submission.title} demo`} /> : null}

        <div id="comments-section">
          <PromptCommentsCard commentCount={comments.length}>
            <CommentsSection target={target} initialComments={comments} />
          </PromptCommentsCard>
        </div>
      </div>
    </div>
  )
}
