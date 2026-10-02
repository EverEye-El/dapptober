<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- Keep typewriter behavior cohesive site-wide: start when a section scrolls into view, replay when re-entering the viewport, and idle-repeat (~60s default via `idleRepeatMs`) while the section stays visible on most pages.
- Home prompt grid (`DappCard`): observe the title line, not the whole card; use `startDelay={Math.min(day * 35, 800)}`; set `idleRepeatMs={0}` so the grid does not idle-loop.
- Do not use aggressive early card intersection (e.g. card-level `observeRef` with large positive bottom `rootMargin` ~22%) — user reverted that as typing started too early and replayed while scrolling up.
- Do not run parallel or repeated `vercel whoami` / `vercel login` from the agent — it spams OAuth device codes; prefer one pull in the user's terminal or `vercel env pull` with `VERCEL_TOKEN` and `--token`.
- Avoid Vercel CLI login/auth flows from agent shells unless the user explicitly asks and supplies a token-based approach.
- Keep community comments unlimited on showcase builds and competition agent pages — do not cap them at one per wallet. Regular builds have a like; competition agents are flagged and have both a like and a vote. Likes and competition votes stay separate actions.
- Style the Thirdweb sign-in modal to match the hyper-tech copper terminal UI.
- Logged-out visitors should not see a wallet profile; show a login CTA instead. On a profile, the display name comes first and the wallet address is secondary. In the sidebar, the profile icon sits in the nav directly above the trophy. The wallet icon stays above the divider.
- When adding JEV to daily prompts, keep the existing prompt copy. Treat JEV as optional unless that day needs it as a core feature.
- Showcase leads with the current edition. Prior-year entries (for example Seedpunk) belong in an archive toggle.
- Showcase and the paid votes board share one page: the top is a horizontal scroller of the latest builds, and the competition layout (VOTE title, pot, phase, entry list, side enter card) sits underneath. The nav showcase icon is the trophy, and `/competition` redirects to `/showcase#votes`.
- Competition entry pages should embed the submitted agent, not only link out. Demo uploads need a custom image so cards do not repeat one default.

## Learned Workspace Facts

- `.env.local` is gitignored and is not restored by `git pull` or cloud-agent commits; sync local dev env with `vercel env pull .env.local` (development) or keys from Supabase/Vercel dashboards.
- Hosted secrets for this app live on Vercel (project `v0-dapptober-showcase-app`, team `evereyeels-projects`); the repo may have `.vercel/project.json` after linking.
- Dapp prompt pages can render static prompt content without Supabase; likes, comments, and wallet-backed flows need `NEXT_PUBLIC_SUPABASE_*` (and related server keys) in `.env.local`.
- Optional Supabase configuration is centralized in `lib/supabase/env.ts` (`getSupabasePublicEnv`, `isSupabaseConfigured`).
- Terminal typewriter UI is implemented in `components/terminal/typewriter-text.tsx` (scroll/idle props include `viewThreshold`, `viewRootMargin`, `observeRef`, `idleRepeatMs`).
- Dapptober has a free primary prompt track and an optional paid agent competition: 5 USDC per entry (1 USDC to the creator wallet, 4 USDC to escrow). Vote window is October 1–November 5, 2026; the winner is announced by November 10.
- Showcase current vs archive uses `submissions.edition_year` compared with `DAPPTOBER_YEAR` in `lib/dapp-prompts.ts` (2026).
- Wallet profiles live at `/profile/[address]`.
- Page-hero ASCII wordmarks come from the glyph map in `lib/ascii.ts`; a missing letter renders as a blank.
- Do not track `.cursor/hooks/state` continual-learning files in git; they are local hook state.
