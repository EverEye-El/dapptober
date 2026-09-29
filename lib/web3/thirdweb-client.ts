import { createThirdwebClient } from "thirdweb"

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id",
  config: {
    appMetadata: {
      name: "Dapptober",
      description: "Dapptober 2026: 31 Days of AI Agents x Crypto",
      url: typeof window !== "undefined" ? window.location.origin : "https://dapptober.com",
      logoUrl: typeof window !== "undefined" ? `${window.location.origin}/logo.png` : "https://dapptober.com/logo.png",
    },
  },
})
