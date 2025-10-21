import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { getProfile, getProfileSubmissions } from "@/app/actions/profiles"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileSubmissions } from "@/components/profile/profile-submissions"
import { createClient } from "@/lib/supabase/server"

interface ProfilePageProps {
  params: {
    address: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { address } = params

  // Validate address format
  if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
    notFound()
  }

  const profileResult = await getProfile(address)

  if (!profileResult.success || !profileResult.profile) {
    notFound()
  }

  const profile = profileResult.profile
  const submissionsResult = await getProfileSubmissions(address)
  const submissions = submissionsResult.success ? submissionsResult.submissions : []

  const supabase = await createClient()

  // Get comments count
  const { count: commentsCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("wallet_address", address.toLowerCase())

  // Get likes count
  const { count: likesCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("wallet_address", address.toLowerCase())

  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-8">
          <ProfileHeader profile={profile} />

          <ProfileStats
            submissionsCount={submissions?.length || 0}
            commentsCount={commentsCount || 0}
            likesCount={likesCount || 0}
          />

          <Card className="glass-card border-primary/30 p-6 space-y-6">
            <h2 className="text-2xl font-bold gradient-text">Submitted DApps</h2>
            <ProfileSubmissions submissions={submissions || []} />
          </Card>
        </div>
      </div>
    </div>
  )
}
