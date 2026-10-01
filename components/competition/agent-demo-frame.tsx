function demoSrc(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
    return parsed.toString()
  } catch {
    return null
  }
}

export function AgentDemoFrame({ url, title }: { url: string; title: string }) {
  const src = demoSrc(url)
  if (!src) return null

  return (
    <section className="space-y-3">
      <div className="overflow-hidden border border-primary/30 bg-black">
        <iframe
          src={src}
          title={title}
          className="h-[70vh] min-h-[480px] w-full bg-black"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
          referrerPolicy="no-referrer"
          allow="clipboard-read; clipboard-write; fullscreen"
        />
      </div>
      <p className="text-xs text-copper-dim">
        The agent runs in this frame. If it stays blank, that demo blocks embedding.{" "}
        <a href={src} className="text-copper-bright underline" target="_blank" rel="noreferrer">
          Open the demo
        </a>
      </p>
    </section>
  )
}
