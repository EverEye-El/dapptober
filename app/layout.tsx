import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThirdwebProvider } from "thirdweb/react"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dapptober 2026 - 31 Days of AI Agents x Crypto",
  description:
    "31 vibe-coded prompts for October 2026: build AI agents that hold wallets, pay each other, and act onchain.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* md:pl-20 reserves room for the fixed collapsed sidebar rail; expanding it overlays content. */}
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} md:pl-20`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ThirdwebProvider>{children}</ThirdwebProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
