import { createThirdwebClient } from "thirdweb"

// Create thirdweb client - client ID will be auto-configured
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id",
})
