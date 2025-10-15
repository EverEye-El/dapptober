import type { NextRequest } from "next/server"
import { createAuth } from "thirdweb/auth"
import { privateKeyToAccount } from "thirdweb/wallets"
// <CHANGE> Import thirdweb client for auth configuration
import { client } from "@/lib/web3/thirdweb-client"

/**
 * Creates a thirdweb Auth instance with dynamic domain detection.
 * The domain is auto-detected from the request host header, which allows
 * the same code to work across v0.app, Vercel previews, and production.
 */
function getAuthForRequest(req: NextRequest) {
  const domain = req.headers.get("host") || "localhost:3000"

  const privateKey = process.env.THIRDWEB_AUTH_PRIVATE_KEY
  if (!privateKey || privateKey.trim() === "") {
    throw new Error(
      "THIRDWEB_AUTH_PRIVATE_KEY environment variable is required. " + "Please add it to your environment variables.",
    )
  }

  const formattedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`

  // <CHANGE> Added client parameter to createAuth
  return createAuth({
    domain,
    client,
    adminAccount: privateKeyToAccount({ privateKey: formattedKey }),
  })
}

// ... existing code ...
</invoke>

```typescript file="" isHidden
