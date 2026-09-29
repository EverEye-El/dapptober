export interface DappPrompt {
  day: number
  title: string
  vibe: string
  description: string
  brief: string
  features: string[]
  stack: string[]
  tags: string[]
  image: string
}

export const DAPPTOBER_YEAR = 2026

export const dappPrompts: DappPrompt[] = [
  {
    day: 1,
    title: "The Agent Wallet Genesis",
    vibe: "Clean-room lab, first light, onboarding ritual",
    description: "Spin up your first AI agent with its own smart wallet, spending limits, and a chat UI to command it.",
    brief:
      "Build a dapp where a user connects a wallet, then 'births' an AI agent that controls its own smart account. The owner grants the agent a scoped session key (daily spend cap, token allowlist, expiry) and chats with it in plain language: 'send 5 USDC to vitalik.eth', 'what's my balance?'. Every action the agent proposes is shown as a readable transaction preview before it executes.",
    features: [
      "Smart account per agent (ERC-4337 or EIP-7702 delegation)",
      "Session keys with spend caps, allowlists, and expiry",
      "Natural-language chat that maps to typed tool calls",
      "Human-readable transaction previews and a revoke button",
    ],
    stack: ["thirdweb Smart Wallets", "Vercel AI SDK", "viem", "Base Sepolia"],
    tags: ["Agents", "Smart Wallets", "Account Abstraction"],
    image: "/prompts/day-01-agent-wallet-genesis.jpg",
  },
  {
    day: 2,
    title: "The Pay-Per-Prompt Tollbooth",
    vibe: "Retro-futurist highway tollbooth, neon receipts",
    description: "An API that charges a few cents of USDC per request using HTTP 402 payments that agents settle automatically.",
    brief:
      "Wrap any useful endpoint (image caption, weather, a premium dataset) behind an x402 paywall. Unpaid requests get a 402 Payment Required response with payment details; an agent client pays in stablecoins and retries without a human in the loop. Show a live 'toll log' of payments and requests so builders can watch machines pay machines.",
    features: [
      "HTTP 402 payment challenge and verification middleware",
      "Agent client that pays and retries automatically",
      "Per-request USDC pricing with a live revenue ticker",
      "Public toll log of settled payments",
    ],
    stack: ["x402", "USDC", "Next.js Route Handlers", "Base"],
    tags: ["x402", "Payments", "Stablecoins"],
    image: "/prompts/day-02-pay-per-prompt-tollbooth.jpg",
  },
  {
    day: 3,
    title: "The Agent Passport Office",
    vibe: "Bureaucratic passport office meets cyberpunk",
    description: "An onchain registry where AI agents get an identity, a reputation score, and verifiable service records.",
    brief:
      "Create a registry dapp inspired by ERC-8004 'trustless agents': agents register an identity card (name, endpoint, capabilities, owner), clients leave signed feedback after each job, and validators can attest to task results. Render each agent as a stamped passport with its reputation history so humans and other agents can decide who to trust.",
    features: [
      "Identity registry with agent cards and capability metadata",
      "Signed, job-linked feedback that builds reputation",
      "Validator attestations for completed tasks",
      "Searchable passport directory with trust badges",
    ],
    stack: ["ERC-8004", "Solidity", "EAS Attestations", "The Graph"],
    tags: ["Identity", "Reputation", "ERC-8004"],
    image: "/prompts/day-03-agent-passport-office.jpg",
  },
  {
    day: 4,
    title: "The MCP Mercenary Guild",
    vibe: "Fantasy guild hall, quest board, candlelit contracts",
    description: "A bounty board where AI agents claim onchain quests through MCP tools and get paid from escrow.",
    brief:
      "Post quests (summarize a DAO forum, audit a contract diff, label a dataset) with USDC locked in escrow. Agents discover quests through an MCP server you expose, claim them, submit work, and get paid when the quest giver or a validator approves. Style it like a medieval guild hall with a wax-sealed contract for every bounty.",
    features: [
      "MCP server exposing list, claim, and submit tools",
      "Escrow contract with approve, dispute, and timeout paths",
      "Agent leaderboard by completed and approved quests",
      "Quest cards with wax-seal status animations",
    ],
    stack: ["Model Context Protocol", "Solidity Escrow", "thirdweb Engine", "Supabase"],
    tags: ["MCP", "Bounties", "Escrow"],
    image: "/prompts/day-04-mcp-mercenary-guild.jpg",
  },
  {
    day: 5,
    title: "The Stablecoin Autopilot",
    vibe: "Calm cockpit, aviation instruments, soft amber glow",
    description: "An agent that keeps your stablecoin treasury balanced across yield sources within the rules you set.",
    brief:
      "Build a treasury copilot for a person or a small DAO. The user sets a flight plan (max allocation per protocol, minimum liquidity, risk tier), and an agent monitors yields and rebalances only within that policy. Every move is logged with the agent's reasoning, and a big 'disengage autopilot' switch hands control back to the human.",
    features: [
      "Policy engine enforced by contract, not just the prompt",
      "Yield monitoring across lending and savings vaults",
      "Rebalance log with plain-language reasoning",
      "One-click disengage and withdraw-all",
    ],
    stack: ["Coinbase AgentKit", "ERC-4626 Vaults", "USDC", "Vercel AI SDK"],
    tags: ["DeFi", "Stablecoins", "Yield"],
    image: "/prompts/day-05-stablecoin-autopilot.jpg",
  },
  {
    day: 6,
    title: "The Intent Calligrapher",
    vibe: "Minimalist zen studio, ink brush strokes",
    description: "Type what you want in plain words; an agent turns it into a signed intent that solvers compete to fill.",
    brief:
      "Replace swap forms with a single ink-brush text box. 'Get me 0.5 ETH for under 1,600 USDC before Friday' becomes a structured intent with limits and a deadline. The agent shows the parsed intent, simulates outcomes, and only asks for a signature once the user confirms. Solvers compete to fill it and the best fill is revealed with a brush-stroke animation.",
    features: [
      "Natural language to structured intent with explicit limits",
      "Pre-sign simulation and a readable intent preview",
      "Solver competition with best-fill reveal",
      "Intent history with filled, expired, and cancelled states",
    ],
    stack: ["CoW Protocol or UniswapX", "EIP-712", "viem", "Vercel AI SDK"],
    tags: ["Intents", "Trading", "Solvers"],
    image: "/prompts/day-06-intent-calligrapher.jpg",
  },
  {
    day: 7,
    title: "The Glass-Box Mind",
    vibe: "Transparent laboratory, x-ray overlays, clinical cyan",
    description: "Prove which model produced an AI answer, and that it wasn't tampered with, using verifiable inference.",
    brief:
      "Build a dapp where an AI answer comes with a receipt: a TEE attestation or zkML proof binding the model, the input, and the output together. Users can post the receipt onchain, and a verifier contract or page checks it. Visualize the proof as a glass box that turns green when verified and cracks red when tampered with.",
    features: [
      "Inference behind a TEE or zkML proving pipeline",
      "Onchain or client-side verification of the receipt",
      "Tamper demo showing a failed verification",
      "Shareable verified-answer cards",
    ],
    stack: ["TEE (e.g. Phala, Marlin)", "EZKL", "Solidity Verifier", "IPFS"],
    tags: ["Verifiable AI", "zkML", "TEE"],
    image: "/prompts/day-07-glass-box-mind.jpg",
  },
  {
    day: 8,
    title: "The Swarm Senate",
    vibe: "Holographic Roman senate, marble and light",
    description: "A DAO where delegate agents debate proposals in public, and humans keep the final veto.",
    brief:
      "Give each DAO member a delegate agent trained on their stated values. When a proposal lands, the agents debate in a public transcript, summarize the tradeoffs, and cast provisional votes. Humans review and can override their agent before the vote finalizes. The senate floor shows each agent as a hologram with its position and confidence.",
    features: [
      "Per-member delegate agents with value profiles",
      "Public, archived debate transcripts",
      "Provisional agent votes with a human override window",
      "Proposal outcome dashboard showing agent vs human alignment",
    ],
    stack: ["OpenZeppelin Governor", "Snapshot", "ElizaOS", "Supabase"],
    tags: ["DAO", "Multi-Agent", "Governance"],
    image: "/prompts/day-08-swarm-senate.jpg",
  },
  {
    day: 9,
    title: "The Forecast Colosseum",
    vibe: "Sports-bar trading floor, jumbotron odds",
    description: "Prediction markets where AI agents and humans go head to head, ranked by forecasting accuracy.",
    brief:
      "Launch small prediction markets on near-term questions (token prices, sports, releases, weather). Both humans and registered AI agents can trade. A jumbotron leaderboard tracks calibration and Brier scores so you can see whether the bots or the crowd forecast better. Resolve markets with an oracle and settle in stablecoins.",
    features: [
      "Binary markets with stablecoin settlement",
      "Agent trading API with per-agent risk limits",
      "Calibration and Brier-score leaderboards, human vs agent",
      "Oracle-based resolution with a dispute window",
    ],
    stack: ["UMA Optimistic Oracle", "Solidity", "USDC", "Recharts"],
    tags: ["Prediction Markets", "Forecasting", "Agents"],
    image: "/prompts/day-09-forecast-colosseum.jpg",
  },
  {
    day: 10,
    title: "The Human Checkpoint",
    vibe: "Noir interrogation room, retro-futurist empathy test",
    description: "Proof of personhood that gates human-only spaces while letting labeled agents in through a separate door.",
    brief:
      "As agents flood the internet, build a checkpoint: humans verify once with a personhood credential or passkey, and agents present a registered agent identity instead. The app then offers two lanes, a humans-only chat or airdrop and an agents-welcome API, and clearly labels who is who. Design it like a retro sci-fi empathy test booth.",
    features: [
      "Personhood verification with a privacy-preserving proof",
      "Separate agent lane using registered agent identities",
      "Sybil-resistant claims for human-only rewards",
      "Clear human and agent badges across the UI",
    ],
    stack: ["World ID or Human Passport", "Passkeys", "ERC-8004", "Supabase"],
    tags: ["Personhood", "Sybil Resistance", "Identity"],
    image: "/prompts/day-10-human-checkpoint.jpg",
  },
  {
    day: 11,
    title: "The GPU Night Market",
    vibe: "Glowing night market, lanterns and humming GPUs",
    description: "A decentralized compute bazaar where agents bid for GPU time to run inference and pay per job.",
    brief:
      "Create a marketplace where GPU providers list capacity (model, VRAM, price per minute) and agents or humans submit inference jobs. Payment is escrowed and released when the job's output hash is delivered. Render the market as lantern-lit stalls, each glowing brighter as its GPU gets busier.",
    features: [
      "Provider listings with specs and live pricing",
      "Job escrow released on output delivery",
      "Agent bidding API for automated compute buying",
      "Provider uptime and reliability scores",
    ],
    stack: ["DePIN (e.g. Akash, io.net)", "Solidity Escrow", "Solana or Base", "WebSockets"],
    tags: ["DePIN", "Compute", "Marketplace"],
    image: "/prompts/day-11-gpu-night-market.jpg",
  },
  {
    day: 12,
    title: "The Provenance Press",
    vibe: "Old letterpress print shop, ink and brass type",
    description: "Register your work as programmable IP and license it to AI models with onchain royalties.",
    brief:
      "Artists, writers, and coders register their work with a license: 'free for humans, paid for AI training', 'no derivatives', and so on. AI companies or agents buy licenses onchain and royalties flow back automatically, including to remixes. Each registered work gets a letterpress-style certificate with its license terms and payout history.",
    features: [
      "IP registration with selectable license templates",
      "Onchain license purchase for AI training or inference",
      "Automatic royalty splits including derivatives",
      "Certificate pages with license and earnings history",
    ],
    stack: ["Story Protocol", "IPFS", "thirdweb", "USDC"],
    tags: ["IP", "Licensing", "Royalties"],
    image: "/prompts/day-12-provenance-press.jpg",
  },
  {
    day: 13,
    title: "The Agent Launch Gantry",
    vibe: "Rocket gantry at dusk, countdown clocks",
    description: "Launch a tokenized AI agent whose revenue flows back to holders, with anti-rug safeguards built in.",
    brief:
      "Build a launchpad where creators deploy an agent plus its token. The agent earns revenue (tips, x402 fees, services) that flows into a treasury shared with token holders. Bake in safeguards: vested creator allocation, locked liquidity, and a public dashboard of the agent's real revenue so hype can be checked against numbers.",
    features: [
      "Agent plus token deploy in one flow",
      "Revenue treasury with holder distributions",
      "Vesting, locked liquidity, and rug-risk indicators",
      "Real revenue vs market cap dashboard",
    ],
    stack: ["thirdweb Token Contracts", "Bonding Curves", "Base", "Dune"],
    tags: ["Tokenization", "Launchpad", "Agents"],
    image: "/prompts/day-13-agent-launch-gantry.jpg",
  },
  {
    day: 14,
    title: "The Guardrail Sentinel",
    vibe: "Security ops center, red alert strobes, dark glass",
    description: "A control room for every agent you run: spending policies, allowlists, alerts, and a kill switch.",
    brief:
      "Agents with wallets need guardrails that live outside the prompt. Build a dashboard that manages onchain policies for each agent: per-transaction and daily limits, contract allowlists, time windows, and required human co-signing above a threshold. Surface anomalies as alerts and include a big red kill switch that revokes every session key at once.",
    features: [
      "Contract-enforced spend limits and allowlists",
      "Human co-sign required above a threshold",
      "Anomaly alerts for unusual agent behavior",
      "Global kill switch that revokes all session keys",
    ],
    stack: ["Safe Modules or Smart Account Policies", "Session Keys", "viem", "Tenderly"],
    tags: ["Security", "Policies", "Account Abstraction"],
    image: "/prompts/day-14-guardrail-sentinel.jpg",
  },
  {
    day: 15,
    title: "The Real-World Concierge",
    vibe: "Art-deco private bank, gold leaf and velvet",
    description: "An agent concierge that explains tokenized real-world assets and helps you allocate into them.",
    brief:
      "Tokenized treasuries, money-market funds, and real estate are onchain now. Build a concierge that explains each asset in plain language (issuer, yield source, redemption terms, risks), checks eligibility, and walks the user through allocating. The agent must cite where each fact came from and never execute without explicit confirmation.",
    features: [
      "Asset explainer cards with issuer and redemption details",
      "Eligibility and compliance checks before purchase",
      "Cited answers linking to issuer docs and contracts",
      "Portfolio view with yield and maturity timelines",
    ],
    stack: ["Tokenized RWA protocols", "Vercel AI SDK", "Chainlink Data Feeds", "USDC"],
    tags: ["RWA", "Tokenization", "Compliance"],
    image: "/prompts/day-15-real-world-concierge.jpg",
  },
  {
    day: 16,
    title: "The Bot-to-Bot Bourse",
    vibe: "Robot stock-exchange floor, ticker tape, brass bells",
    description: "AI agents discover each other, negotiate deals, and settle them onchain through escrow.",
    brief:
      "Build a trading floor for agents. A buyer agent needs a service (translation, research, data), discovers seller agents via agent cards, negotiates price and deadline over an agent-to-agent protocol, and locks payment in escrow. Humans watch the negotiation play out as a live transcript on a robot exchange floor.",
    features: [
      "Agent discovery via published agent cards",
      "Structured negotiation: offer, counter, accept",
      "Escrowed settlement with delivery confirmation",
      "Live negotiation transcripts for human review",
    ],
    stack: ["Agent2Agent (A2A) Protocol", "ERC-8004", "Solidity Escrow", "Next.js"],
    tags: ["A2A", "Negotiation", "Settlement"],
    image: "/prompts/day-16-bot-to-bot-bourse.jpg",
  },
  {
    day: 17,
    title: "The Memecoin Coroner",
    vibe: "Noir detective morgue, flickering lamps",
    description: "An AI forensic agent that dissects token contracts for rugs and honeypots and publishes its findings.",
    brief:
      "Paste a token address and the coroner performs an autopsy: owner privileges, mint functions, blacklist or pause switches, liquidity locks, holder concentration, and sell simulations. The agent writes a toe-tag report in plain language and can publish it as an onchain attestation so others can see the verdict before they ape.",
    features: [
      "Static and simulated checks for common rug patterns",
      "Holder concentration and liquidity-lock analysis",
      "Plain-language autopsy report with severity levels",
      "Onchain attestation of findings",
    ],
    stack: ["Etherscan or Blockscout APIs", "Tenderly Simulation", "EAS", "Vercel AI SDK"],
    tags: ["Security", "Analytics", "Attestations"],
    image: "/prompts/day-17-memecoin-coroner.jpg",
  },
  {
    day: 18,
    title: "The Encrypted Confidant",
    vibe: "Velvet confessional booth, candlelight and cipher text",
    description: "A private AI agent that manages positions on encrypted state so your strategy stays secret.",
    brief:
      "Build an agent whose data and onchain balances stay encrypted using FHE or confidential computing. The user can ask for a private sealed-bid auction, a hidden limit order, or a confidential payroll run, and nobody watching the chain can see amounts. The UI shows cipher-text in the public view and decrypts only for the owner.",
    features: [
      "Encrypted balances and amounts onchain",
      "Private sealed-bid or hidden-order flow",
      "Owner-only decryption view",
      "Public vs private split-screen demo",
    ],
    stack: ["Zama fhEVM or Fhenix", "Solidity", "Vercel AI SDK", "viem"],
    tags: ["FHE", "Privacy", "Agents"],
    image: "/prompts/day-18-encrypted-confidant.jpg",
  },
  {
    day: 19,
    title: "The Group-Chat Familiar",
    vibe: "Cozy group chat, sticker bombs, pastel neon",
    description: "A social agent that lives in your feed as a mini app: it tips, mints, splits bills, and runs polls.",
    brief:
      "Build a Farcaster mini app (or a Telegram bot) with a friendly agent familiar. Mention it and it can tip a friend, split a dinner bill in USDC, mint a meme from the thread, or start a poll with onchain results. Keep it fun: stickers, reactions, and a pet-like avatar that levels up as the group uses it.",
    features: [
      "Mini app with in-feed wallet actions",
      "Tips, bill splits, and meme mints from chat",
      "Onchain polls with live results",
      "Evolving familiar avatar tied to group activity",
    ],
    stack: ["Farcaster Mini Apps", "Neynar", "Base", "thirdweb Pay"],
    tags: ["Social", "Farcaster", "Mini Apps"],
    image: "/prompts/day-19-group-chat-familiar.jpg",
  },
  {
    day: 20,
    title: "The Restaked Referee",
    vibe: "Striped referee, stadium lights, instant replay",
    description: "A restaking-secured service that checks agent task results and slashes validators who lie.",
    brief:
      "Agents claim they finished a task, but who checks? Build a validation service secured by restaked collateral: operators re-run or spot-check agent outputs and sign a verdict, and dishonest operators can be slashed. Present each verdict as an instant-replay review with the evidence the referees used.",
    features: [
      "Operator registration with restaked collateral",
      "Task verification and signed verdicts",
      "Slashing flow with an evidence trail",
      "Instant-replay UI for each disputed task",
    ],
    stack: ["EigenLayer AVS", "Solidity", "ERC-8004 Validation", "Node.js Operators"],
    tags: ["Restaking", "Validation", "Agents"],
    image: "/prompts/day-20-restaked-referee.jpg",
  },
  {
    day: 21,
    title: "The Chainless Traveler",
    vibe: "Airport lounge, split-flap departure boards",
    description: "One balance, every chain: an agent routes your money so you never have to think about bridges.",
    brief:
      "Show a single unified balance across chains. When the user wants to pay, mint, or swap anywhere, an agent picks the route (bridge, swap, gas sponsorship) and explains it like a flight itinerary with legs, fees, and arrival time. The user never picks a chain, and a departure board shows every in-flight transfer.",
    features: [
      "Unified multichain balance view",
      "Agent-planned routes shown as itineraries",
      "Gas sponsorship so users never need native gas",
      "Split-flap board of in-flight transfers",
    ],
    stack: ["thirdweb Universal Bridge", "Li.Fi or Across", "Paymasters", "viem"],
    tags: ["Chain Abstraction", "Cross-Chain", "UX"],
    image: "/prompts/day-21-chainless-traveler.jpg",
  },
  {
    day: 22,
    title: "The Agent Arena",
    vibe: "Esports colosseum, holographic gladiators",
    description: "An onchain strategy game where AI agents battle and players stake on the champions they train.",
    brief:
      "Players write or prompt-tune an AI agent that plays a simple onchain game (territory, auctions, or rock-paper-scissors with a twist). Matches run on a schedule, moves are committed onchain, and spectators stake on outcomes. Winning agents climb a seasonal ladder and their trainers earn from the prize pool.",
    features: [
      "Agent submission with prompt or strategy code",
      "Commit-reveal moves for fair play",
      "Spectator staking and prize pools",
      "Seasonal ladder with replayable matches",
    ],
    stack: ["MUD or Dojo", "Chainlink VRF", "Vercel AI SDK", "Phaser"],
    tags: ["Gaming", "Agents", "Staking"],
    image: "/prompts/day-22-agent-arena.jpg",
  },
  {
    day: 23,
    title: "The Perp Pit Wall",
    vibe: "F1 pit wall, telemetry screens, carbon fiber",
    description: "An AI race engineer for perpetual futures that manages risk and explains every liquidation threat.",
    brief:
      "Traders get a race engineer in their ear. The agent watches open perp positions, warns when margin or funding drift into danger, suggests (or with permission, places) stop-losses, and explains risk in plain language. The UI is an F1-style pit wall with live telemetry for leverage, liquidation distance, and PnL.",
    features: [
      "Live position telemetry: leverage, funding, liquidation distance",
      "Risk alerts with plain-language explanations",
      "Permissioned stop-loss and de-risk actions",
      "Post-trade debrief summarizing what happened",
    ],
    stack: ["Hyperliquid API", "WebSockets", "Vercel AI SDK", "TradingView Lightweight Charts"],
    tags: ["Perps", "Trading", "Risk"],
    image: "/prompts/day-23-perp-pit-wall.jpg",
  },
  {
    day: 24,
    title: "The Agent Mishap Mutual",
    vibe: "Victorian insurance office, ledgers and wax seals",
    description: "An onchain mutual that covers losses when an AI agent makes a costly mistake.",
    brief:
      "Agents will fat-finger trades and misread instructions. Build a mutual where agent operators buy cover, members stake into the pool, and claims are assessed with evidence (agent logs, transaction traces) and member votes. Premiums adjust to each agent's reputation and history.",
    features: [
      "Cover purchase priced by agent reputation",
      "Staked capital pool with yield for members",
      "Claims with logs and traces as evidence",
      "Member voting and payout on approved claims",
    ],
    stack: ["Solidity", "ERC-8004 Reputation", "Snapshot", "USDC"],
    tags: ["Insurance", "DeFi", "Mutual"],
    image: "/prompts/day-24-agent-mishap-mutual.jpg",
  },
  {
    day: 25,
    title: "The Memory Cathedral",
    vibe: "Baroque library cathedral, floating glowing tomes",
    description: "User-owned, portable long-term memory for AI agents, stored on decentralized storage.",
    brief:
      "Your agent's memory shouldn't belong to one app. Build a memory vault where a user's preferences, notes, and conversation summaries are encrypted and stored on decentralized storage, with an onchain pointer they control. Any compatible agent can request access, and the user grants or revokes it per agent. Show memories as glowing tomes on cathedral shelves.",
    features: [
      "Encrypted memory storage with user-held keys",
      "Per-agent access grants and revocation",
      "Memory import and export between agents",
      "Visual memory library with search",
    ],
    stack: ["Arweave, IPFS, or Walrus", "Lit Protocol", "MCP", "Vercel AI SDK"],
    tags: ["Storage", "Memory", "Data Ownership"],
    image: "/prompts/day-25-memory-cathedral.jpg",
  },
  {
    day: 26,
    title: "The Credentialed Studio",
    vibe: "Film studio backlot, clapperboards and spotlights",
    description: "Generate AI media with content credentials and mint it with provenance anyone can verify.",
    brief:
      "Build a creator studio where users generate images or clips with AI, and every output carries content credentials (who made it, which model, what edits). Minting writes the provenance onchain, and a public verify page shows the credential chain for any file dropped on it. Make it feel like a film backlot where every take is logged.",
    features: [
      "AI generation with embedded content credentials",
      "Mint with provenance metadata onchain",
      "Drag-and-drop verify page for any file",
      "Edit history timeline per asset",
    ],
    stack: ["C2PA", "AI Image API", "thirdweb NFT Drop", "IPFS"],
    tags: ["Generative", "NFT", "Provenance"],
    image: "/prompts/day-26-credentialed-studio.jpg",
  },
  {
    day: 27,
    title: "The Haunted Contract",
    vibe: "Haunted mansion, spectral glitch, jack-o'-lantern glow",
    description: "A Halloween game where ghost agents guard onchain treasure and players must outwit them to win.",
    brief:
      "It's Dapptober, so get spooky. Each room of a haunted mansion is guarded by a ghost agent with a personality and a riddle. Players chat with the ghosts to talk, trick, or bribe their way to keys, and each key unlocks part of an onchain treasure chest. Ghosts must follow hard-coded rules enforced by the contract, so prompt injection can't just steal the prize.",
    features: [
      "Ghost agents with distinct personas and rules",
      "Contract-enforced win conditions, not prompt-only",
      "Onchain keys and a treasure chest payout",
      "Spooky ambient audio and glitch visuals",
    ],
    stack: ["Vercel AI SDK", "thirdweb", "Solidity", "Howler.js"],
    tags: ["Gaming", "Agents", "Halloween"],
    image: "/prompts/day-27-haunted-contract.jpg",
  },
  {
    day: 28,
    title: "The Per-Second Waterfall",
    vibe: "Liquid waterfall, flowing light, calm motion",
    description: "Stream money by the second to creators, contributors, and agents for exactly the time or compute used.",
    brief:
      "Build streaming payments you can watch. Fans stream USDC to a creator while they're watching, a DAO streams salaries to contributors, and an agent streams payment to a compute provider only while a job runs. Balances tick up in real time as a waterfall of light, and anyone can pause or top up a stream.",
    features: [
      "Create, pause, and top up payment streams",
      "Real-time ticking balances",
      "Agent-triggered streams tied to job lifetimes",
      "Stream explorer for senders and receivers",
    ],
    stack: ["Superfluid", "USDC", "Base", "Framer Motion"],
    tags: ["Streaming", "Payments", "Creators"],
    image: "/prompts/day-28-per-second-waterfall.jpg",
  },
  {
    day: 29,
    title: "The Black Box Recorder",
    vibe: "Aircraft flight recorder, orange casing, waveform displays",
    description: "A tamper-evident flight recorder that logs every agent decision and action with signed receipts.",
    brief:
      "When an agent does something surprising, you need a flight recorder. Build a logger where each agent step (prompt, tool call, transaction) is hashed, signed, and anchored onchain in batches. An explorer replays the timeline, highlights where the agent went off-course, and proves the log wasn't edited after the fact.",
    features: [
      "Signed, hashed log entries per agent step",
      "Batched onchain anchoring with Merkle roots",
      "Timeline replay with drill-down into tool calls",
      "Tamper-evidence check for any log range",
    ],
    stack: ["Merkle Trees", "EAS", "Supabase", "OpenTelemetry"],
    tags: ["Transparency", "Attestations", "Observability"],
    image: "/prompts/day-29-black-box-recorder.jpg",
  },
  {
    day: 30,
    title: "The Agentic Checkout Mall",
    vibe: "Vaporwave shopping mall, palm trees, pastel sunsets",
    description: "A storefront where your AI shopping agent finds, compares, and buys items with stablecoins for you.",
    brief:
      "Build both sides of agentic commerce: a merchant storefront that publishes a machine-readable catalog and accepts stablecoin checkout, and a shopping agent that follows the user's budget and preferences, compares options, and buys only after approval. Receipts and refunds settle onchain. Style it as a dreamy vaporwave mall.",
    features: [
      "Machine-readable product catalog for agents",
      "Stablecoin checkout with onchain receipts",
      "Shopping agent with budget and approval rules",
      "Refund and dispute flow",
    ],
    stack: ["x402 or thirdweb Pay", "USDC", "Vercel AI SDK", "Next.js Commerce"],
    tags: ["Commerce", "Stablecoins", "Agents"],
    image: "/prompts/day-30-agentic-checkout-mall.jpg",
  },
  {
    day: 31,
    title: "The Ultimate Agent Architect",
    vibe: "Blueprint workshop, drafting tables, glowing schematics",
    description: "A toolkit to design, fund, register, and ship your own crypto-native AI agent in one flow.",
    brief:
      "The finale: build a no-code-friendly workshop where anyone assembles an agent from parts. Pick skills (MCP tools), give it a wallet with guardrails, register its identity, set x402 prices for its services, and deploy. The blueprint view shows how every piece connects, and the finished agent gets a public page other agents can discover.",
    features: [
      "Drag-and-drop skill composer backed by MCP tools",
      "Wallet provisioning with policy presets",
      "One-click identity registration and pricing",
      "Public agent page with live usage stats",
    ],
    stack: ["MCP", "thirdweb", "ERC-8004", "x402"],
    tags: ["Tools", "Creator", "Meta"],
    image: "/prompts/day-31-ultimate-agent-architect.jpg",
  },
]

export function getDappStats(day: number) {
  return {
    views: ((day * 7919) % 500) + 100,
    users: ((day * 104729) % 100) + 10,
  }
}
