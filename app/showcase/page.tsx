import { CompetitionBoard } from "@/components/competition/competition-board"
import { ShowcaseGrid } from "@/components/showcase/showcase-grid"
import { Sidebar } from "@/components/sidebar"
import { SiteFooter } from "@/components/site-footer"
import { SubmitButton } from "@/components/web3/submit-button"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"
import { PageHero } from "@/components/terminal/page-hero"

export default function ShowcasePage() {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <main>
        <PageHero kicker={`ls ./showcase --year=${DAPPTOBER_YEAR}`} word="SHIPPED">
          <p className="text-sm md:text-base text-copper-dim text-balance">
            Agent wallets, x402 paywalls, onchain reputation, prediction markets, and a few haunted contracts. Browse
            what the Dapptober community shipped this October and add your own build.
          </p>
          <div className="pt-3">
            <SubmitButton pickDay variant="button" />
          </div>
        </PageHero>

        <section className="container mx-auto px-4 lg:px-8 py-6 relative z-10">
          <ShowcaseGrid />
        </section>

        <CompetitionBoard />

        <SiteFooter />
      </main>
    </div>
  )
}
