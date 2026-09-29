import { ShowcaseGrid } from "@/components/showcase/showcase-grid"
import { Sidebar } from "@/components/sidebar"
import { SiteFooter } from "@/components/site-footer"
import { SubmitButton } from "@/components/web3/submit-button"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"

export default function ShowcasePage() {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <main>
        <header className="container mx-auto px-4 lg:px-8 py-8 relative z-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text-main mb-2">
              Community Showcase {DAPPTOBER_YEAR}
            </h1>
            <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto text-balance">
              Agent wallets, x402 paywalls, onchain reputation, prediction markets, and a few haunted contracts. Browse
              what the Dapptober community shipped this October and add your own build.
            </p>
            <div className="pt-2">
              <SubmitButton dappDay={1} variant="button" />
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 lg:px-8 py-6 relative z-10">
          <ShowcaseGrid />
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
