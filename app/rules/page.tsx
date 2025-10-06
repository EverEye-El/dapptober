import { Sidebar } from "@/components/sidebar"

export default function RulesPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <main>
        <header className="container mx-auto px-4 lg:px-8 py-8 relative z-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text-main mb-2">
              🕸️ DAPPTOBER: THE RULES
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium">31 days. 31 vbes. gtfol!</p>
            <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto text-balance mt-4">
              Welcome, builder. You've entered <strong className="text-[#FF6B35]">Dapptober</strong> — 31 days of
              on-chain chaos, creativity, and glory. There are no prizes. No judges. No safety nets. Just you, your
              repo, and the chain. ⚡
            </p>
          </div>
        </header>

        <section className="container mx-auto px-4 lg:px-8 py-6 relative z-10 max-w-4xl">
          <div className="space-y-8">
            {/* Rule #1 */}
            <div className="glass-card p-6 border border-primary/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span>🧱 </span>
                <span className="gradient-text">Rule #1: GTFOL</span>
              </h2>
              <p className="text-lg font-semibold text-white/90 mb-2">"Get the f*ck off localhost!"</p>
              <p className="text-white/70">
                If it ain't deployed, it doesn't exist. You gotta ship <strong>at least one real dapp</strong> this
                month — testnets count, vibes don't.
              </p>
            </div>

            {/* Rule #2 */}
            <div className="glass-card p-6 border border-primary/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span>💡 </span>
                <span className="gradient-text">Rule #2: Vibe {">"} Viability</span>
              </h2>
              <p className="text-white/70 mb-2">Don't overthink it, just build it.</p>
              <p className="text-white/70">
                Ugly UI? Rugged RPC? Broken ABI? Who cares. If it <em>runs</em> and it's <em>on-chain</em>, it's art.
              </p>
            </div>

            {/* Rule #3 */}
            <div className="glass-card p-6 border border-primary/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span>🕸️ </span>
                <span className="gradient-text">Rule #3: Choose Your Quest</span>
              </h2>
              <p className="text-white/70">
                Each day has a <strong>vibe-coded prompt</strong> — use it for inspo or go full degen and make your own.
                There's no wrong path in the multichain.
              </p>
            </div>

            {/* Rule #4 */}
            <div className="glass-card p-6 border border-primary/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span>⏳ </span>
                <span className="gradient-text">Rule #4: Time Is an Illusion (Frens Aren't)</span>
              </h2>
              <p className="text-white/70 mb-2">
                You've got <strong>all of October</strong>.
              </p>
              <p className="text-white/70">
                Missed a day? Catch up later. Ship 1, ship 31, ship chaos — just <em>ship</em>.
              </p>
            </div>

            {/* Rule #5 */}
            <div className="glass-card p-6 border border-primary/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span>💀 </span>
                <span className="gradient-text">Rule #5: No Prizes. Only Glory.</span>
              </h2>
              <p className="text-white/70 mb-2">This ain't a hackathon. It's a rite of passage.</p>
              <p className="text-white/70">
                Winners earn <strong>on-chain street cred</strong> and eternal gm energy.
              </p>
            </div>

            {/* Rule #6 */}
            <div className="glass-card p-6 border border-primary/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span>🧠 </span>
                <span className="gradient-text">Rule #6: Stay On-Chain, Stay Unhinged</span>
              </h2>
              <p className="text-white/70">
                Deploy smart contracts, NFTs, DAOs, vibes — whatever. If it can be hashed, gas it.
              </p>
            </div>

            {/* Rule #7 */}
            <div className="glass-card p-6 border border-primary/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span>📡 </span>
                <span className="gradient-text">Rule #7: Submit Like a Degen</span>
              </h2>
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
                  Use the hashtag <strong>#Dapptober</strong>
                </li>
                <li>Say "gm" like your repo depends on it</li>
              </ul>
              <p className="text-white/70 mt-3 text-sm italic">Soon, you'll be able to upload directly to the site.</p>
            </div>

            {/* Rule #8 */}
            <div className="glass-card p-6 border border-primary/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span>🦾 </span>
                <span className="gradient-text">Rule #8: Community Is the Alpha</span>
              </h2>
              <p className="text-white/70 mb-2">
                Help a fren debug. Retweet a fellow builder. Fork someone's repo and add your own chaos.
              </p>
              <p className="text-white/70">
                <strong>Dapptober is the chain that binds us.</strong>
              </p>
            </div>

            {/* Rule #9 */}
            <div className="glass-card p-6 border border-primary/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span>🏴‍☠️ </span>
                <span className="gradient-text">Rule #9: Stay Deployed or Stay Forgotten</span>
              </h2>
              <p className="text-white/70 mb-2">If your repo sleeps, the chain forgets you.</p>
              <p className="text-white/70">Push code. Deploy again. Repeat.</p>
            </div>

            {/* Rule #10 */}
            <div className="glass-card p-6 border border-primary/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-3">
                <span>🧃 </span>
                <span className="gradient-text">Rule #10: Have Fun or Fork Off</span>
              </h2>
              <p className="text-white/70 mb-2">No corporate vibes. No "go-to-market." No roadmaps.</p>
              <p className="text-white/70">Just builders, memes, and mainnet dreams.</p>
            </div>

            {/* Bonus Rule */}
            <div className="glass-card p-6 border border-primary/30 rounded-xl bg-primary/5">
              <h2 className="text-2xl font-bold mb-3">
                <span>🪩 </span>
                <span className="gradient-text">Bonus Rule: Don't Just Build. Vibe.</span>
              </h2>
              <p className="text-white/70 mb-2">Remember — Dapptober isn't about perfection.</p>
              <p className="text-white/70">
                It's about momentum, memes, and making the chain a little weirder every day.
              </p>
            </div>

            {/* Closing */}
            <div className="text-center py-8">
              <p className="text-lg text-white/90 font-medium mb-2">gm & good luck, builder.</p>
              <p className="text-white/70">Your commit history is your legacy. ⚡</p>
            </div>
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
