# Dapptober build plan

One implementation pass. Two products stay separate: the free track and the paid competition. Likes never count as votes.

This plan is the build checklist. The product rules live in the docs below. If this file and those docs disagree, **this file wins** on sequencing (build both now) and the three defaults at the end of the locked list.

## Documents included

| Doc | Role |
|-----|------|
| [community-competition-plan.md](community-competition-plan.md) | Free track: unlimited comments, social likes, showcase pages, October submit window |
| [paid-competition-spec.md](paid-competition-spec.md) | Paid track: 5 USDC, escrow, on-chain votes, Oct 1–Nov 5 |
| [dapptober-prompts.md](dapptober-prompts.md) | The 31 daily prompts (copy source: `lib/dapp-prompts.ts`) |

## Locked rules

- Comments are unlimited on prompt pages and on each showcase submission page.
- **Like** is a heart on a prompt day or on a showcase submission. Social only.
- **Vote** is a separate control and a separate table. It appears only on paid competition entries.
- Showcase grid is a poster. Likes, comments, demo, and code live on `/showcase/[id]`.
- Submit form accepts an image file (PNG, JPG, WEBP, GIF, max 5 MB) so cards are not stuck on one fallback image. Image URL remains optional.
- Free submissions: a wallet may submit one build per wallet per prompt day. Day N unlocks on Oct N, US Eastern. Submissions stay open through October and close Nov 1, 00:00 Eastern. Different wallets may all submit for the same day.
- Paid track: 5 USDC per agent, as many agents as a wallet pays for. $1 to the locked creator wallet immediately. $4 into escrow.
- No USDC seed at deploy. The site may display the pot as **$100** until you add USDC into the same escrow from fees.
- Chain: Base Sepolia first, then the same contract on Base mainnet. Token is Circle USDC on that chain.
- Creator wallet is immutable. Use a thirdweb server wallet address at deploy.
- Votes: one per wallet per entry. Each vote is an on-chain transaction plus a database backup row. A visitor without a wallet gets a smart wallet so the vote is still on-chain.
- Voting opens Oct 1, 00:00 US Eastern and closes at the end of Nov 5 (Nov 6, 00:00 US Eastern). The winner is announced by Nov 10.
- Winner is the highest vote count. Two or three tied entries split the pot. More than three go to a runoff. You pick only if the runoff is still tied.
- Prize pays the wallet that registered the agent.
- No minimum vote count. No challenge window after voting closes. Announce the winner by Nov 10.

## Already in the repo (finish, do not rewrite)

- `lib/community/engagement.ts` — prompt vs submission like/comment target
- `lib/community/dapptober-calendar.ts` — Eastern unlock and October close
- `scripts/15-submission-scoped-engagement.sql` — `submission_id` on likes/comments, drop the one-comment-per-day constraint, image bucket
- `app/actions/comments.ts`, `app/actions/likes.ts` — target-aware writes
- `app/actions/submissions.ts` — calendar check and image upload helper
- `app/showcase/[id]/page.tsx` — submission page (layout A)
- `components/web3/comments-section.tsx`, `components/web3/like-button.tsx` — target prop
- `components/web3/submit-button.tsx` — day picker and image file field started
- Showcase grid View link and per-submission counts in `app/api/showcase/route.ts`

Apply `scripts/15-submission-scoped-engagement.sql` on the hosted Supabase project `dapptober-db` before treating likes and comments as live.

## Build sequence

### 1. Free community

1. Apply the SQL migration and create the public `submission-images` bucket.
2. Prompt pages load likes and comments only where `submission_id` is null.
3. `/showcase/[id]` is the only place to like or comment on a submission. Grid cards link there and show that submission’s counts.
4. Submit modal: pick an unlocked day, optional image file upload, then insert the submission.
5. Confirm two comments from the same wallet on one prompt, and a like on a submission that does not change the prompt’s like count.

### 2. Paid competition (separate tables and UI)

1. Anchor program or Solidity contract on Base Sepolia:
   - `register(metadataUri)` pulls 5 USDC, sends 1 to the immutable creator wallet, keeps 4 in escrow.
   - Stores entry id, owner, metadata URI.
   - `vote(entryId)` one vote per wallet per entry, only from Oct 1 through the end of Nov 5.
   - `finalize(entryIds)` after close. Split for 2–3 winners. Revert if more than 3 are tied so a runoff or manual pick can happen off the first finalize.
   - `depositPot(amount)` so you can add USDC later. Display balance, and show $100 when the on-chain balance is still below that.
2. Metadata JSON: name, description, demo URL, image URL, owner wallet. Pin or store the URI the contract saves.
3. Supabase:
   - `competition_entries` — wallet, metadata, image, demo, `tx_hash`, on-chain entry id, status (`registered`, `disqualified`).
   - `competition_votes` — entry id, wallet, `tx_hash`, unique `(entry_id, wallet_address)`.
   - Neither table reads or writes `likes`.
4. App:
   - `/competition` lists entries, shows the pot and the Oct 1–Nov 5 window. Each entry page embeds the agent demo.
   - Register flow: form (name, description, demo, image) then the 5 USDC transaction, then the DB row.
   - **Vote** button on a competition entry only. Label it Vote. Do not use the heart icon.
   - **Like** stays on prompt pages and `/showcase/[id]` only.
   - Copy the on-chain vote into `competition_votes` after confirmation.
   - If the visitor has no wallet, create a thirdweb smart wallet, then send the same vote transaction.
5. After Nov 5, a finalize action reads the on-chain tally (DB is backup) and calls `finalize`. Announce the winner by Nov 10.

### 3. Verify

- Prompt like and showcase like do not appear on `/competition`.
- A competition vote does not increment a showcase like count.
- Image upload shows that file on the showcase card and on the competition entry card.
- Sepolia: register, vote, and a two-way tie split. Mainnet deploy only after that passes.

## Contract note

`docs/paid-competition-spec.md` still says the escrow is seeded with $100 at deploy. Ignore that sentence. The pot starts empty. The UI may still read $100 until you deposit.
