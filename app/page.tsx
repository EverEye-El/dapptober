import { DappCard } from "@/components/dapp-card"
import { dappPrompts } from "@/lib/dapp-prompts"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="glass-card border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight gradient-text">DAPPTOBER</h1>
              <p className="text-sm text-muted-foreground">Showcase for Vibe-Coded Web3 Apps</p>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#prompts" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                Prompts
              </a>
              <a
                href="#submissions"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Submissions
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
            </nav>

            <Button className="bg-primary hover:bg-primary/90 transition-all neon-glow-orange hover:neon-glow-purple">
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      <section id="prompts" className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dappPrompts.map((dapp) => (
            <DappCard key={dapp.day} dapp={dapp} />
          ))}
        </div>
      </section>

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
    </div>
  )
}
