import { createThirdwebClient } from "thirdweb"

/**
 * Server-side thirdweb client for auth and backend operations
 * Uses secret key instead of client ID for enhanced security
 */
export const serverClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
})
