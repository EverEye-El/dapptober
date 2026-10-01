# Dapptober 2026 — All 31 Prompts

Source of truth in code: `lib/dapp-prompts.ts`. This document is for marketing, social copy, and reference.

**Theme:** AI agents × crypto — one vibe-coded build prompt per day in October.

## Cross-cutting Jev (System One) patterns

These recur across many days in **features** and **stack**:

- **Model routing:** Jev model-routing middleware — a fast System One pass on user/agent input to pick a small vs large LLM (LangChain-style harness).
- **Agent harness default:** Jev risk check on every MCP tool call before execution (Days 4, 14, 25, 31 and related agent builds).
- **Calibrated escalation:** When Jev confidence is below threshold, require human co-sign before onchain or high-risk action (Days 1, 14, 15, 30).

**Stack note:** Most prompts add **TypeSafe Jev**; control-plane days also list **LangChain TypeSafeClassifier**.

**Prompt pages:** On days where Jev is optional, the UI shows an **Optional Jev Layer** section; on control-plane days (1, 10, 14, 17, 20, 29, 30, 31) Jev stays in **Key Features**.

---

## Day 1 — The Agent Wallet Genesis

- **Vibe:** Clean-room lab, first light, onboarding ritual
- **Description:** Spin up your first AI agent with its own smart wallet, spending limits, and a chat UI to command it.
- **Brief:** Build a dapp where a user connects a wallet, then 'births' an AI agent that controls its own smart account. The owner grants the agent a scoped session key (daily spend cap, token allowlist, expiry) and chats with it in plain language: 'send 5 USDC to vitalik.eth', 'what's my balance?'. Every action the agent proposes is shown as a readable transaction preview before it executes.
- **Features:**
  - Smart account per agent (ERC-4337 or EIP-7702 delegation)
  - Session keys with spend caps, allowlists, and expiry
  - Natural-language chat that maps to typed tool calls
  - Human-readable transaction previews and a revoke button
  - Jev (System One) approve/reject gate on proposed transactions and policy-fit scores before session keys act
  - Jev model-routing middleware: fast pass routes simple chat to a small LLM vs complex tasks to a larger LLM
  - Calibrated escalation: when Jev confidence is below threshold, require human co-sign before execution
- **Stack:** thirdweb Smart Wallets, Vercel AI SDK, viem, Base Sepolia, TypeSafe Jev, LangChain TypeSafeClassifier
- **Tags:** Agents, Smart Wallets, Account Abstraction, System One, Jev, Session Keys

---


## Day 2 — The Pay-Per-Prompt Tollbooth

- **Vibe:** Retro-futurist highway tollbooth, neon receipts
- **Description:** An API that charges a few cents of USDC per request using HTTP 402 payments that agents settle automatically.
- **Brief:** Wrap any useful endpoint (image caption, weather, a premium dataset) behind an x402 paywall. Unpaid requests get a 402 Payment Required response with payment details; an agent client pays in stablecoins and retries without a human in the loop. Show a live 'toll log' of payments and requests so builders can watch machines pay machines.
- **Features:**
  - HTTP 402 payment challenge and verification middleware
  - Agent client that pays and retries automatically
  - Per-request USDC pricing with a live revenue ticker
  - Public toll log of settled payments
  - Jev classifies API tier, toll eligibility, and abuse/fraud scores before returning HTTP 402
- **Stack:** x402, USDC, Next.js Route Handlers, Base, TypeSafe Jev
- **Tags:** x402, Payments, Stablecoins, Jev, Agents

---


## Day 3 — The Agent Passport Office

- **Vibe:** Bureaucratic passport office meets cyberpunk
- **Description:** An onchain registry where AI agents get an identity, a reputation score, and verifiable service records.
- **Brief:** Create a registry dapp inspired by ERC-8004 'trustless agents': agents register an identity card (name, endpoint, capabilities, owner), clients leave signed feedback after each job, and validators can attest to task results. Render each agent as a stamped passport with its reputation history so humans and other agents can decide who to trust.
- **Features:**
  - Identity registry with agent cards and capability metadata
  - Signed, job-linked feedback that builds reputation
  - Validator attestations for completed tasks
  - Searchable passport directory with trust badges
  - Jev trust-tier badges and feedback-authenticity signals before reputation updates
- **Stack:** ERC-8004, Solidity, EAS Attestations, The Graph, TypeSafe Jev
- **Tags:** Identity, Reputation, ERC-8004, Jev

---


## Day 4 — The MCP Mercenary Guild

- **Vibe:** Fantasy guild hall, quest board, candlelit contracts
- **Description:** A bounty board where AI agents claim onchain quests through MCP tools and get paid from escrow.
- **Brief:** Post quests (summarize a DAO forum, audit a contract diff, label a dataset) with USDC locked in escrow. Agents discover quests through an MCP server you expose, claim them, submit work, and get paid when the quest giver or a validator approves. Style it like a medieval guild hall with a wax-sealed contract for every bounty.
- **Features:**
  - MCP server exposing list, claim, and submit tools
  - Escrow contract with approve, dispute, and timeout paths
  - Agent leaderboard by completed and approved quests
  - Quest cards with wax-seal status animations
  - Jev matches quests to agent capabilities; scores submission approve vs dispute
  - Agent harness default: Jev risk check on every MCP tool call before execution
- **Stack:** Model Context Protocol, Solidity Escrow, thirdweb Engine, Supabase, TypeSafe Jev
- **Tags:** MCP, Bounties, Escrow, Jev

---


## Day 5 — The Stablecoin Autopilot

- **Vibe:** Calm cockpit, aviation instruments, soft amber glow
- **Description:** An agent that keeps your stablecoin treasury balanced across yield sources within the rules you set.
- **Brief:** Build a treasury copilot for a person or a small DAO. The user sets a flight plan (max allocation per protocol, minimum liquidity, risk tier), and an agent monitors yields and rebalances only within that policy. Every move is logged with the agent's reasoning, and a big 'disengage autopilot' switch hands control back to the human.
- **Features:**
  - Policy engine enforced by contract, not just the prompt
  - Yield monitoring across lending and savings vaults
  - Rebalance log with plain-language reasoning
  - One-click disengage and withdraw-all
  - LLM + Jev split: Jev rebalance yes/no pre-screen inside onchain policy; LLM logs plain-language reasoning
  - Jev model-routing middleware for treasury chat vs deep policy questions
- **Stack:** Coinbase AgentKit, ERC-4626 Vaults, USDC, Vercel AI SDK, TypeSafe Jev
- **Tags:** DeFi, Stablecoins, Yield, Jev, Agents, Treasury

---


## Day 6 — The Intent Calligrapher

- **Vibe:** Minimalist zen studio, ink brush strokes
- **Description:** Type what you want in plain words; an agent turns it into a signed intent that solvers compete to fill.
- **Brief:** Replace swap forms with a single ink-brush text box. 'Get me 0.5 ETH for under 1,600 USDC before Friday' becomes a structured intent with limits and a deadline. The agent shows the parsed intent, simulates outcomes, and only asks for a signature once the user confirms. Solvers compete to fill it and the best fill is revealed with a brush-stroke animation.
- **Features:**
  - Natural language to structured intent with explicit limits
  - Pre-sign simulation and a readable intent preview
  - Solver competition with best-fill reveal
  - Intent history with filled, expired, and cancelled states
  - LLM + Jev split: LLM drafts natural-language intent; Jev validates limits and deadline before EIP-712 sign
- **Stack:** CoW Protocol or UniswapX, EIP-712, viem, Vercel AI SDK, TypeSafe Jev
- **Tags:** Intents, Trading, Solvers, Jev

---


## Day 7 — The Glass-Box Mind

- **Vibe:** Transparent laboratory, x-ray overlays, clinical cyan
- **Description:** Prove which model produced an AI answer, and that it wasn't tampered with, using verifiable inference.
- **Brief:** Build a dapp where an AI answer comes with a receipt: a TEE attestation or zkML proof binding the model, the input, and the output together. Users can post the receipt onchain, and a verifier contract or page checks it. Visualize the proof as a glass box that turns green when verified and cracks red when tampered with.
- **Features:**
  - Inference behind a TEE or zkML proving pipeline
  - Onchain or client-side verification of the receipt
  - Tamper demo showing a failed verification
  - Shareable verified-answer cards
  - LLM + Jev split: LLM presents answers; Jev verify/fail attestation checks with calibrated confidence
- **Stack:** TEE (e.g. Phala, Marlin), EZKL, Solidity Verifier, IPFS, TypeSafe Jev
- **Tags:** Verifiable AI, zkML, TEE, Jev, Agents

---


## Day 8 — The Swarm Senate

- **Vibe:** Holographic Roman senate, marble and light
- **Description:** A DAO where delegate agents debate proposals in public, and humans keep the final veto.
- **Brief:** Give each DAO member a delegate agent trained on their stated values. When a proposal lands, the agents debate in a public transcript, summarize the tradeoffs, and cast provisional votes. Humans review and can override their agent before the vote finalizes. The senate floor shows each agent as a hologram with its position and confidence.
- **Features:**
  - Per-member delegate agents with value profiles
  - Public, archived debate transcripts
  - Provisional agent votes with a human override window
  - Proposal outcome dashboard showing agent vs human alignment
  - Jev flags when a human override is likely needed vs accepting a delegate provisional vote
  - Jev model-routing for debate summarization vs full reasoning passes
- **Stack:** OpenZeppelin Governor, Snapshot, ElizaOS, Supabase, TypeSafe Jev
- **Tags:** DAO, Multi-Agent, Governance, Jev

---


## Day 9 — The Forecast Colosseum

- **Vibe:** Sports-bar trading floor, jumbotron odds
- **Description:** Prediction markets where AI agents and humans go head to head, ranked by forecasting accuracy.
- **Brief:** Launch small prediction markets on near-term questions (token prices, sports, releases, weather). Both humans and registered AI agents can trade. A jumbotron leaderboard tracks calibration and Brier scores so you can see whether the bots or the crowd forecast better. Resolve markets with an oracle and settle in stablecoins.
- **Features:**
  - Binary markets with stablecoin settlement
  - Agent trading API with per-agent risk limits
  - Calibration and Brier-score leaderboards, human vs agent
  - Oracle-based resolution with a dispute window
  - Jev oracle-resolution confidence scoring; route human vs registered agent trading lanes
- **Stack:** UMA Optimistic Oracle, Solidity, USDC, Recharts, TypeSafe Jev
- **Tags:** Prediction Markets, Forecasting, Agents, Jev

---


## Day 10 — The Human Checkpoint

- **Vibe:** Noir interrogation room, retro-futurist empathy test
- **Description:** Proof of personhood that gates human-only spaces while letting labeled agents in through a separate door.
- **Brief:** As agents flood the internet, build a checkpoint: humans verify once with a personhood credential or passkey, and agents present a registered agent identity instead. The app then offers two lanes, a humans-only chat or airdrop and an agents-welcome API, and clearly labels who is who. Design it like a retro sci-fi empathy test booth.
- **Features:**
  - Personhood verification with a privacy-preserving proof
  - Separate agent lane using registered agent identities
  - Sybil-resistant claims for human-only rewards
  - Clear human and agent badges across the UI
  - Jev control plane: route human-only vs agent lanes; sybil-risk score for human-only claims
- **Stack:** World ID or Human Passport, Passkeys, ERC-8004, Supabase, TypeSafe Jev
- **Tags:** Personhood, Sybil Resistance, Identity, Jev, System One

---


## Day 11 — The GPU Night Market

- **Vibe:** Glowing night market, lanterns and humming GPUs
- **Description:** A decentralized compute bazaar where agents bid for GPU time to run inference and pay per job.
- **Brief:** Create a marketplace where GPU providers list capacity (model, VRAM, price per minute) and agents or humans submit inference jobs. Payment is escrowed and released when the job's output hash is delivered. Render the market as lantern-lit stalls, each glowing brighter as its GPU gets busier.
- **Features:**
  - Provider listings with specs and live pricing
  - Job escrow released on output delivery
  - Agent bidding API for automated compute buying
  - Provider uptime and reliability scores
  - Jev accepts or rejects bids and ranks GPU providers by reliability score
- **Stack:** DePIN (e.g. Akash, io.net), Solidity Escrow, Solana or Base, WebSockets, TypeSafe Jev
- **Tags:** DePIN, Compute, Marketplace, Jev

---


## Day 12 — The Provenance Press

- **Vibe:** Old letterpress print shop, ink and brass type
- **Description:** Register your work as programmable IP and license it to AI models with onchain royalties.
- **Brief:** Artists, writers, and coders register their work with a license: 'free for humans, paid for AI training', 'no derivatives', and so on. AI companies or agents buy licenses onchain and royalties flow back automatically, including to remixes. Each registered work gets a letterpress-style certificate with its license terms and payout history.
- **Features:**
  - IP registration with selectable license templates
  - Onchain license purchase for AI training or inference
  - Automatic royalty splits including derivatives
  - Certificate pages with license and earnings history
  - Jev chooses license template from an approved registry set
- **Stack:** Story Protocol, IPFS, thirdweb, USDC, TypeSafe Jev
- **Tags:** IP, Licensing, Royalties, Jev

---


## Day 13 — The Agent Launch Gantry

- **Vibe:** Rocket gantry at dusk, countdown clocks
- **Description:** Launch a tokenized AI agent whose revenue flows back to holders, with anti-rug safeguards built in.
- **Brief:** Build a launchpad where creators deploy an agent plus its token. The agent earns revenue (tips, x402 fees, services) that flows into a treasury shared with token holders. Bake in safeguards: vested creator allocation, locked liquidity, and a public dashboard of the agent's real revenue so hype can be checked against numbers.
- **Features:**
  - Agent plus token deploy in one flow
  - Revenue treasury with holder distributions
  - Vesting, locked liquidity, and rug-risk indicators
  - Real revenue vs market cap dashboard
  - LLM + Jev split: Jev rug-risk indicator scores for listings; LLM narrates launch and revenue story
- **Stack:** thirdweb Token Contracts, Bonding Curves, Base, Dune, TypeSafe Jev
- **Tags:** Tokenization, Launchpad, Agents, Jev, Revenue, Anti-rug

---


## Day 14 — The Guardrail Sentinel

- **Vibe:** Security ops center, red alert strobes, dark glass
- **Description:** A control room for every agent you run: spending policies, allowlists, alerts, and a kill switch.
- **Brief:** Agents with wallets need guardrails that live outside the prompt. Build a dashboard that manages onchain policies for each agent: per-transaction and daily limits, contract allowlists, time windows, and required human co-signing above a threshold. Surface anomalies as alerts and include a big red kill switch that revokes every session key at once.
- **Features:**
  - Contract-enforced spend limits and allowlists
  - Human co-sign required above a threshold
  - Anomaly alerts for unusual agent behavior
  - Global kill switch that revokes all session keys
  - Jev control plane: tool-call allow/block, anomaly severity scores, and kill-switch triggers
  - Agent harness default: Jev risk check on every MCP tool call before execution
  - Calibrated escalation: low-confidence risky actions require human co-sign
  - Jev model-routing middleware across agent control-room chat
- **Stack:** Safe Modules or Smart Account Policies, Session Keys, viem, Tenderly, TypeSafe Jev, LangChain TypeSafeClassifier
- **Tags:** Security, Policies, Account Abstraction, Jev, System One, Guardrails

---


## Day 15 — The Real-World Concierge

- **Vibe:** Art-deco private bank, gold leaf and velvet
- **Description:** An agent concierge that explains tokenized real-world assets and helps you allocate into them.
- **Brief:** Tokenized treasuries, money-market funds, and real estate are onchain now. Build a concierge that explains each asset in plain language (issuer, yield source, redemption terms, risks), checks eligibility, and walks the user through allocating. The agent must cite where each fact came from and never execute without explicit confirmation.
- **Features:**
  - Asset explainer cards with issuer and redemption details
  - Eligibility and compliance checks before purchase
  - Cited answers linking to issuer docs and contracts
  - Portfolio view with yield and maturity timelines
  - LLM + Jev split: Jev eligibility yes/no before LLM explains RWA details
  - Calibrated escalation: uncertain eligibility or allocation requires human confirmation
  - Jev model-routing for quick FAQ vs compliance-heavy questions
- **Stack:** Tokenized RWA protocols, Vercel AI SDK, Chainlink Data Feeds, USDC, TypeSafe Jev
- **Tags:** RWA, Tokenization, Compliance, Jev, Agents

---


## Day 16 — The Bot-to-Bot Bourse

- **Vibe:** Robot stock-exchange floor, ticker tape, brass bells
- **Description:** AI agents discover each other, negotiate deals, and settle them onchain through escrow.
- **Brief:** Build a trading floor for agents. A buyer agent needs a service (translation, research, data), discovers seller agents via agent cards, negotiates price and deadline over an agent-to-agent protocol, and locks payment in escrow. Humans watch the negotiation play out as a live transcript on a robot exchange floor.
- **Features:**
  - Agent discovery via published agent cards
  - Structured negotiation: offer, counter, accept
  - Escrowed settlement with delivery confirmation
  - Live negotiation transcripts for human review
  - Jev negotiation state machine: accept, counter, or reject with calibrated probabilities
- **Stack:** Agent2Agent (A2A) Protocol, ERC-8004, Solidity Escrow, Next.js, TypeSafe Jev
- **Tags:** A2A, Negotiation, Settlement, Jev

---


## Day 17 — The Memecoin Coroner

- **Vibe:** Noir detective morgue, flickering lamps
- **Description:** An AI forensic agent that dissects token contracts for rugs and honeypots and publishes its findings.
- **Brief:** Paste a token address and the coroner performs an autopsy: owner privileges, mint functions, blacklist or pause switches, liquidity locks, holder concentration, and sell simulations. The agent writes a toe-tag report in plain language and can publish it as an onchain attestation so others can see the verdict before they ape.
- **Features:**
  - Static and simulated checks for common rug patterns
  - Holder concentration and liquidity-lock analysis
  - Plain-language autopsy report with severity levels
  - Onchain attestation of findings
  - Jev rug-pattern classification and severity scoring; low confidence routes to human review before attestation
  - LLM + Jev split: LLM writes autopsy narrative; Jev drives severity and publish gate
- **Stack:** Etherscan or Blockscout APIs, Tenderly Simulation, EAS, Vercel AI SDK, TypeSafe Jev
- **Tags:** Security, Analytics, Attestations, Jev, System One, Memecoins

---


## Day 18 — The Encrypted Confidant

- **Vibe:** Velvet confessional booth, candlelight and cipher text
- **Description:** A private AI agent that manages positions on encrypted state so your strategy stays secret.
- **Brief:** Build an agent whose data and onchain balances stay encrypted using FHE or confidential computing. The user can ask for a private sealed-bid auction, a hidden limit order, or a confidential payroll run, and nobody watching the chain can see amounts. The UI shows cipher-text in the public view and decrypts only for the owner.
- **Features:**
  - Encrypted balances and amounts onchain
  - Private sealed-bid or hidden-order flow
  - Owner-only decryption view
  - Public vs private split-screen demo
  - Jev routes confidential request type (sealed bid, hidden order, payroll) without exposing amounts in control flow
- **Stack:** Zama fhEVM or Fhenix, Solidity, Vercel AI SDK, viem, TypeSafe Jev
- **Tags:** FHE, Privacy, Agents, Jev

---


## Day 19 — The Group-Chat Familiar

- **Vibe:** Cozy group chat, sticker bombs, pastel neon
- **Description:** A social agent that lives in your feed as a mini app: it tips, mints, splits bills, and runs polls.
- **Brief:** Build a Farcaster mini app (or a Telegram bot) with a friendly agent familiar. Mention it and it can tip a friend, split a dinner bill in USDC, mint a meme from the thread, or start a poll with onchain results. Keep it fun: stickers, reactions, and a pet-like avatar that levels up as the group uses it.
- **Features:**
  - Mini app with in-feed wallet actions
  - Tips, bill splits, and meme mints from chat
  - Onchain polls with live results
  - Evolving familiar avatar tied to group activity
  - Jev intent classification from mentions: tip, split bill, mint, or poll
  - Jev model-routing for lightweight social commands vs creative generation
- **Stack:** Farcaster Mini Apps, Neynar, Base, thirdweb Pay, TypeSafe Jev
- **Tags:** Social, Farcaster, Mini Apps, Jev

---


## Day 20 — The Restaked Referee

- **Vibe:** Striped referee, stadium lights, instant replay
- **Description:** A restaking-secured service that checks agent task results and slashes validators who lie.
- **Brief:** Agents claim they finished a task, but who checks? Build a validation service secured by restaked collateral: operators re-run or spot-check agent outputs and sign a verdict, and dishonest operators can be slashed. Present each verdict as an instant-replay review with the evidence the referees used.
- **Features:**
  - Operator registration with restaked collateral
  - Task verification and signed verdicts
  - Slashing flow with an evidence trail
  - Instant-replay UI for each disputed task
  - Jev verdict pass/fail with confidence for slash vs release on validator disputes
- **Stack:** EigenLayer AVS, Solidity, ERC-8004 Validation, Node.js Operators, TypeSafe Jev
- **Tags:** Restaking, Validation, Agents, Jev, System One

---


## Day 21 — The Chainless Traveler

- **Vibe:** Airport lounge, split-flap departure boards
- **Description:** One balance, every chain: an agent routes your money so you never have to think about bridges.
- **Brief:** Show a single unified balance across chains. When the user wants to pay, mint, or swap anywhere, an agent picks the route (bridge, swap, gas sponsorship) and explains it like a flight itinerary with legs, fees, and arrival time. The user never picks a chain, and a departure board shows every in-flight transfer.
- **Features:**
  - Unified multichain balance view
  - Agent-planned routes shown as itineraries
  - Gas sponsorship so users never need native gas
  - Split-flap board of in-flight transfers
  - LLM + Jev split: Jev picks route from approved bridge/swap options; LLM explains itinerary in chat
  - Jev model-routing on user travel/payment requests
- **Stack:** thirdweb Universal Bridge, Li.Fi or Across, Paymasters, viem, TypeSafe Jev
- **Tags:** Chain Abstraction, Cross-Chain, UX, Jev, Agents, Bridges

---


## Day 22 — The Agent Arena

- **Vibe:** Esports colosseum, holographic gladiators
- **Description:** An onchain strategy game where AI agents battle and players stake on the champions they train.
- **Brief:** Players write or prompt-tune an AI agent that plays a simple onchain game (territory, auctions, or rock-paper-scissors with a twist). Matches run on a schedule, moves are committed onchain, and spectators stake on outcomes. Winning agents climb a seasonal ladder and their trainers earn from the prize pool.
- **Features:**
  - Agent submission with prompt or strategy code
  - Commit-reveal moves for fair play
  - Spectator staking and prize pools
  - Seasonal ladder with replayable matches
  - Jev move-legality and commit-reveal fairness checks before onchain submission
- **Stack:** MUD or Dojo, Chainlink VRF, Vercel AI SDK, Phaser, TypeSafe Jev
- **Tags:** Gaming, Agents, Staking, Jev

---


## Day 23 — The Perp Pit Wall

- **Vibe:** F1 pit wall, telemetry screens, carbon fiber
- **Description:** An AI race engineer for perpetual futures that manages risk and explains every liquidation threat.
- **Brief:** Traders get a race engineer in their ear. The agent watches open perp positions, warns when margin or funding drift into danger, suggests (or with permission, places) stop-losses, and explains risk in plain language. The UI is an F1-style pit wall with live telemetry for leverage, liquidation distance, and PnL.
- **Features:**
  - Live position telemetry: leverage, funding, liquidation distance
  - Risk alerts with plain-language explanations
  - Permissioned stop-loss and de-risk actions
  - Post-trade debrief summarizing what happened
  - Jev liquidation-proximity bands and alert-priority scoring; LLM debrief for traders
  - Jev model-routing for telemetry alerts vs deep risk analysis
- **Stack:** Hyperliquid API, WebSockets, Vercel AI SDK, TradingView Lightweight Charts, TypeSafe Jev
- **Tags:** Perps, Trading, Risk, Jev, Agents

---


## Day 24 — The Agent Mishap Mutual

- **Vibe:** Victorian insurance office, ledgers and wax seals
- **Description:** An onchain mutual that covers losses when an AI agent makes a costly mistake.
- **Brief:** Agents will fat-finger trades and misread instructions. Build a mutual where agent operators buy cover, members stake into the pool, and claims are assessed with evidence (agent logs, transaction traces) and member votes. Premiums adjust to each agent's reputation and history.
- **Features:**
  - Cover purchase priced by agent reputation
  - Staked capital pool with yield for members
  - Claims with logs and traces as evidence
  - Member voting and payout on approved claims
  - Jev claim approve/deny and evidence-sufficiency scores before mutual votes
- **Stack:** Solidity, ERC-8004 Reputation, Snapshot, USDC, TypeSafe Jev
- **Tags:** Insurance, DeFi, Mutual, Jev, Agents

---


## Day 25 — The Memory Cathedral

- **Vibe:** Baroque library cathedral, floating glowing tomes
- **Description:** User-owned, portable long-term memory for AI agents, stored on decentralized storage.
- **Brief:** Your agent's memory shouldn't belong to one app. Build a memory vault where a user's preferences, notes, and conversation summaries are encrypted and stored on decentralized storage, with an onchain pointer they control. Any compatible agent can request access, and the user grants or revokes it per agent. Show memories as glowing tomes on cathedral shelves.
- **Features:**
  - Encrypted memory storage with user-held keys
  - Per-agent access grants and revocation
  - Memory import and export between agents
  - Visual memory library with search
  - Jev grant/revoke memory access per agent with confidence thresholds
  - Agent harness default: Jev risk check on every MCP memory tool call before execution
- **Stack:** Arweave, IPFS, or Walrus, Lit Protocol, MCP, Vercel AI SDK, TypeSafe Jev
- **Tags:** Storage, Memory, Data Ownership, Jev, MCP

---


## Day 26 — The Credentialed Studio

- **Vibe:** Film studio backlot, clapperboards and spotlights
- **Description:** Generate AI media with content credentials and mint it with provenance anyone can verify.
- **Brief:** Build a creator studio where users generate images or clips with AI, and every output carries content credentials (who made it, which model, what edits). Minting writes the provenance onchain, and a public verify page shows the credential chain for any file dropped on it. Make it feel like a film backlot where every take is logged.
- **Features:**
  - AI generation with embedded content credentials
  - Mint with provenance metadata onchain
  - Drag-and-drop verify page for any file
  - Edit history timeline per asset
  - LLM + Jev split: LLM generates media; Jev provenance verify pass/fail on upload and mint gate
- **Stack:** C2PA, AI Image API, thirdweb NFT Drop, IPFS, TypeSafe Jev
- **Tags:** Generative, NFT, Provenance, Jev, C2PA

---


## Day 27 — The Haunted Contract

- **Vibe:** Haunted mansion, spectral glitch, jack-o'-lantern glow
- **Description:** A Halloween game where ghost agents guard onchain treasure and players must outwit them to win.
- **Brief:** It's Dapptober, so get spooky. Each room of a haunted mansion is guarded by a ghost agent with a personality and a riddle. Players chat with the ghosts to talk, trick, or bribe their way to keys, and each key unlocks part of an onchain treasure chest. Ghosts must follow hard-coded rules enforced by the contract, so prompt injection can't just steal the prize.
- **Features:**
  - Ghost agents with distinct personas and rules
  - Contract-enforced win conditions, not prompt-only
  - Onchain keys and a treasure chest payout
  - Spooky ambient audio and glitch visuals
  - Jev enforces allowed player move types (talk, trick, bribe) before ghost LLM dialogue
- **Stack:** Vercel AI SDK, thirdweb, Solidity, Howler.js, TypeSafe Jev
- **Tags:** Gaming, Agents, Halloween, Jev

---


## Day 28 — The Per-Second Waterfall

- **Vibe:** Liquid waterfall, flowing light, calm motion
- **Description:** Stream money by the second to creators, contributors, and agents for exactly the time or compute used.
- **Brief:** Build streaming payments you can watch. Fans stream USDC to a creator while they're watching, a DAO streams salaries to contributors, and an agent streams payment to a compute provider only while a job runs. Balances tick up in real time as a waterfall of light, and anyone can pause or top up a stream.
- **Features:**
  - Create, pause, and top up payment streams
  - Real-time ticking balances
  - Agent-triggered streams tied to job lifetimes
  - Stream explorer for senders and receivers
  - Jev pause-stream and policy triggers from balance and allowance signals
- **Stack:** Superfluid, USDC, Base, Framer Motion, TypeSafe Jev
- **Tags:** Streaming, Payments, Creators, Jev, Superfluid

---


## Day 29 — The Black Box Recorder

- **Vibe:** Aircraft flight recorder, orange casing, waveform displays
- **Description:** A tamper-evident flight recorder that logs every agent decision and action with signed receipts.
- **Brief:** When an agent does something surprising, you need a flight recorder. Build a logger where each agent step (prompt, tool call, transaction) is hashed, signed, and anchored onchain in batches. An explorer replays the timeline, highlights where the agent went off-course, and proves the log wasn't edited after the fact.
- **Features:**
  - Signed, hashed log entries per agent step
  - Batched onchain anchoring with Merkle roots
  - Timeline replay with drill-down into tool calls
  - Tamper-evidence check for any log range
  - Jev control plane: flag off-policy agent steps and tamper scores on anchored log batches
- **Stack:** Merkle Trees, EAS, Supabase, OpenTelemetry, TypeSafe Jev
- **Tags:** Transparency, Attestations, Observability, Jev, System One, Agents

---


## Day 30 — The Agentic Checkout Mall

- **Vibe:** Vaporwave shopping mall, palm trees, pastel sunsets
- **Description:** A storefront where your AI shopping agent finds, compares, and buys items with stablecoins for you.
- **Brief:** Build both sides of agentic commerce: a merchant storefront that publishes a machine-readable catalog and accepts stablecoin checkout, and a shopping agent that follows the user's budget and preferences, compares options, and buys only after approval. Receipts and refunds settle onchain. Style it as a dreamy vaporwave mall.
- **Features:**
  - Machine-readable product catalog for agents
  - Stablecoin checkout with onchain receipts
  - Shopping agent with budget and approval rules
  - Refund and dispute flow
  - Jev within-budget and allowlist purchase approval before checkout execution
  - Calibrated escalation: low-confidence buys require explicit human approval
  - Jev model-routing for product Q&A vs full shopping-agent planning
- **Stack:** x402 or thirdweb Pay, USDC, Vercel AI SDK, Next.js Commerce, TypeSafe Jev
- **Tags:** Commerce, Stablecoins, Agents, Jev, System One

---


## Day 31 — The Ultimate Agent Architect

- **Vibe:** Blueprint workshop, drafting tables, glowing schematics
- **Description:** A toolkit to design, fund, register, and ship your own crypto-native AI agent in one flow.
- **Brief:** The finale: build a no-code-friendly workshop where anyone assembles an agent from parts. Pick skills (MCP tools), give it a wallet with guardrails, register its identity, set x402 prices for its services, and deploy. The blueprint view shows how every piece connects, and the finished agent gets a public page other agents can discover.
- **Features:**
  - Drag-and-drop skill composer backed by MCP tools
  - Wallet provisioning with policy presets
  - One-click identity registration and pricing
  - Public agent page with live usage stats
  - Jev skill-compatibility and policy-preset choice from the workshop catalog
  - Default agent harness: Jev model-routing plus MCP tool risk checks on every tool call
- **Stack:** MCP, thirdweb, ERC-8004, x402, TypeSafe Jev, LangChain TypeSafeClassifier
- **Tags:** Tools, Creator, Meta, Jev, System One, MCP, x402

---

