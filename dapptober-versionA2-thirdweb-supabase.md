# Dapptober — Thirdweb + Supabase (Version A.2, Dynamic Domain Integrated)

> **What’s new (A.2):** This updates your original Version A guide to *bake in* **dynamic domain detection** for thirdweb Auth. You no longer need to hard‑set `THIRDWEB_AUTH_DOMAIN` per‑environment — the API route derives it from the incoming request host, so **v0.app**, **Vercel previews**, and **production (`dapptober.vercel.app`)** all work with the same code.

It is tailored to **your repo structure**:

```
app/
  api/
    auth/
      wallet/route.ts           # legacy (deprecated)
      [...thirdweb]/route.ts    # (ADD) new SIWE cookie handler (dynamic domain)
    me/route.ts                 # (ADD) current user + profile
  layout.tsx
components/
  web3/
    wallet-connect-button.tsx   # (EDIT) uses thirdweb ConnectButton auth
lib/
  supabase/
    admin.ts                    # (ADD) service-role client
    server.ts                   # (KEEP)
    client.ts                   # (KEEP)
  web3/
    auth.ts                     # (DEPRECATE/optional)
    thirdweb-client.ts          # (KEEP)
```

---

## 0) TL;DR

- **Auth:** Use **thirdweb Auth (SIWE)** → sets a secure HTTP-only cookie.
- **Domain:** **Auto-detected** from `req.headers.get("host")` in API routes (no manual domain switching).
- **DB:** On first/each login, **upsert** into `profiles` by **lowercased** `wallet_address` (service-role).
- **UI:** Replace custom login flow with `ConnectButton` + `auth` handler.
- **Legacy:** Deprecate `POST /api/auth/wallet` route.

---

## 1) Environment Variables (A.2 update: dynamic domain) **IGNORE THIS STEP I WILL MANUALLY ADD ENVIORNMENT VARIABLES**

Create/verify **`.env.local`** and your hosted env vars (v0.app & Vercel). You **must** set only the thirdweb auth private key + your existing thirdweb & Supabase vars. The **domain** is now optional.

```env
# thirdweb — required for SIWE cookie auth (server secret; NOT a wallet key)
THIRDWEB_AUTH_PRIVATE_KEY=0x<random-64-hex>

# thirdweb — public client id (you already have this)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=<your-thirdweb-client-id>

# Supabase (you already use these)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# (Optional) Only if you want to *force* a domain instead of auto-detecting it
# THIRDWEB_AUTH_DOMAIN=dapptober.vercel.app
```

> **Generation tip:**  
> - OpenSSL: `openssl rand -hex 32` → prefix with `0x`  
> - Node: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` → prefix with `0x`  

---

## 2) Dependencies (verify)

You already have:

- `thirdweb` (unified SDK)
- `@supabase/ssr`
- `@supabase/supabase-js`

If any are missing:
```bash
pnpm add thirdweb @supabase/ssr @supabase/supabase-js
# or: npm i thirdweb @supabase/ssr @supabase/supabase-js
```

---

## 3) Folder Map (exact to your repo)

We will add/modify only these paths (matching your tree):

- **Add** `app/api/auth/[...thirdweb]/route.ts`
- **Add** `app/api/me/route.ts`
- **Add** `lib/supabase/admin.ts`
- **Edit** `components/web3/wallet-connect-button.tsx`
- **(Optional)** Edit `app/layout.tsx` if you want a custom provider wrapper (not required)
- **Deprecate** `app/api/auth/wallet/route.ts`
- **(Optional)** Remove/stop using `lib/web3/auth.ts`

---

## 4) Database Schema (expanded; safe/portable SQL)

Your repo already has SQL migration scripts. The following statements **add or align** the minimum required fields for Version A.2 without breaking existing data.

> Run in Supabase SQL editor. Each block is idempotent (uses `if not exists` or guarded updates).

### 4.1 Profiles (wallet-address keyed; last login tracking)
```sql
-- Ensure pgcrypto for UUIDs if you use them elsewhere
create extension if not exists pgcrypto;

-- Create profiles table if missing (adapt if you already have it)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique,        -- unique wallet (lowercased)
  display_name text,
  avatar_url text,
  bio text,
  twitter_handle text,
  github_handle text,
  website_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_login_at timestamptz
);

-- If your profiles table exists but lacks these columns, add them:
alter table public.profiles add column if not exists wallet_address text unique;
alter table public.profiles add column if not exists last_login_at timestamptz;
alter table public.profiles add column if not exists updated_at timestamptz default now();

-- Optional trigger to maintain updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch
before update on public.profiles
for each row execute function public.touch_updated_at();
```

> **RLS:** You can leave RLS disabled for Version A.2 (service-role writes). If you enable RLS later, switch to Supabase-managed sessions (see Appendix).

### 4.2 (Optional) Comments/Likes/Submissions integrity helpers
If needed, ensure FKs point to `profiles` by `id` (or to `auth.users(id)` if you use Supabase Auth elsewhere). The Version A.2 wallet login does **not** require `auth.users` rows.

```sql
-- Example only; adapt to your existing scripts
-- alter table public.comments add column if not exists user_id uuid;
-- alter table public.comments add constraint comments_user_fk foreign key (user_id) references public.profiles (id);
```

---

## 5) Supabase Clients

### 5.1 **Service-role** (server only)
**Add:** `lib/supabase/admin.ts`
```ts
import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the Service Role key.
// Do NOT import this in client-side code.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only
  return createClient(url, key, { auth: { persistSession: false } });
}
```

### 5.2 Keep your existing clients (no changes)
- `lib/supabase/server.ts` (SSR anon via cookies)
- `lib/supabase/client.ts` (browser anon)
- `lib/supabase/middleware.ts` (session refresh – for any Supabase Auth you also use)

---

## 6) Auth Route — **dynamic** domain + cookie + profile upsert

**Add:** `app/api/auth/[...thirdweb]/route.ts`
```ts
import { NextRequest } from "next/server";
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { createAdminClient } from "@/lib/supabase/admin";

function getAuthForRequest(req: NextRequest) {
  // Prefer explicit env, else use incoming Host header, else fallback
  const domain =
    process.env.THIRDWEB_AUTH_DOMAIN ||
    req.headers.get("host") ||
    "localhost:3000";

  return createAuth({
    domain,
    adminAccount: privateKeyToAccount(process.env.THIRDWEB_AUTH_PRIVATE_KEY!),
  });
}

export async function GET(req: NextRequest) {
  const auth = getAuthForRequest(req);
  return auth.handlers().GET!(req);
}

export async function POST(req: NextRequest) {
  const auth = getAuthForRequest(req);

  // 1) thirdweb verifies SIWE + sets secure HTTP-only cookie
  const res = await auth.handlers().POST!(req);

  // 2) Upsert profile (non-blocking)
  try {
    const user = await auth.getUser(req);
    if (user?.address) {
      const supabase = createAdminClient();
      await supabase
        .from("profiles")
        .upsert(
          { wallet_address: user.address.toLowerCase(), last_login_at: new Date().toISOString() },
          { onConflict: "wallet_address" }
        );
    }
  } catch (e) {
    console.error("[auth] profile upsert error:", e);
  }

  return res;
}
```

---

## 7) Protected API — current wallet info + profile

**Add:** `app/api/me/route.ts`
```ts
import { NextRequest, NextResponse } from "next/server";
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { createAdminClient } from "@/lib/supabase/admin";

function getAuthForRequest(req: NextRequest) {
  const domain =
    process.env.THIRDWEB_AUTH_DOMAIN ||
    req.headers.get("host") ||
    "localhost:3000";

  return createAuth({
    domain,
    adminAccount: privateKeyToAccount(process.env.THIRDWEB_AUTH_PRIVATE_KEY!),
  });
}

export async function GET(req: NextRequest) {
  const auth = getAuthForRequest(req);
  const user = await auth.getUser(req);
  if (!user?.address) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("wallet_address", user.address.toLowerCase())
    .maybeSingle();

  return NextResponse.json({ address: user.address, profile });
}
```

---

## 8) Connect Wallet — UI wiring

**Edit:** `components/web3/wallet-connect-button.tsx`
```tsx
'use client';

import { useState } from "react";
import { ConnectButton } from "thirdweb/react";

export default function WalletConnectButton() {
  const [status, setStatus] = useState<"idle" | "signed-in">("idle");

  return (
    <div className="space-y-2">
      <ConnectButton
        client={{ connect: { showThirdwebDefaultWallets: true } }}
        auth={{
          // This calls /api/auth/[...thirdweb] behind the scenes
          onLogin: () => setStatus("signed-in"),
        }}
      />
      <p className="text-sm">
        {status === "signed-in" ? "Wallet signed in ✅" : "Connect wallet to sign in"}
      </p>
    </div>
  );
}
```

> If you want to keep your custom modal UX (`components/web3/connect-modal.tsx`), you can still initiate the thirdweb Auth login programmatically; just target the same route.

---

## 9) Layout — Provider (no change required)

Your `app/layout.tsx` already wraps with `<ThirdwebProvider>`. You can optionally move this into a `TWProvider` in `lib/web3/` for central config, but it is not required for Version A.2.

---

## 10) Security & Domain Notes (A.2 integrated)

- **THIRDWEB_AUTH_PRIVATE_KEY** is a server secret (like a JWT secret). **Never** use a wallet key here.
- The **domain** used in SIWE is **auto-detected** from the request host; this prevents domain mismatches across:
  - v0.app previews (e.g., `myproject.v0.app`)
  - Vercel previews (e.g., `dapptober-git-branch-xxxx.vercel.app`)
  - Production (`dapptober.vercel.app`)
- If you **must** force a domain, set `THIRDWEB_AUTH_DOMAIN` in the environment; otherwise omit it.
- Always **lowercase** `wallet_address` before writing/querying.

---

## 11) Deprecate old wallet route

**Replace** `app/api/auth/wallet/route.ts` with a “Gone” response:
```ts
import { NextResponse } from "next/server";

// Deprecated: use /api/auth/[...thirdweb] (thirdweb Auth cookie sessions)
export async function POST() {
  return NextResponse.json({ error: "Deprecated. Use /api/auth/[...thirdweb]" }, { status: 410 });
}
```

---

## 12) Local Dev & Test

1. Start the app: `pnpm dev` (or `npm run dev`).
2. Use your wallet connect UI → sign SIWE → thirdweb sets cookie.
3. `GET /api/me` → expect `{ address, profile }`.
4. Supabase: confirm a row in `profiles` with `wallet_address` (lowercased) and `last_login_at` set.

---

## 13) Conflict Resolution Matrix

| Symptom | Cause | Fix |
|---|---|---|
| “Invalid domain” / signature mismatch | Hostname mismatch | Dynamic detection included; remove stale `THIRDWEB_AUTH_DOMAIN` or set correctly |
| 401 from `/api/me` | No cookie yet | Connect wallet & sign; ensure Auth route is deployed |
| RLS blocked queries | Using anon client with strict policies | For Version A.2 reads/writes, use **service-role** in API routes |
| Duplicate profiles | Case sensitivity | Always `toLowerCase()` `wallet_address` |
| Build errors referencing `@thirdweb-dev/*` | Legacy SDK imports | Replace with unified `thirdweb/*` imports |

---

## 14) v0 Apply Checklist

- [ ] Added `lib/supabase/admin.ts`
- [ ] Added `app/api/auth/[...thirdweb]/route.ts` (dynamic domain version)
- [ ] Added `app/api/me/route.ts`
- [ ] Edited `components/web3/wallet-connect-button.tsx`
- [ ] Deprecated `app/api/auth/wallet/route.ts`
- [ ] `.env` has thirdweb/Supabase keys; **no domain needed** (optional)

---

## 15) Appendix — (Optional) Supabase‑managed Web3 Sessions (RLS-first)

If you prefer **Supabase** to mint the session (for full RLS/Storage/Realtime):

1. Add `user_id uuid references auth.users(id) unique` to `profiles` and migrate data accordingly.
2. Write RLS policies using `auth.uid()`:
   ```sql
   create policy "read own profile"
   on public.profiles for select
   using (auth.uid() = user_id);

   create policy "update own profile"
   on public.profiles for update
   using (auth.uid() = user_id);
   ```
3. Client login flow:
   ```ts
   import { createClient } from "@supabase/supabase-js";
   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
   const { data, error } = await supabase.auth.signInWithWeb3({
     provider: "ethereum",
     options: { domain: window.location.host },
   });
   ```
4. Replace service-role usage in routes with anon/SSR clients and rely on RLS.
5. Remove `/api/auth/[...thirdweb]` once everything is migrated.

---

**End — Version A.2 (Dynamic Domain Integrated).**
