# Dapptober — Supabase RLS-First Integration (Version B)

Here’s a production-quality RLS kit that makes comments, likes, and submissions work well with Supabase-managed sessions (SIWE via supabase.auth.signInWithWeb3). It’s designed to be safe, consistent, and fast, and it won’t fight your current repo structure.

## 0) What You’ll Have After This

**Auth:** Supabase Web3 (SIWE) → user gets a Supabase JWT.  
**Data ownership:** every row tied to `user_id` (FK → `auth.users(id)`).  
**RLS:** Users can only write their own rows; public can read (configurable).  

### Integrity
- **Comments:** validated length, timestamps, owner-only update/delete.  
- **Likes:** unique per `(user_id, dapp_day)` (or per submission if you prefer).  
- **Submissions:** one row per user/day (unique), with safe defaults.  

### DX
Small client helpers you can call from your existing components.

### Migration from Version A.2
Backfill `profiles.user_id` on first Supabase login.

---

## 1) Auth Change (One Function, Keep Thirdweb UX)

Keep your `ConnectButton` for wallet UX, but actually sign in with Supabase right after connect.

### Add: `lib/web3/supabase-web3.ts`
```ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Call this right after the wallet connects (e.g., ConnectButton onLogin)
 * - Mints Supabase session via SIWE
 * - Ensures a profile row exists and attaches the wallet address (lowercased)
 */
export async function signInWithSupabaseWeb3(address?: string) {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase.auth.signInWithWeb3({
    provider: "ethereum",
    options: { domain: window.location.host },
  });
  if (error) throw error;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        wallet_address: address ? address.toLowerCase() : null,
      },
      { onConflict: "user_id" }
    );
  }

  return data;
}
```

### Edit: `components/web3/wallet-connect-button.tsx` (Switch to Supabase Sign-in)
```tsx
'use client';

import { useState } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { signInWithSupabaseWeb3 } from "@/lib/web3/supabase-web3";

export default function WalletConnectButton() {
  const [status, setStatus] = useState<"idle" | "signing" | "signed-in">("idle");
  const account = useActiveAccount();

  async function onLogin() {
    try {
      setStatus("signing");
      await signInWithSupabaseWeb3(account?.address);
      setStatus("signed-in");
    } catch (e) {
      console.error(e);
      setStatus("idle");
    }
  }

  return (
    <div className="space-y-2">
      <ConnectButton
        client={{ connect: { showThirdwebDefaultWallets: true } }}
        auth={{ onLogin }}
      />
      <p className="text-sm">
        {status === "signed-in" ? "Signed in with Supabase ✅" :
         status === "signing" ? "Signing in..." :
         "Connect wallet to sign in"}
      </p>
    </div>
  );
}
```

After this, client code can use `supabaseBrowser()` and RLS will enforce permissions.

---

## 2) Database Schema (Idempotent, Safe)

Run these in Supabase SQL Editor. They only add what's missing.

### 2.1 Profiles (tie to Supabase user; keep wallet)
```sql
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id),
  wallet_address text unique,
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

alter table public.profiles add column if not exists user_id uuid unique references auth.users(id);
alter table public.profiles add column if not exists wallet_address text;
alter table public.profiles add column if not exists last_login_at timestamptz;
alter table public.profiles add column if not exists updated_at timestamptz default now();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();
```

### 2.2 Comments
```sql
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dapp_day int not null,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_comments_day_created on public.comments (dapp_day, created_at desc);

drop trigger if exists trg_comments_touch on public.comments;
create trigger trg_comments_touch before update on public.comments
for each row execute function public.touch_updated_at();
```

### 2.3 Likes
```sql
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dapp_day int not null,
  created_at timestamptz default now(),
  unique (user_id, dapp_day)
);

create index if not exists idx_likes_day on public.likes (dapp_day);
```

### 2.4 Submissions
```sql
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day int not null,
  title text not null check (char_length(title) between 1 and 140),
  description text,
  tags text[] default '{}',
  technical_implementation text,
  key_features text[] default '{}',
  demo_url text,
  github_url text,
  image_url text,
  status text default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, day)
);

create index if not exists idx_submissions_day on public.submissions (day);

drop trigger if exists trg_submissions_touch on public.submissions;
create trigger trg_submissions_touch before update on public.submissions
for each row execute function public.touch_updated_at();
```

---

## 3) RLS Policies (Secure by Default)
```sql
alter table public.profiles enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
for select using (auth.uid() = user_id);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles
for insert with check (auth.uid() = user_id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
for update using (auth.uid() = user_id);

drop policy if exists "comments public read" on public.comments;
create policy "comments public read" on public.comments
for select using (true);

drop policy if exists "comments own write" on public.comments;
create policy "comments own write" on public.comments
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "likes public read" on public.likes;
create policy "likes public read" on public.likes
for select using (true);

drop policy if exists "likes own write" on public.likes;
create policy "likes own write" on public.likes
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "submissions public read" on public.submissions;
create policy "submissions public read" on public.submissions
for select using (true);

drop policy if exists "submissions own write" on public.submissions;
create policy "submissions own write" on public.submissions
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

---

## 4) Client Helpers (Drop-In Calls from Components)

[Includes the 3 TS files for comments, likes, and submissions as before...]
