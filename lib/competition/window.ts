/** Oct 1 2026 00:00 US Eastern (EDT, UTC-4). */
export const VOTE_OPENS_MS = Date.parse("2026-10-01T04:00:00.000Z")

/** Nov 6 2026 00:00 US Eastern (EST, UTC-5). Voting includes all of November 5. */
export const VOTE_CLOSES_MS = Date.parse("2026-11-06T05:00:00.000Z")

export const VOTE_WINDOW_LABEL = "October 1 through November 5, US Eastern"
export const WINNER_ANNOUNCEMENT_LABEL = "November 10"

export const POT_DISPLAY_FLOOR_USDC = 100

export function competitionPhase(now = Date.now()): "registration" | "voting" | "closed" {
  if (now < VOTE_OPENS_MS) return "registration"
  if (now < VOTE_CLOSES_MS) return "voting"
  return "closed"
}

export function displayedPot(onChainUsdc: number): number {
  return Math.max(POT_DISPLAY_FLOOR_USDC, onChainUsdc)
}
