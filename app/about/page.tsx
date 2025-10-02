import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Calendar, Code2, Users, Zap, Trophy, Rocket } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      icon: Calendar,
      title: "31 Days of Building",
      description: "A month-long journey through Web3 development, one dApp at a time.",
    },
    {
      icon: Code2,
      title: "Vibe-Coded",
      description: "Built with the latest tools: Next.js 15, ThirdWeb, and modern Web3 stack.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Share your creations, get feedback, and learn from fellow builders.",
    },
    {
      icon: Zap,
      title: "Rapid Prototyping",
      description: "Turn ideas into working dApps quickly with AI-assisted development.",
    },
  ]

  const achievements = [
    { icon: Trophy, label: "31 Unique Prompts", value: "Daily Challenges" },
    { icon: Rocket, label: "Community Showcase", value: "Share & Discover" },
    { icon: Users, label: "Web3 Builders", value: "Growing Community" },
  ]

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main>
        {/* Hero Section */}
        <header className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text-main mb-4">About Dapptober</h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed text-balance">
              A month-long celebration of Web3 creativity, where developers build 31 decentralized applications using
              AI-assisted development and modern blockchain tools.
            </p>
          </div>
        </header>

        {/* Mission Section */}
        <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <Card className="glass-card p-8 md:p-12 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Our Mission</h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p className="text-lg">
                <span className="text-neon-orange font-bold">GTFOL!</span> That's right —{" "}
                <span className="text-white font-semibold">Get The F*ck Off Localhost!</span> Dapptober was created to
                help Web3 devs stop tinkering in their local environments and actually ship their dApps to the world.
                We're here to democratize Web3 development and make blockchain technology accessible to everyone, not
                just the ones who've been stuck on localhost for months.
              </p>
              <p className="text-lg">
                We believe that the future of the internet is decentralized, and we're here to help builders of all
                skill levels participate in that future. No more "just one more feature" syndrome — it's time to deploy,
                iterate, and let the community vibe with your creations.
              </p>
              <p className="text-lg">
                By combining AI-assisted development with daily creative prompts, we're lowering the barrier to entry
                for Web3 development while maintaining the quality and innovation that makes this space exciting. Build
                fast, ship faster, and GTFOL! 🚀
              </p>
            </div>
          </Card>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">What Makes Us Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card p-6 border-primary/20 hover:border-neon-orange/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-orange">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">By The Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="glass-card p-8 border-primary/20 text-center hover:border-neon-orange/50 transition-all"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-orange">
                    <achievement.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 gradient-text-main">{achievement.value}</h3>
                <p className="text-white/70">{achievement.label}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <Card className="glass-card p-8 md:p-12 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Built With Modern Tools</h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p className="text-lg">
                Dapptober leverages cutting-edge technology to provide the best development experience:
              </p>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-neon-orange mt-1">▸</span>
                  <span>
                    <strong className="text-white">Next.js 15</strong> - The React framework for production with App
                    Router
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-purple mt-1">▸</span>
                  <span>
                    <strong className="text-white">ThirdWeb</strong> - Comprehensive Web3 development platform
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-orange mt-1">▸</span>
                  <span>
                    <strong className="text-white">shadcn/ui</strong> - Beautiful, accessible component library
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-purple mt-1">▸</span>
                  <span>
                    <strong className="text-white">Supabase</strong> - Open source Firebase alternative for database and
                    auth
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon-orange mt-1">▸</span>
                  <span>
                    <strong className="text-white">AI-Assisted Development</strong> - Powered by v0 for rapid
                    prototyping
                  </span>
                </li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <Card className="glass-card p-8 md:p-12 border-primary/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text-main">Join the Journey</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto text-balance">
              Ready to start building? Explore our daily prompts, share your creations in the showcase, and connect with
              fellow Web3 builders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-orange text-white font-semibold hover:opacity-90 transition-opacity"
              >
                View Prompts
              </Link>
              <Link
                href="/showcase"
                className="px-8 py-3 rounded-lg border border-neon-orange/50 text-white font-semibold hover:bg-neon-orange/10 transition-colors"
              >
                Explore Showcase
              </Link>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="glass-card border-t border-primary/20 mt-12 relative z-10">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">Built with Next.js 15, shadcn/ui, and ThirdWeb</p>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
                <span className="text-sm font-medium">Thirdweb</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
