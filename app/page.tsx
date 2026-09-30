import { DappCard } from "@/components/dapp-card"
import { DAPPTOBER_YEAR, dappPrompts } from "@/lib/dapp-prompts"
import { Sidebar } from "@/components/sidebar"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/terminal/page-hero"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <main>
        <PageHero kicker={`boot --year=${DAPPTOBER_YEAR}`} word={`DAPPTOBER ${DAPPTOBER_YEAR}`}>
          <p className="text-sm tracking-[0.18em] uppercase text-copper-bright">
            31 days of AI agents x crypto
          </p>
          <p className="text-sm text-copper-dim text-balance">
            Prompts for agents that hold wallets, pay each other, earn reputation, and act onchain, plus the guardrails
            that keep them honest.
          </p>
          <p className="text-[11px] tracking-[0.16em] uppercase text-copper-dim">
            status armed · theme agents · prompts 31 · link up
          </p>
        </PageHero>

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
