# Dapptober secondary track — paid agent competition

Source of truth for **Stream B**. Free primary track (GTFOL, no fee) stays separate. **No contract code in this file** — implement after Stream A (community/showcase) is live.

This spec fills former “open decisions” with locked defaults so an agent can build without a questionnaire.

---

## Product

- **Primary track:** Free Dapptober prompts and showcase uploads. Comments and likes there are **social only** and **never** competition votes.
- **Secondary track:** Optional **5 USDC** registration per **AI agent entry**. Community votes after October. Winner receives the **escrow prize pot**.

---

## Registration

| Item | Rule |
|------|------|
| Entry fee | **5 USDC** per agent (on-chain, registrant wallet) |
| Multiple agents | **Yes** — one payment per agent; same wallet may enter more than one agent |
| Payload | Name, description, demo URL, optional github/image, owner wallet; store metadata URI/hash on-chain plus DB row |

---

## Money (USDC on Base)

Per successful **5 USDC** payment:

1. **1 USDC** → **creator wallet** immediately (not in the prize pot).
2. **4 USDC** → **competition escrow** (prize pot).

**Pot:**

- **No seed at deploy.** The escrow starts empty and grows **+4 USDC** per paid entry.
- The site may **display the pot as $100** until real fees catch up; you add USDC into escrow later from collected fees when you want the on-chain balance to match.
- Entire escrow balance after finalize → **winning owner wallet** (or split, see ties).

**Creator wallet:** locked at deploy (**immutable**). Prefer a **thirdweb server wallet** as that address.

**Chain:** Build and test on **Base Sepolia**, then deploy the same contract to **Base mainnet**. USDC = official Circle USDC on that chain.

---

## Voting (separate from showcase likes)

| Item | Rule |
|------|------|
| What is voted | Paid competition entries only |
| Who votes | **Any person**, one vote per agent (they can support more than one entry) |
| Wallet votes | Each vote is an **on-chain transaction**, and a **database copy** is kept as backup |
| No wallet yet | Record the vote in the **database separately**. At the end, add those ballots into the final tally. If that cannot be done safely, the app creates a **smart wallet** so they can vote on-chain |
| Sybil | Wallet uniqueness for on-chain votes; off-chain ballots are a separate bucket until finalize |
| Opens | **Oct 1 00:00 US Eastern** |
| Closes | **End of Nov 5** (Nov 6 00:00 Eastern). Winner announced by **Nov 10** |
| Winner | Highest vote count |
| Ties | **2 or 3** tied agents: **split the pot**. **More than 3** tied: **runoff**, or you pick the winner |
| Invalid entries | Owner/admin can mark disqualified before finalize; those votes ignored |

---

## Timeline

```
Oct 1                 voting opens (with paid registrations)
Nov 5                 last day of voting
Nov 6 00:00 Eastern   voting closes
by Nov 10             winner announced
then                  tally → finalize → escrow → winner wallet(s)
```

---

## Contract responsibilities

1. Accept 5 USDC, split 1 / 4, store entry id + owner + metadata URI.
2. Hold escrow (including 100 USDC seed).
3. After close: `finalizeWinner(entryIds[])` (supports split ties) then transfer pot.
4. Do **not** depend on prompt-page or showcase likes.

---

## App / DB (when Stream B is built)

- Table `competition_entries` (or paid flag + `tx_hash` on a dedicated row) **linked to** optional showcase submission — **not** the same as free likes.
- Table `competition_votes (entry_id, wallet_address)` unique.
- UI: register/pay, list entries, vote from Oct 1 through Nov 5, embed each agent demo on its page, show pot and countdown.

---

## Out of scope until Stream A is done

Showcase comments, prompt likes, submit calendar — see [community-competition-plan.md](community-competition-plan.md).
