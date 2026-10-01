import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { SiteFooter } from "@/components/site-footer"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"
import { RulesList } from "@/components/rules/rules-list"
import { PageHero } from "@/components/terminal/page-hero"

interface Rule {
  emoji: string
  title: string
  body: ReactNode
}

const rules: Rule[] = [
  {
    emoji: "🧱",
    title: "Rule #1: GTFOL",
    body: (
      <>
        <p className="text-lg font-semibold text-white/90 mb-2">"Get the f*ck off localhost!"</p>
        <p className="text-white/70">
          If it ain't deployed, it doesn't exist. Ship <strong>at least one real dapp</strong> this month. Testnets
          count, vibes don't.
        </p>
      </>
    ),
  },
  {
    emoji: "🤖",
    title: "Rule #2: Put an Agent On-Chain",
    body: (
      <>
        <p className="text-white/70 mb-2">This year's theme is AI agents x crypto.</p>
        <p className="text-white/70">
          Give an agent a wallet, a job, an identity, or a market. If a model can read it, sign it, or pay for it,
          you're on theme.
        </p>
      </>
    ),
  },
  {
    emoji: "🕸️",
    title: "Rule #3: Choose Your Quest",
    body: (
      <p className="text-white/70">
        Each day has a <strong>vibe-coded prompt</strong> with a brief, key features, and a suggested stack. Use it as
        a blueprint, remix it, or go full degen and make your own.
      </p>
    ),
  },
  {
    emoji: "⏳",
    title: "Rule #4: Time Is an Illusion (Frens Aren't)",
    body: (
      <>
        <p className="text-white/70 mb-2">
          You've got <strong>all of October {DAPPTOBER_YEAR}</strong>.
        </p>
        <p className="text-white/70">Missed a day? Catch up later. Ship 1, ship 31, ship chaos. Just ship.</p>
      </>
    ),
  },
  {
    emoji: "🛡️",
    title: "Rule #5: Guardrails Live On-Chain",
    body: (
      <>
        <p className="text-white/70 mb-2">A system prompt is not a security model.</p>
        <p className="text-white/70">
          If your agent can move money, enforce spend limits, allowlists, and a kill switch in the contract or smart
          account. Use testnet funds or tiny amounts while you build.
        </p>
      </>
    ),
  },
  {
    emoji: "🧾",
    title: "Rule #6: Show Your Agent's Receipts",
    body: (
      <p className="text-white/70">
        Log what your agent decided and why. Transaction previews, signed logs, and attestations turn "trust me bro"
        into "verify me bro".
      </p>
    ),
  },
  {
    emoji: "📡",
    title: "Rule #7: Submit Like a Degen",
    body: (
      <>
        <p className="text-white/70 mb-3">Post your builds, screenshots, or demos:</p>
        <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
          <li>
            Tag{" "}
            <a
              href="https://x.com/dapptober"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline"
            >
              @dapptober
            </a>
          </li>
          <li>
            Use the hashtag <strong>#Dapptober{DAPPTOBER_YEAR}</strong>
          </li>
          <li>Submit it in the Showcase with your wallet</li>
          <li>Say "gm" like your agent depends on it</li>
        </ul>
      </>
    ),
  },
  {
    emoji: "🦾",
    title: "Rule #8: Community Is the Alpha",
    body: (
      <>
        <p className="text-white/70 mb-2">
          Help a fren debug. Fork someone's agent and teach it a new skill. Publish your MCP tools so others can reuse
          them.
        </p>
        <p className="text-white/70">
          <strong>Dapptober is the chain that binds us.</strong>
        </p>
      </>
    ),
  },
  {
    emoji: "💀",
    title: "Rule #9: No Prizes. Only Glory.",
    body: (
      <>
        <p className="text-white/70 mb-2">This ain't a hackathon. It's a rite of passage.</p>
        <p className="text-white/70">
          Winners earn <strong>onchain street cred</strong> and eternal gm energy. No rug-pull launches, no shilling
          tokens to strangers.
        </p>
      </>
    ),
  },
  {
    emoji: "🧃",
    title: "Rule #10: Have Fun or Fork Off",
    body: (
      <>
        <p className="text-white/70 mb-2">No corporate vibes. No "go-to-market." No roadmaps.</p>
        <p className="text-white/70">Just builders, bots, memes, and mainnet dreams.</p>
      </>
    ),
  },
]

export default function RulesPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <main>
        <PageHero kicker={`man dapptober --section=rules`} word="RULES">
          <p className="text-base md:text-lg tracking-[0.12em] uppercase text-copper-bright">
            31 days. 31 agents. gtfol.
          </p>
          <p className="text-sm md:text-base text-copper-dim text-balance">
            Welcome, builder. You&apos;ve entered Dapptober {DAPPTOBER_YEAR}: 31 days of AI agents, onchain chaos,
            creativity, and glory. There are no prizes. No judges. No safety nets. Just you, your agents, and the chain.
          </p>
        </PageHero>

        <section className="container mx-auto px-4 lg:px-8 py-6 relative z-10 max-w-4xl">
          <RulesList rules={rules} />
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
