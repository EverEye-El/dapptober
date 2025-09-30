import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThirdwebProvider } from "thirdweb/react"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dapptober - 31 Days of Web3 Apps",
  description: "A showcase of vibe coded web3 applications - one for each day of October",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ThirdwebProvider>{children}</ThirdwebProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
