import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"

export function SiteFooter() {
  return (
    <footer className="glass-card border-t border-primary/20 mt-12 relative z-10">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Dapptober {DAPPTOBER_YEAR} · Built with Next.js 14, shadcn/ui, and thirdweb
          </p>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
            <span className="text-sm font-medium">thirdweb</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
