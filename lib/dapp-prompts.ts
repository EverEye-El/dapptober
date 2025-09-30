export interface DappPrompt {
  day: number
  title: string
  vibe: string
  description: string
  tags: string[]
  image: string
}

export const dappPrompts: DappPrompt[] = [
  {
    day: 1,
    title: "The Nostalgic Pixelator",
    vibe: "Retro gaming, 8-bit, early internet",
    description: "A Dapp that allows users to tokenize retro game assets or create pixel art NFTs.",
    tags: ["NFT", "Retro", "Gaming"],
    image: "/prompts/day-01-nostalgic-pixelator.jpg",
  },
  {
    day: 2,
    title: "The Ethereal Dream Weaver",
    vibe: "Soft, ambient, generative art, calm",
    description:
      "A Dapp for collaboratively generating evolving, on-chain ambient soundscapes or visual art based on community input.",
    tags: ["Generative", "Art", "Community"],
    image: "/prompts/day-02-ethereal-dream-weaver.jpg",
  },
  {
    day: 3,
    title: "The Cyberpunk Syndicate",
    vibe: "Gritty, neon-noir, DAOs, digital resistance",
    description:
      "A DAO creation tool tailored for clandestine digital groups, focused on secure communication and collective action.",
    tags: ["DAO", "Privacy", "Governance"],
    image: "/prompts/day-03-cyberpunk-syndicate.jpg",
  },
  {
    day: 4,
    title: "The Alchemist's Brew",
    vibe: "Fantasy, magic, crafting, experimental DeFi",
    description: "A Dapp that allows users to 'brew' new synthetic assets by combining existing tokens in novel ways.",
    tags: ["DeFi", "Synthetic", "Crafting"],
    image: "/prompts/day-04-alchemists-brew.jpg",
  },
  {
    day: 5,
    title: "The Stargazer's Ledger",
    vibe: "Cosmic, celestial, exploration, data visualization",
    description:
      "A Dapp that visualizes blockchain data (transactions, gas fees, new contracts) as a constantly shifting galaxy.",
    tags: ["Analytics", "Visualization", "Data"],
    image: "/prompts/day-05-stargazers-ledger.jpg",
  },
  {
    day: 6,
    title: "The Bountiful Harvest",
    vibe: "Rural, community gardening, sustainable finance, yield farming",
    description:
      "A Dapp for local communities to collectively fund and manage urban farms, sharing profits via tokens.",
    tags: ["Community", "Sustainability", "Yield"],
    image: "/prompts/day-06-bountiful-harvest.jpg",
  },
  {
    day: 7,
    title: "The Clockwork Archivist",
    vibe: "Steampunk, historical, immutable records, decentralized storage",
    description:
      "A Dapp for archiving historical documents or personal journals immutably on a decentralized storage network.",
    tags: ["Storage", "Archive", "IPFS"],
    image: "/prompts/day-07-clockwork-archivist.jpg",
  },
  {
    day: 8,
    title: "The Quantum Conundrum",
    vibe: "Futuristic, abstract, complex puzzles, zero-knowledge proofs",
    description: "A Dapp featuring a series of on-chain logic puzzles that require cryptographic proofs to solve.",
    tags: ["ZK-Proofs", "Puzzles", "Gaming"],
    image: "/prompts/day-08-quantum-conundrum.jpg",
  },
  {
    day: 9,
    title: "The Nomadic Marketplace",
    vibe: "Bohemian, travel, peer-to-peer, local services",
    description:
      "A decentralized marketplace for local services or unique handmade goods, discoverable by geographic location.",
    tags: ["Marketplace", "P2P", "Local"],
    image: "/prompts/day-09-nomadic-marketplace.jpg",
  },
  {
    day: 10,
    title: "The Runic Oracle",
    vibe: "Ancient, mystical, prediction markets, randomized outcomes",
    description:
      "A Dapp that acts as a decentralized oracle for random numbers or sports predictions, using on-chain randomness.",
    tags: ["Oracle", "Prediction", "Random"],
    image: "/prompts/day-10-runic-oracle.jpg",
  },
  {
    day: 11,
    title: "The Digital Canvas",
    vibe: "Modern art gallery, collaborative painting, generative NFTs",
    description: "A collaborative digital canvas where users can draw on-chain, and segments become composable NFTs.",
    tags: ["NFT", "Collaborative", "Art"],
    image: "/prompts/day-11-digital-canvas.jpg",
  },
  {
    day: 12,
    title: "The Eco-Guardian's Pledge",
    vibe: "Nature, environmentalism, carbon credits, impact DAOs",
    description: "A Dapp for tracking and funding ecological conservation efforts, verifiable via blockchain.",
    tags: ["Impact", "Environment", "DAO"],
    image: "/prompts/day-12-eco-guardians-pledge.jpg",
  },
  {
    day: 13,
    title: "The Glitch & Code",
    vibe: "Digital art, error aesthetics, experimental music, token-gated content",
    description:
      "A Dapp that offers exclusive access to experimental music or digital art pieces based on NFT ownership.",
    tags: ["Token-Gating", "Music", "Art"],
    image: "/prompts/day-13-glitch-and-code.jpg",
  },
  {
    day: 14,
    title: "The Artisan's Guild",
    vibe: "Craftsmanship, mentorship, skill sharing, decentralized education",
    description:
      "A Dapp for skilled artisans to offer on-chain apprenticeships or workshops, with reputation tied to NFTs.",
    tags: ["Education", "NFT", "Community"],
    image: "/prompts/day-14-artisans-guild.jpg",
  },
  {
    day: 15,
    title: "The Celestial Chartographer",
    vibe: "Space exploration, mapping, collective data, decentralized science",
    description:
      "A Dapp for citizen scientists to contribute astronomical observations, earning tokens for verified data.",
    tags: ["DeSci", "Space", "Data"],
    image: "/prompts/day-15-celestial-chartographer.jpg",
  },
  {
    day: 16,
    title: "The Urban Explorer's Log",
    vibe: "City streets, hidden gems, augmented reality, location-based NFTs",
    description: "A Dapp for discovering and minting NFTs at specific real-world locations or landmarks.",
    tags: ["NFT", "Location", "AR"],
    image: "/prompts/day-16-urban-explorers-log.jpg",
  },
  {
    day: 17,
    title: "The Harmony Hub",
    vibe: "Music, collaboration, royalty distribution, fan engagement",
    description:
      "A Dapp for musicians to co-create tracks, manage royalties, and engage directly with their fan community.",
    tags: ["Music", "Royalties", "Collaboration"],
    image: "/prompts/day-17-harmony-hub.jpg",
  },
  {
    day: 18,
    title: "The Cryptic Dispatch",
    vibe: "Espionage, secret messages, encrypted communication, private transactions",
    description: "A Dapp for sending private, verifiable messages or data parcels using zero-knowledge proofs.",
    tags: ["Privacy", "ZK-Proofs", "Messaging"],
    image: "/prompts/day-18-cryptic-dispatch.jpg",
  },
  {
    day: 19,
    title: "The Time-Worn Tavern",
    vibe: "Cozy, community gathering, micro-DAO, on-chain social club",
    description: "A Dapp for a small, token-gated social club where members can propose and vote on activities.",
    tags: ["Social", "DAO", "Community"],
    image: "/prompts/day-19-time-worn-tavern.jpg",
  },
  {
    day: 20,
    title: "The Infinite Library",
    vibe: "Knowledge, learning, open access, decentralized publishing",
    description:
      "A Dapp for decentralized publishing of books or research papers, with author royalties managed on-chain.",
    tags: ["Publishing", "Knowledge", "Royalties"],
    image: "/prompts/day-20-infinite-library.jpg",
  },
  {
    day: 21,
    title: "The Biometric Vault",
    vibe: "Secure, personal data, digital identity, self-sovereign identity",
    description:
      "A Dapp for users to manage their verifiable digital credentials and personal data with privacy in mind.",
    tags: ["Identity", "Privacy", "SSI"],
    image: "/prompts/day-21-biometric-vault.jpg",
  },
  {
    day: 22,
    title: "The Gamified Gauntlet",
    vibe: "Web3 gaming, challenges, leaderboards, play-to-earn",
    description:
      "A Dapp that hosts a series of on-chain micro-games or challenges with token rewards and a dynamic leaderboard.",
    tags: ["Gaming", "P2E", "Challenges"],
    image: "/prompts/day-22-gamified-gauntlet.jpg",
  },
  {
    day: 23,
    title: "The Prophecy Engine",
    vibe: "Futures, speculation, prediction markets, data analysis",
    description:
      "A Dapp that allows users to create and participate in novel prediction markets on various real-world events.",
    tags: ["Prediction", "Markets", "Oracle"],
    image: "/prompts/day-23-prophecy-engine.jpg",
  },
  {
    day: 24,
    title: "The Galactic Diplomat",
    vibe: "Sci-fi, governance, inter-chain communication, DAOs",
    description: "A Dapp for managing inter-blockchain governance proposals or cross-chain asset transfers.",
    tags: ["Cross-Chain", "Governance", "Bridge"],
    image: "/prompts/day-24-galactic-diplomat.jpg",
  },
  {
    day: 25,
    title: "The Meme Manifesto",
    vibe: "Internet culture, viral content, community-owned memes, social tokens",
    description:
      "A Dapp for creating, curating, and collectively owning meme content, with creators earning from virality.",
    tags: ["Social", "Memes", "Tokens"],
    image: "/prompts/day-25-meme-manifesto.jpg",
  },
  {
    day: 26,
    title: "The Data Dynamo",
    vibe: "Analytics, insights, data ownership, decentralized data markets",
    description:
      "A Dapp that allows users to sell access to their anonymized personal data or contribute to collective data sets.",
    tags: ["Data", "Privacy", "Marketplace"],
    image: "/prompts/day-26-data-dynamo.jpg",
  },
  {
    day: 27,
    title: "The Phantom Gallery",
    vibe: "Ephemeral art, digital hauntings, time-locked NFTs, hidden content",
    description:
      "A Dapp for creating NFTs that reveal new content or change over time, or disappear after a certain condition.",
    tags: ["NFT", "Dynamic", "Art"],
    image: "/prompts/day-27-phantom-gallery.jpg",
  },
  {
    day: 28,
    title: "The Decentralized Dispatcher",
    vibe: "Logistics, supply chain, transparency, verifiable data",
    description:
      "A Dapp for tracking supply chain assets from origin to consumer, ensuring transparency and authenticity.",
    tags: ["Supply Chain", "Tracking", "Transparency"],
    image: "/prompts/day-28-decentralized-dispatcher.jpg",
  },
  {
    day: 29,
    title: "The Sovereign Citizen's Toolkit",
    vibe: "Self-governance, digital democracy, voting, identity",
    description:
      "A Dapp offering tools for secure, on-chain voting or managing digital identities for local communities.",
    tags: ["Voting", "Identity", "Democracy"],
    image: "/prompts/day-29-sovereign-citizens-toolkit.jpg",
  },
  {
    day: 30,
    title: "The Digital Flora & Fauna",
    vibe: "Nature, biodiversity, generative life, evolving NFTs",
    description:
      "A Dapp that generates unique, evolving digital organisms or plants as NFTs, which 'grow' or change based on interactions.",
    tags: ["NFT", "Generative", "Evolution"],
    image: "/prompts/day-30-digital-flora-fauna.jpg",
  },
  {
    day: 31,
    title: "The Ultimate Vibe Architect",
    vibe: "Meta, customizable, creator tools, open-ended",
    description:
      "A Dapp that acts as a toolkit for creating new 'vibe-coded' micro-Dapps, allowing users to define aesthetics and functionality.",
    tags: ["Tools", "Creator", "Meta"],
    image: "/prompts/day-31-ultimate-vibe-architect.jpg",
  },
]
