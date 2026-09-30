import { ISO_CUBE, renderAscii } from "@/lib/ascii"

interface AsciiLogoProps {
  word: string
  ornament?: boolean
}

export function AsciiLogo({ word, ornament = false }: AsciiLogoProps) {
  const art = renderAscii(word)

  return (
    <div className={`ascii-lockup ${ornament ? "ascii-lockup-ornament" : ""}`}>
      {ornament ? (
        <pre className="ascii-cube" aria-hidden="true">
          {ISO_CUBE}
        </pre>
      ) : null}
      <div className="ascii-stage">
        <pre className="ascii-shadow" aria-hidden="true">
          {art}
        </pre>
        <pre className="ascii-face">{art}</pre>
      </div>
    </div>
  )
}
