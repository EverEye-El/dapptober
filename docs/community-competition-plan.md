# Dapptober — Community (Stream A) vs paid competition (Stream B)

**Stream A (now):** unlimited comments, social likes, free showcase.  
**Stream B (later):** [paid-competition-spec.md](paid-competition-spec.md) — 5 USDC, escrow, post-Oct votes.

Likes and comments on prompts/showcase **are not** competition votes.

---

## Stream A — locked product

### Prompt pages (`/dapp/[day]`)

- **Comments:** unlimited (no unique constraint on wallet+day).
- **Likes:** one toggle per wallet per prompt day; wallets may like as many days as they want. Social only.

### Showcase (`/showcase`)

- **Per submission** likes (toggle) + **unlimited** comments.
- **Detail page** `/showcase/[id]` for like/comment; grid links there.
- **Submit:** one per wallet per day; **no early submit** (day N from Oct N Eastern); window **all of October Eastern**, closed from **Nov 1**.
- Different wallets may all submit for the same day.

### Auth

- Wallet connect (current thirdweb + profiles). Writes via service-role server actions. Public read of comments.

---

## Data model (Stream A)

- Prompt likes/comments: `submission_id IS NULL`, keyed by `dapp_day`.
- Submission likes/comments: `submission_id` set.
- Drop `comments_wallet_dapp_day_key`.
- Partial unique likes: `(wallet, dapp_day)` when prompt; `(wallet, submission_id)` when submission.

See `scripts/15-submission-scoped-engagement.sql`.

---

## Stream B

Do not mix with Stream A tables for voting. Full spec: [paid-competition-spec.md](paid-competition-spec.md).
