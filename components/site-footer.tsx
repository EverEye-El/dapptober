import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"

export function SiteFooter() {
  return (
    <footer className="mt-12 relative z-10 border-t border-copper/30">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-copper-dim">
          <p>
            // eof · dapptober {DAPPTOBER_YEAR} · next.js 16 · shadcn/ui · thirdweb
          </p>
          <p className="text-copper">sys.online</p>
        </div>
      </div>
    </footer>
  )
}
