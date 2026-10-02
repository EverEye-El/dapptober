"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useActiveAccount } from "thirdweb/react"
import { getProfilePage } from "@/app/actions/profiles"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileSubmissions } from "@/components/profile/profile-submissions"
import { ConnectModal } from "@/components/web3/connect-modal"

interface ProfileAccessProps {
  address?: string
}

type ProfilePageData = Awaited<ReturnType<typeof getProfilePage>>

export function ProfileAccess({ address }: ProfileAccessProps) {
  const account = useActiveAccount()
  const router = useRouter()
  const [showConnect, setShowConnect] = useState(false)
  const [data, setData] = useState<Extract<ProfilePageData, { success: true }> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const connected = account?.address.toLowerCase()

  useEffect(() => {
    if (!address && account?.address) {
      router.replace(`/profile/${account.address}`)
    }
  }, [account?.address, address, router])

  useEffect(() => {
    if (!address || !connected) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    getProfilePage(address).then((result) => {
      if (cancelled) return
      if (!result.success) {
        setData(null)
        setError(result.error)
      } else {
        setData(result)
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [address, connected])

  if (!address && connected) {
    return <p className="text-sm text-copper-dim font-mono">Opening your profile…</p>
  }

  if (!connected) {
    return (
      <>
        <ConnectModal isOpen={showConnect} onClose={() => setShowConnect(false)} />
        <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center">
          <Card className="glass-card border-primary/30 p-8 w-full max-w-lg space-y-5">
            <h1 className="text-3xl font-bold gradient-text text-balance">Log in to view your profile</h1>
            <div className="space-y-2 text-copper-dim leading-relaxed">
              <p>Connect your wallet to see your builds, agents, and comments.</p>
              <p>A profile stays with the wallet that owns it.</p>
            </div>
            <button type="button" onClick={() => setShowConnect(true)} className="term-btn flex w-full h-10">
              Connect wallet
            </button>
          </Card>
        </div>
      </>
    )
  }

  if (loading || !data) {
    return <p className="text-sm text-copper-dim font-mono">{error || "Loading profile…"}</p>
  }

  return (
    <div className="space-y-8">
      <ProfileHeader profile={data.profile} />
      <ProfileStats
        submissionsCount={data.submissions.length}
        commentsCount={data.commentsCount}
        likesCount={data.likesCount}
      />

      <Card className="glass-card border-primary/30 p-6 space-y-6">
        <h2 className="text-2xl font-bold gradient-text">Builds</h2>
        <ProfileSubmissions submissions={data.submissions} />
      </Card>

      <Card className="glass-card border-primary/30 p-6 space-y-4">
        <h2 className="text-2xl font-bold gradient-text">Competition agents</h2>
        {data.agents.length === 0 ? (
          <p className="text-sm text-gray-400">No paid agents yet.</p>
        ) : (
          <ul className="space-y-3">
            {data.agents.map((agent) => (
              <li key={agent.id}>
                <Link href={`/competition/${agent.id}`} className="text-copper-bright hover:underline">
                  {agent.name}
                </Link>
                <p className="text-sm text-gray-400 line-clamp-2">{agent.description}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="glass-card border-primary/30 p-6 space-y-4">
        <h2 className="text-2xl font-bold gradient-text">Comments</h2>
        {data.comments.length === 0 ? (
          <p className="text-sm text-gray-400">No comments yet.</p>
        ) : (
          <ul className="space-y-3">
            {data.comments.map((comment) => (
              <li key={comment.id} className="border border-primary/20 p-3">
                <p className="text-sm text-white">{comment.content}</p>
                <Link
                  href={
                    comment.entry_id
                      ? `/competition/${comment.entry_id}`
                      : comment.submission_id
                        ? `/showcase/${comment.submission_id}`
                        : `/dapp/${comment.dapp_day}`
                  }
                  className="text-xs text-copper-bright hover:underline"
                >
                  {comment.entry_id
                    ? "On a competition agent"
                    : comment.submission_id
                      ? "On a showcase build"
                      : `On day ${comment.dapp_day}`}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
