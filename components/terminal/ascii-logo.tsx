import { renderAscii } from "@/lib/ascii"

interface AsciiLogoProps {
  word: string
}

export function AsciiLogo({ word }: AsciiLogoProps) {
  const art = renderAscii(word)

  return (
    <div className="ascii-lockup">
      <div className="ascii-stage">
        <pre className="ascii-shadow" aria-hidden="true">
          {art}
        </pre>
        <pre className="ascii-face">{art}</pre>
      </div>
    </div>
  )
}
