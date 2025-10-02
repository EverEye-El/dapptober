import { dappPrompts } from "@/lib/dapp-prompts"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, ArrowLeft, Eye, Users } from "lucide-react"
import Link from "next/link"

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

export default function DappPage({ params }: DappPageProps) {
  const dapp = dappPrompts.find((d) => d.day === Number.parseInt(params.day))

  if (!dapp) {
    notFound()
  }

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
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-end p-6">
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
                <Button
                  size="lg"
                  className="flex-1 neon-glow-orange bg-primary/80 hover:bg-primary border border-primary/50 font-semibold"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Like This DApp
                </Button>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{Math.floor(Math.random() * 1000) + 100}</div>
                  <div className="text-xs text-muted-foreground">likes</div>
                </div>
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
                  <div className="text-2xl font-bold text-accent">{Math.floor(Math.random() * 50) + 10}</div>
                  <div className="text-xs text-muted-foreground">Comments</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-accent">{Math.floor(Math.random() * 200) + 50}</div>
                  <div className="text-xs text-muted-foreground">Shares</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-accent">{Math.floor(Math.random() * 30) + 5}</div>
                  <div className="text-xs text-muted-foreground">Contributors</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-accent">#{Math.floor(Math.random() * 31) + 1}</div>
                  <div className="text-xs text-muted-foreground">Rank</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Comments Section */}
          <Card className="glass-card border-primary/30 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold gradient-text flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Community Discussion
              </h3>
              <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 50) + 10} comments</span>
            </div>

            {/* Comment Input */}
            <div className="space-y-3">
              <textarea
                placeholder="Share your thoughts about this DApp... (Connect wallet to comment)"
                className="w-full min-h-[100px] p-4 rounded-lg glass-card border border-primary/30 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-orange resize-none"
              />
              <div className="flex justify-end">
                <Button className="neon-glow-orange bg-primary/80 hover:bg-primary border border-primary/50 font-semibold">
                  Post Comment
                </Button>
              </div>
            </div>

            {/* Sample Comments */}
            <div className="space-y-4 pt-4 border-t border-primary/20">
              {[
                {
                  author: "CryptoEnthusiast",
                  time: "2 hours ago",
                  comment:
                    "This is exactly what the Web3 space needs! The vibe is perfect and the concept is innovative.",
                  likes: 24,
                },
                {
                  author: "BlockchainBuilder",
                  time: "5 hours ago",
                  comment: "Love the aesthetic! Would be great to see this implemented with cross-chain functionality.",
                  likes: 18,
                },
                {
                  author: "DeFiDreamer",
                  time: "1 day ago",
                  comment: "The attention to detail in the design is impressive. Can't wait to try the demo!",
                  likes: 31,
                },
              ].map((comment, index) => (
                <div key={index} className="glass-card border border-primary/20 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                      <div>
                        <div className="font-semibold text-sm">{comment.author}</div>
                        <div className="text-xs text-muted-foreground">{comment.time}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                      <Heart className="w-4 h-4 mr-1" />
                      {comment.likes}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{comment.comment}</p>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center pt-4">
              <Button variant="outline" className="glass-card border-primary/30 hover:border-primary/50 bg-transparent">
                Load More Comments
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
