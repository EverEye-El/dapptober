import { isSearchable, normalizeQuery, type SearchHit } from "@/lib/search"

export interface SitePage {
  title: string
  section: "Rules" | "About"
  href: string
  text: string
}

export function searchSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function page(section: SitePage["section"], title: string, text: string, href?: string): SitePage {
  const base = section === "Rules" ? "/rules" : "/about"
  return {
    title,
    section,
    href: href ?? `${base}#${searchSlug(title)}`,
    text,
  }
}

export const sitePages: SitePage[] = [
  page(
    "Rules",
    "Rules",
    "31 days. 31 agents. gtfol. Welcome, builder. There are no prizes. No judges. No safety nets. Just you, your agents, and the chain.",
    "/rules",
  ),
  page(
    "Rules",
    "Rule #1: GTFOL",
    "Get the fuck off localhost. If it ain't deployed, it doesn't exist. Ship at least one real dapp this month. Testnets count, vibes don't.",
  ),
  page(
    "Rules",
    "Rule #2: Put an Agent On-Chain",
    "This year's theme is AI agents x crypto. Give an agent a wallet, a job, an identity, or a market. If a model can read it, sign it, or pay for it, you're on theme.",
  ),
  page(
    "Rules",
    "Rule #3: Choose Your Quest",
    "Each day has a vibe-coded prompt with a brief, key features, and a suggested stack. Use it as a blueprint, remix it, or go full degen and make your own.",
  ),
  page(
    "Rules",
    "Rule #4: Time Is an Illusion (Frens Aren't)",
    "You've got all of October. Missed a day? Catch up later. Ship 1, ship 31, ship chaos. Just ship.",
  ),
  page(
    "Rules",
    "Rule #5: Guardrails Live On-Chain",
    "A system prompt is not a security model. If your agent can move money, enforce spend limits, allowlists, and a kill switch in the contract or smart account. Use testnet funds or tiny amounts while you build.",
  ),
  page(
    "Rules",
    "Rule #6: Show Your Agent's Receipts",
    "Log what your agent decided and why. Transaction previews, signed logs, and attestations turn trust me bro into verify me bro.",
  ),
  page(
    "Rules",
    "Rule #7: Submit Like a Degen",
    "Post your builds, screenshots, or demos. Tag @dapptober. Use the hashtag Dapptober. Submit it in the Showcase with your wallet. Say gm like your agent depends on it.",
  ),
  page(
    "Rules",
    "Rule #8: Community Is the Alpha",
    "Help a fren debug. Fork someone's agent and teach it a new skill. Publish your MCP tools so others can reuse them. Dapptober is the chain that binds us.",
  ),
  page(
    "Rules",
    "Rule #9: No Prizes. Only Glory.",
    "This ain't a hackathon. It's a rite of passage. Winners earn onchain street cred and eternal gm energy. No rug-pull launches, no shilling tokens to strangers.",
  ),
  page(
    "Rules",
    "Rule #10: Want cash? Put up or NGMI!",
    "5 USDC. Agent in. Stack entries until your wallet says no. A pile of agents. One pot. The favorite walks away with the win.",
  ),
  page(
    "Rules",
    "Rule #11: Have Fun or Fork Off",
    "No corporate vibes. No go-to-market. No roadmaps. Just builders, bots, memes, and mainnet dreams.",
  ),
  page(
    "Rules",
    "Bonus Rule: Don't Just Build. Vibe.",
    "Remember, Dapptober isn't about perfection. It's about momentum, memes, and making the chain and its agents a little weirder every day. gm and good luck, builder. Your commit history is your legacy.",
  ),
  page(
    "About",
    "About",
    "A month-long build-a-thon where developers ship 31 crypto apps powered by AI agents: agents that hold wallets, pay for what they use, earn reputation, and answer to the humans who deploy them.",
    "/about",
  ),
  page(
    "About",
    "Our Mission",
    "GTFOL. Get The Fuck Off Localhost. Dapptober exists to help builders stop tinkering and actually ship. AI agents are becoming real economic actors. They can pay for APIs with stablecoins, hire other agents, trade, and govern. Onchain guardrails, transparent logs, and human override.",
  ),
  page(
    "About",
    "31 Days of Building",
    "One prompt for every day of October. Pick one, remix one, or ship all 31.",
  ),
  page(
    "About",
    "Agent-Native Prompts",
    "This year every prompt puts AI agents onchain: wallets, payments, identity, reputation, and markets.",
  ),
  page(
    "About",
    "Guardrails First",
    "Agents with money need limits. Prompts push spend caps, allowlists, and kill switches enforced by contracts.",
  ),
  page(
    "About",
    "Community Driven",
    "Share your builds, get feedback, and fork each other's agents. Humans and bots both welcome.",
  ),
  page("About", "31 Unique Prompts", "Daily Challenges. 31 unique prompts."),
  page("About", "Agents With Wallets", "Onchain Autonomy. Agents with wallets."),
  page("About", "Community Showcase", "Share and discover. Community showcase."),
  page(
    "About",
    "Built With Modern Tools",
    "Next.js 14 App Router. thirdweb wallet connection, smart accounts, and onchain auth. Supabase Postgres for profiles, likes, and comments. shadcn/ui. Agent tooling: MCP, x402, ERC-8004.",
  ),
  page(
    "About",
    "Join the Journey",
    "Ready to build? Pick a prompt, give your agent a wallet, and share what you ship in the showcase.",
  ),
]

export function searchPages(raw: string): SearchHit[] {
  const query = normalizeQuery(raw).toLowerCase()
  if (!isSearchable(raw) || /^\d{1,2}$/.test(query) || /^0x/i.test(query)) return []

  return sitePages
    .map((entry) => {
      const title = entry.title.toLowerCase()
      const text = entry.text.toLowerCase()
      let score = 0
      if (title === query) score += 100
      else if (title.includes(query)) score += 60
      if (text.includes(query)) score += 30
      return { score, entry }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 6)
    .map(({ entry }) => ({
      id: `page-${entry.href}`,
      kind: "page" as const,
      title: entry.title,
      detail: entry.section,
      href: entry.href,
    }))
}
