import { createThirdwebClient } from "thirdweb"

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id",
  config: {
    appMetadata: {
      name: "Dapptober",
      description: "31 Days of Vibe-Coded Web3",
      url: typeof window !== "undefined" ? window.location.origin : "https://dapptober.com",
      logoUrl: typeof window !== "undefined" ? `${window.location.origin}/logo.png` : "https://dapptober.com/logo.png",
    },
  },
})
