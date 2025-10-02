import { notFound } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { getProfileByWallet, getUserSubmissions, getUserCommentCount } from "@/lib/supabase/profile"
import { createClient } from "@/lib/supabase/server"
import { Calendar, ExternalLink, Github, Twitter, Globe } from "lucide-react"
import Link from "next/link"

interface ProfilePageProps {
  params: {
    wallet: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { wallet } = params

  const profileResult = await getProfileByWallet(wallet)

  if (!profileResult.success || !profileResult.profile) {
    notFound()
  }

  const profile = profileResult.profile

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isOwnProfile = user?.id === profile.id

  const submissionsResult = await getUserSubmissions(profile.id)
  const submissions = submissionsResult.success ? submissionsResult.submissions : []

  const commentCountResult = await getUserCommentCount(profile.id)
  const commentCount = commentCountResult.success ? commentCountResult.count : 0

  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card className="glass-card border-primary/30 p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/50 neon-glow-orange flex-shrink-0">
                <Image
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.id}`}
                  alt={profile.display_name || "User avatar"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold gradient-text-main">{profile.display_name || "Anonymous User"}</h1>
                  <p className="text-sm text-muted-foreground font-mono">{profile.wallet_address}</p>
                  {profile.bio && <p className="text-base text-foreground leading-relaxed">{profile.bio}</p>}
                </div>

                {/* Social Links */}
                {(profile.twitter_handle || profile.github_handle || profile.website_url) && (
                  <div className="flex flex-wrap gap-3">
                    {profile.twitter_handle && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-card border-primary/30 hover:border-primary/50 bg-transparent"
                        asChild
                      >
                        <a
                          href={`https://twitter.com/${profile.twitter_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {profile.github_handle && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-card border-primary/30 hover:border-primary/50 bg-transparent"
                        asChild
                      >
                        <a
                          href={`https://github.com/${profile.github_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {profile.website_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-card border-primary/30 hover:border-primary/50 bg-transparent"
                        asChild
                      >
                        <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-6 pt-4 border-t border-primary/20">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold gradient-text">{submissions.length}</p>
                    <p className="text-sm text-muted-foreground">Submissions</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold gradient-text">{commentCount}</p>
                    <p className="text-sm text-muted-foreground">Comments</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold gradient-text">
                      {new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                    <p className="text-sm text-muted-foreground">Joined</p>
                  </div>
                </div>

                {isOwnProfile && (
                  <Button className="neon-glow-orange bg-primary/80 hover:bg-primary border border-primary/50" asChild>
                    <Link href="/profile/edit">Edit Profile</Link>
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Submissions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold gradient-text">Submitted DApps</h2>
              {isOwnProfile && submissions.length < 31 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-card border-primary/30 hover:border-primary/50 bg-transparent"
                  asChild
                >
                  <Link href="/submit">Submit DApp</Link>
                </Button>
              )}
            </div>

            {submissions.length === 0 ? (
              <Card className="glass-card border-primary/30 p-12 text-center">
                <p className="text-muted-foreground">No submissions yet.</p>
                {isOwnProfile && (
                  <Button
                    className="mt-4 neon-glow-orange bg-primary/80 hover:bg-primary border border-primary/50"
                    asChild
                  >
                    <Link href="/submit">Submit Your First DApp</Link>
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((submission) => (
                  <Card
                    key={submission.id}
                    className="glass-card border-primary/30 hover:border-primary/50 transition-all overflow-hidden group"
                  >
                    <Link href={`/dapp/${submission.day}`}>
                      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10">
                        {submission.image_url && (
                          <Image
                            src={submission.image_url || "/placeholder.svg"}
                            alt={submission.title}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full glass-card border-primary/50 neon-glow-orange">
                            <span className="text-xs font-bold gradient-text">{submission.day}</span>
                          </div>
                        </div>
                        {submission.status === "pending" && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">Pending</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <h3 className="font-bold text-lg gradient-text line-clamp-1">{submission.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{submission.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {submission.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-primary/20">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                          {submission.demo_url && (
                            <div className="flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              Demo
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
