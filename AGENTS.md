## Learned User Preferences

- Keep typewriter behavior cohesive site-wide: start when a section scrolls into view, replay when re-entering the viewport, and idle-repeat (~60s default via `idleRepeatMs`) while the section stays visible on most pages.
- Home prompt grid (`DappCard`): observe the title line, not the whole card; use `startDelay={Math.min(day * 35, 800)}`; set `idleRepeatMs={0}` so the grid does not idle-loop.
- Do not use aggressive early card intersection (e.g. card-level `observeRef` with large positive bottom `rootMargin` ~22%) — user reverted that as typing started too early and replayed while scrolling up.
- Do not run parallel or repeated `vercel whoami` / `vercel login` from the agent — it spams OAuth device codes; prefer one pull in the user's terminal or `vercel env pull` with `VERCEL_TOKEN` and `--token`.
- Avoid Vercel CLI login/auth flows from agent shells unless the user explicitly asks and supplies a token-based approach.

## Learned Workspace Facts

- `.env.local` is gitignored and is not restored by `git pull` or cloud-agent commits; sync local dev env with `vercel env pull .env.local` (development) or keys from Supabase/Vercel dashboards.
- Hosted secrets for this app live on Vercel (project `v0-dapptober-showcase-app`, team `evereyeels-projects`); the repo may have `.vercel/project.json` after linking.
- Dapp prompt pages can render static prompt content without Supabase; likes, comments, and wallet-backed flows need `NEXT_PUBLIC_SUPABASE_*` (and related server keys) in `.env.local`.
- Optional Supabase configuration is centralized in `lib/supabase/env.ts` (`getSupabasePublicEnv`, `isSupabaseConfigured`).
- Terminal typewriter UI is implemented in `components/terminal/typewriter-text.tsx` (scroll/idle props include `viewThreshold`, `viewRootMargin`, `observeRef`, `idleRepeatMs`).
