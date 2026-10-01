const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i

/** True when the URL is a file a browser can paint, not a social post or HTML page. */
export function isDisplayableImageUrl(url: string | null | undefined): url is string {
  if (!url) return false
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false
    const host = parsed.hostname.replace(/^www\./, "")
    if (host === "x.com" || host === "twitter.com" || host.endsWith(".x.com")) return false
    if (/\/status\/|\/photo\//i.test(parsed.pathname)) return false
    return IMAGE_EXT.test(parsed.pathname) || host.endsWith(".supabase.co")
  } catch {
    return false
  }
}
