import { DappCard } from "@/components/dapp-card"
import { DAPPTOBER_YEAR, dappPrompts } from "@/lib/dapp-prompts"
import { Sidebar } from "@/components/sidebar"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <main>
        <header className="container mx-auto px-4 lg:px-8 py-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text-main mb-2">
              DAPPTOBER {DAPPTOBER_YEAR}
            </h1>
            <p className="text-sm text-white">31 Days of AI Agents x Crypto</p>
            <p className="text-xs text-white/70 mt-2 max-w-2xl mx-auto text-balance">
              This year's prompts are about agents that hold wallets, pay each other, earn reputation, and act onchain,
              plus the guardrails that keep them honest.
            </p>
          </div>
        </header>

        <section id="prompts" className="container mx-auto px-4 lg:px-8 py-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dappPrompts.map((dapp) => (
              <DappCard key={dapp.day} dapp={dapp} />
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
