import { Sidebar } from "@/components/sidebar"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { Calendar, Bot, Users, ShieldCheck, Trophy, Rocket, Wallet } from "lucide-react"
import Link from "next/link"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"

export default function AboutPage() {
  const features = [
    {
      icon: Calendar,
      title: "31 Days of Building",
      description: `One prompt for every day of October ${DAPPTOBER_YEAR}. Pick one, remix one, or ship all 31.`,
    },
    {
      icon: Bot,
      title: "Agent-Native Prompts",
      description:
        "This year every prompt puts AI agents onchain: wallets, payments, identity, reputation, and markets.",
    },
    {
      icon: ShieldCheck,
      title: "Guardrails First",
      description:
        "Agents with money need limits. Prompts push spend caps, allowlists, and kill switches enforced by contracts.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Share your builds, get feedback, and fork each other's agents. Humans and bots both welcome.",
    },
  ]

  const achievements = [
    { icon: Trophy, label: "31 Unique Prompts", value: "Daily Challenges" },
    { icon: Wallet, label: "Agents With Wallets", value: "Onchain Autonomy" },
    { icon: Rocket, label: "Community Showcase", value: "Share & Discover" },
  ]

  const stack = [
    { name: "Next.js 14", detail: "The React framework powering this site, with the App Router" },
    { name: "thirdweb", detail: "Wallet connection, smart accounts, and onchain auth" },
    { name: "Supabase", detail: "Postgres database and auth for profiles, likes, and comments" },
    { name: "shadcn/ui", detail: "Accessible, composable UI components" },
    {
      name: "Agent tooling",
      detail: "Prompts point you at MCP, x402, ERC-8004, and agent SDKs so your builds can act onchain",
    },
  ]

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main>
        <header className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text-main mb-4">
              About Dapptober {DAPPTOBER_YEAR}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed text-balance">
              A month-long build-a-thon where developers ship 31 crypto apps powered by AI agents: agents that hold
              wallets, pay for what they use, earn reputation, and answer to the humans who deploy them.
            </p>
          </div>
        </header>

        <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <Card className="glass-card p-8 md:p-12 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Our Mission</h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p className="text-lg">
                <span className="text-neon-orange font-bold">GTFOL!</span> That's right,{" "}
                <span className="text-white font-semibold">Get The F*ck Off Localhost!</span> Dapptober exists to help
                builders stop tinkering and actually ship. In {DAPPTOBER_YEAR} that means shipping agents, not just
                demos.
              </p>
              <p className="text-lg">
                AI agents are becoming real economic actors. They can pay for APIs with stablecoins, hire other agents,
                trade, and govern. That only works if the rails are open, verifiable, and owned by users, which is
                exactly what crypto is good at. This year's prompts sit right at that intersection.
              </p>
              <p className="text-lg">
                We care about building it safely. Every prompt nudges you toward onchain guardrails, transparent logs,
                and human override, so the agents you ship are useful and accountable. Build fast, ship faster, and
                GTFOL! 🚀
              </p>
            </div>
          </Card>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">What Makes Us Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="glass-card p-6 border-primary/20 hover:border-neon-orange/50 transition-all"
              >
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

        <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">By The Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card
                key={achievement.label}
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

        <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <Card className="glass-card p-8 md:p-12 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Built With Modern Tools</h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p className="text-lg">Dapptober runs on a modern stack, and the prompts point you at agent tooling:</p>
              <ul className="space-y-3 text-lg">
                {stack.map((item, index) => (
                  <li key={item.name} className="flex items-start gap-3">
                    <span className={`${index % 2 === 0 ? "text-neon-orange" : "text-neon-purple"} mt-1`}>▸</span>
                    <span>
                      <strong className="text-white">{item.name}</strong> - {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
          <Card className="glass-card p-8 md:p-12 border-primary/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text-main">Join the Journey</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto text-balance">
              Ready to build? Pick a prompt, give your agent a wallet, and share what you ship in the showcase.
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

        <SiteFooter />
      </main>
    </div>
  )
}
