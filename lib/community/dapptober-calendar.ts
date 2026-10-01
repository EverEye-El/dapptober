import { DAPPTOBER_YEAR } from "@/lib/dapp-prompts"

const TZ = "America/New_York"

/** Eastern calendar Y-M-D for `date`. */
function easternYmd(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date)

  const pick = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)
  return { year: pick("year"), month: pick("month"), day: pick("day") }
}

/** Showcase submissions accepted through end of October (Eastern); closed from Nov 1 onward. */
export function isShowcaseSubmitOpen(now = new Date()): boolean {
  const { year, month } = easternYmd(now)
  if (year < DAPPTOBER_YEAR) return false
  if (year > DAPPTOBER_YEAR) return false
  return month === 10
}

/** Prompt day N (1–31) may be submitted on/after Oct N (Eastern), while showcase is open. */
export function isSubmitDayUnlocked(day: number, now = new Date()): boolean {
  if (day < 1 || day > 31) return false
  if (!isShowcaseSubmitOpen(now)) return false

  const { year, month, day: dom } = easternYmd(now)
  if (year !== DAPPTOBER_YEAR || month !== 10) return false
  return dom >= day
}

export function getUnlockedSubmitDays(now = new Date()): number[] {
  const days: number[] = []
  for (let d = 1; d <= 31; d++) {
    if (isSubmitDayUnlocked(d, now)) days.push(d)
  }
  return days
}

export function submitDayValidationError(day: number, now = new Date()): string | null {
  if (!isShowcaseSubmitOpen(now)) {
    return "Showcase submissions are closed for this season."
  }
  if (!isSubmitDayUnlocked(day, now)) {
    return `Day ${day} unlocks on Oct ${day}, ${DAPPTOBER_YEAR} (US Eastern). You can submit for that day on or after it goes live.`
  }
  return null
}
