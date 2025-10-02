import { DappCard } from "@/components/dapp-card"
import { dappPrompts } from "@/lib/dapp-prompts"
import { Sidebar } from "@/components/sidebar"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <main>
        <header className="container mx-auto px-4 lg:px-8 py-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text-main mb-2">DAPPTOBER</h1>
            <p className="text-sm text-white/70">Vibe-Coded Web3</p>
          </div>
        </header>

        <section id="prompts" className="container mx-auto px-4 lg:px-8 py-6 relative z-10">
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
      </main>
    </div>
  )
}
