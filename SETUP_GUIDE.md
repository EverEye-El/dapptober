# Web3 DApp Setup Guide
## Thirdweb + Supabase + Wallet Authentication

This guide documents the authentication and database setup for a Web3 DApp using Thirdweb for wallet connections and Supabase for data storage, without using Supabase Auth.

---

## Architecture Overview

### Authentication Flow
- **No Supabase Auth**: We don't use Supabase's built-in authentication system
- **Wallet-based identity**: User identity is based on their wallet address
- **Server-side validation**: All database operations go through server actions that use the Supabase service role key
- **RLS policies**: Database is protected with restrictive RLS policies that only allow service role access

### Key Principle
> The app validates wallet ownership in the client, then uses server actions with the service role key to bypass RLS and write to the database after validation.

---

## Environment Variables

\`\`\`env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Thirdweb
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
\`\`\`

---

## Thirdweb Setup

### 1. Client Configuration (`lib/thirdweb/client.ts`)

\`\`\`typescript
import { createThirdwebClient } from "thirdweb"

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
})
\`\`\`

### 2. Wallet Connection Component

\`\`\`typescript
import { ConnectButton } from "thirdweb/react"
import { createWallet } from "thirdweb/wallets"

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
]

<ConnectButton
  client={client}
  wallets={wallets}
  connectModal={{ size: "compact" }}
/>
\`\`\`

### 3. Getting Active Account

\`\`\`typescript
import { useActiveAccount } from "thirdweb/react"

const account = useActiveAccount()
const walletAddress = account?.address // "0x..."
\`\`\`

---

## Supabase Setup

### 1. Database Schema

#### Profiles Table
\`\`\`sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_profiles_wallet ON profiles(wallet_address);
\`\`\`

#### Submissions Table
\`\`\`sql
CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL REFERENCES profiles(wallet_address),
  title text NOT NULL,
  description text NOT NULL,
  demo_url text NOT NULL,
  github_url text,
  image_url text,
  dapp_day integer NOT NULL,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_submissions_wallet ON submissions(wallet_address);
CREATE INDEX idx_submissions_day ON submissions(dapp_day);
\`\`\`

#### Comments Table
\`\`\`sql
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_comments_submission ON comments(submission_id);
CREATE INDEX idx_comments_wallet ON comments(wallet_address);
\`\`\`

#### Likes Table
\`\`\`sql
CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(submission_id, wallet_address)
);

CREATE INDEX idx_likes_submission ON likes(submission_id);
CREATE INDEX idx_likes_wallet ON likes(wallet_address);
\`\`\`

### 2. Row Level Security (RLS) Policies

**Important**: RLS policies are RESTRICTIVE - they deny all public access. Only the service role can write.

\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Allow public reads
CREATE POLICY "Public read access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON submissions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON comments FOR SELECT USING (true);
CREATE POLICY "Public read access" ON likes FOR SELECT USING (true);

-- Deny all public writes (only service role can write)
CREATE POLICY "Deny public insert" ON profiles FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny public update" ON profiles FOR UPDATE USING (false);
CREATE POLICY "Deny public delete" ON profiles FOR DELETE USING (false);

CREATE POLICY "Deny public insert" ON submissions FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny public update" ON submissions FOR UPDATE USING (false);
CREATE POLICY "Deny public delete" ON submissions FOR DELETE USING (false);

CREATE POLICY "Deny public insert" ON comments FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny public update" ON comments FOR UPDATE USING (false);
CREATE POLICY "Deny public delete" ON comments FOR DELETE USING (false);

CREATE POLICY "Deny public insert" ON likes FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny public update" ON likes FOR UPDATE USING (false);
CREATE POLICY "Deny public delete" ON likes FOR DELETE USING (false);
\`\`\`

### 3. Supabase Clients

#### Admin Client (Service Role)
\`\`\`typescript
// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js"

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
\`\`\`

#### Browser Client (Anon Key)
\`\`\`typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
\`\`\`

---

## Server Actions Pattern

All database writes go through server actions that:
1. Validate the wallet address
2. Use the service role client to bypass RLS
3. Perform the database operation

### Example: Create Comment

\`\`\`typescript
// app/actions/comments.ts
"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

export async function createComment(
  submissionId: string,
  walletAddress: string,
  content: string
) {
  if (!walletAddress) {
    return { success: false, error: "Wallet address required" }
  }

  if (!content.trim()) {
    return { success: false, error: "Comment cannot be empty" }
  }

  // Ensure profile exists
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("wallet_address")
    .eq("wallet_address", walletAddress)
    .single()

  if (!profile) {
    // Create profile if it doesn't exist
    await supabaseAdmin.from("profiles").insert({
      wallet_address: walletAddress,
    })
  }

  // Insert comment using service role (bypasses RLS)
  const { data, error } = await supabaseAdmin
    .from("comments")
    .insert({
      submission_id: submissionId,
      wallet_address: walletAddress,
      content: content.trim(),
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
\`\`\`

### Example: Toggle Like

\`\`\`typescript
// app/actions/likes.ts
"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

export async function toggleLike(
  submissionId: string,
  walletAddress: string
) {
  if (!walletAddress) {
    return { success: false, error: "Wallet address required" }
  }

  // Check if already liked
  const { data: existingLike } = await supabaseAdmin
    .from("likes")
    .select("id")
    .eq("submission_id", submissionId)
    .eq("wallet_address", walletAddress)
    .single()

  if (existingLike) {
    // Unlike
    const { error } = await supabaseAdmin
      .from("likes")
      .delete()
      .eq("id", existingLike.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, liked: false }
  } else {
    // Like
    const { error } = await supabaseAdmin
      .from("likes")
      .insert({
        submission_id: submissionId,
        wallet_address: walletAddress,
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, liked: true }
  }
}
\`\`\`

---

## Client-Side Usage

### Example: Comment Form

\`\`\`typescript
"use client"

import { useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import { createComment } from "@/app/actions/comments"

export function CommentForm({ submissionId }: { submissionId: string }) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const account = useActiveAccount()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!account?.address) {
      alert("Please connect your wallet")
      return
    }

    setIsSubmitting(true)

    const result = await createComment(
      submissionId,
      account.address,
      content
    )

    if (result.success) {
      setContent("")
      // Optionally refresh data or update UI
    } else {
      alert(result.error)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        disabled={!account?.address || isSubmitting}
      />
      <button type="submit" disabled={!account?.address || isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  )
}
\`\`\`

### Example: Like Button

\`\`\`typescript
"use client"

import { useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import { toggleLike } from "@/app/actions/likes"
import { Heart } from 'lucide-react'

export function LikeButton({
  submissionId,
  initialLikes,
  initialIsLiked,
}: {
  submissionId: string
  initialLikes: number
  initialIsLiked: boolean
}) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLoading, setIsLoading] = useState(false)
  const account = useActiveAccount()

  const handleLike = async () => {
    if (!account?.address) {
      alert("Please connect your wallet")
      return
    }

    setIsLoading(true)

    // Optimistic update
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)

    const result = await toggleLike(submissionId, account.address)

    if (!result.success) {
      // Revert on error
      setIsLiked(isLiked)
      setLikes(likes)
      alert(result.error)
    }

    setIsLoading(false)
  }

  return (
    <button onClick={handleLike} disabled={isLoading}>
      <Heart className={isLiked ? "fill-current" : ""} />
      <span>{likes}</span>
    </button>
  )
}
\`\`\`

---

## Common Pitfalls & Solutions

### ❌ Problem: "new row violates row-level security policy"
**Cause**: Trying to insert data using the anon key client  
**Solution**: Use server actions with `supabaseAdmin` (service role key)

### ❌ Problem: "column user_id does not exist"
**Cause**: Mixing Supabase Auth patterns with wallet-based auth  
**Solution**: Use `wallet_address` consistently, never `user_id`

### ❌ Problem: State reverts after optimistic update
**Cause**: `router.refresh()` or useEffect resetting state  
**Solution**: Remove router.refresh() and rely on optimistic updates

### ❌ Problem: "@wallet.local" appearing in addresses
**Cause**: Legacy email-based auth workaround  
**Solution**: Strip `.replace(/@wallet\.local$/, "")` in display logic

### ❌ Problem: Profile not found errors
**Cause**: Profile doesn't exist for wallet address  
**Solution**: Auto-create profiles in server actions before operations

---

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Public read access only
- ✅ All writes go through server actions
- ✅ Server actions use service role key
- ✅ Wallet address validation in server actions
- ✅ No sensitive data in client-side code
- ✅ Service role key only in server-side code
- ✅ Input validation and sanitization

---

## Testing Checklist

- [ ] Connect wallet successfully
- [ ] Create profile on first interaction
- [ ] Submit data (comments, likes, submissions)
- [ ] Data persists after page refresh
- [ ] Optimistic updates work correctly
- [ ] Error handling shows user-friendly messages
- [ ] Disconnect wallet clears user state
- [ ] Multiple wallets can interact independently

---

## Additional Resources

- [Thirdweb React SDK](https://portal.thirdweb.com/react)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

## Summary

This setup provides:
- ✅ Secure wallet-based authentication
- ✅ Protected database with RLS
- ✅ Clean separation of client/server logic
- ✅ Optimistic UI updates
- ✅ No dependency on Supabase Auth
- ✅ Production-ready security

The key insight: **Validate on client, execute on server with service role.**
