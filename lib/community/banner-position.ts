export type BannerFocus = { x: number; y: number }

const CENTER: BannerFocus = { x: 50, y: 50 }

function clamp(value: number) {
  if (!Number.isFinite(value)) return 50
  return Math.min(100, Math.max(0, value))
}

export function parseBannerPosition(value: string | null | undefined): BannerFocus {
  const match = value?.trim().match(/^(\d{1,3}(?:\.\d+)?)%\s+(\d{1,3}(?:\.\d+)?)%$/)
  if (!match) return CENTER
  return { x: clamp(Number(match[1])), y: clamp(Number(match[2])) }
}

export function formatBannerPosition(focus: BannerFocus) {
  const round = (value: number) => Math.round(clamp(value) * 10) / 10
  return `${round(focus.x)}% ${round(focus.y)}%`
}
