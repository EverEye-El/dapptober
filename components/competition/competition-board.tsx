import Link from "next/link"
import { PageHero } from "@/components/terminal/page-hero"
import { ParallaxTiltCard } from "@/components/terminal/parallax-tilt-card"
import { CompetitionRegister } from "@/components/competition/competition-register"
import { FinalizePanel } from "@/components/competition/finalize-panel"
import { PotDisplay } from "@/components/competition/pot-display"
import { VoteButton } from "@/components/competition/vote-button"
import { competitionPhase, VOTE_WINDOW_LABEL, WINNER_ANNOUNCEMENT_LABEL } from "@/lib/competition/window"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"
import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"

export async function CompetitionBoard() {
  const phase = competitionPhase()
  let entries: {
    id: string
    onchain_entry_id: number | null
    name: string
    description: string
    image_url: string | null
    wallet_address: string
    day: number | null
    votes: number
  }[] = []

  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data } = await supabase
      .from("competition_entries")
      .select("id, onchain_entry_id, name, description, image_url, wallet_address, day")
      .eq("status", "registered")
      .order("created_at", { ascending: false })

    entries = await Promise.all(
      (data ?? []).map(async (entry) => {
        const { count } = await supabase
          .from("competition_votes")
          .select("*", { count: "exact", head: true })
          .eq("entry_id", entry.id)
        return { ...entry, votes: count ?? 0 }
      }),
    )
  }

  return (
    <div id="votes" className="scroll-mt-16">
      <PageHero kicker={`ls ./competition --year=${DAPPTOBER_YEAR}`} word="VOTE">
        <p className="text-sm md:text-base text-copper-dim text-balance">
          Optional 5 USDC agent entry. Likes on prompts and the showcase do not count. Voting is open{" "}
          {VOTE_WINDOW_LABEL}. The winner is announced by {WINNER_ANNOUNCEMENT_LABEL}. Pot: <PotDisplay />. That
          figure stays at $100 until the escrow holds more.
        </p>
        <p className="text-xs tracking-[0.14em] uppercase text-copper-bright">Phase: {phase}</p>
      </PageHero>

      <section className="container mx-auto px-4 lg:px-8 py-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          {entries.length === 0 ? (
            <p className="text-copper-dim">No paid entries yet.</p>
          ) : (
            entries.map((entry) => (
              <ParallaxTiltCard key={entry.id} className="glass-card border-primary/30 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  {entry.day ? (
                    <div className="term-chip">
                      <span>DAY</span>
                      <span className="text-sm tracking-normal">{String(entry.day).padStart(2, "0")}</span>
                    </div>
                  ) : null}
                  <Link href={`/competition/${entry.id}`} className="text-lg font-bold text-copper-bright">
                    {entry.name}
                  </Link>
                </div>
                <p className="text-sm text-white line-clamp-2">{entry.description}</p>
                {entry.onchain_entry_id !== null ? (
                  <VoteButton entryId={entry.id} onchainEntryId={entry.onchain_entry_id} voteCount={entry.votes} />
                ) : null}
              </ParallaxTiltCard>
            ))
          )}
        </div>
        <ParallaxTiltCard className="glass-card border-primary/30 p-4 h-fit">
          <h2 className="text-lg font-bold gradient-text mb-4">Enter an agent</h2>
          <CompetitionRegister />
        </ParallaxTiltCard>
      </section>
      <FinalizePanel
        entries={entries.flatMap((entry) =>
          entry.onchain_entry_id === null
            ? []
            : [{ onchainEntryId: entry.onchain_entry_id, name: entry.name, votes: entry.votes }],
        )}
      />
    </div>
  )
}
