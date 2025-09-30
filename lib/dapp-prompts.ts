export interface DappPrompt {
  day: number
  title: string
  vibe: string
  description: string
  tags: string[]
  imageQuery: string
}

export const dappPrompts: DappPrompt[] = [
  {
    day: 1,
    title: "The Nostalgic Pixelator",
    vibe: "Retro gaming, 8-bit, early internet",
    description: "A Dapp that allows users to tokenize retro game assets or create pixel art NFTs.",
    tags: ["NFT", "Retro", "Gaming"],
    imageQuery: "retro 8-bit pixel art gaming neon purple pink",
  },
  {
    day: 2,
    title: "The Ethereal Dream Weaver",
    vibe: "Soft, ambient, generative art, calm",
    description:
      "A Dapp for collaboratively generating evolving, on-chain ambient soundscapes or visual art based on community input.",
    tags: ["Generative", "Art", "Community"],
    imageQuery: "ethereal dreamy ambient art soft colors flowing",
  },
  {
    day: 3,
    title: "The Cyberpunk Syndicate",
    vibe: "Gritty, neon-noir, DAOs, digital resistance",
    description:
      "A DAO creation tool tailored for clandestine digital groups, focused on secure communication and collective action.",
    tags: ["DAO", "Privacy", "Governance"],
    imageQuery: "cyberpunk neon city night purple pink cyan",
  },
  {
    day: 4,
    title: "The Alchemist's Brew",
    vibe: "Fantasy, magic, crafting, experimental DeFi",
    description: "A Dapp that allows users to 'brew' new synthetic assets by combining existing tokens in novel ways.",
    tags: ["DeFi", "Synthetic", "Crafting"],
    imageQuery: "fantasy alchemy potions magic glowing liquids",
  },
  {
    day: 5,
    title: "The Stargazer's Ledger",
    vibe: "Cosmic, celestial, exploration, data visualization",
    description:
      "A Dapp that visualizes blockchain data (transactions, gas fees, new contracts) as a constantly shifting galaxy.",
    tags: ["Analytics", "Visualization", "Data"],
    imageQuery: "cosmic space galaxy stars nebula purple blue",
  },
  {
    day: 6,
    title: "The Bountiful Harvest",
    vibe: "Rural, community gardening, sustainable finance, yield farming",
    description:
      "A Dapp for local communities to collectively fund and manage urban farms, sharing profits via tokens.",
    tags: ["Community", "Sustainability", "Yield"],
    imageQuery: "urban garden harvest plants sustainable green",
  },
  {
    day: 7,
    title: "The Clockwork Archivist",
    vibe: "Steampunk, historical, immutable records, decentralized storage",
    description:
      "A Dapp for archiving historical documents or personal journals immutably on a decentralized storage network.",
    tags: ["Storage", "Archive", "IPFS"],
    imageQuery: "steampunk clockwork gears vintage archive",
  },
  {
    day: 8,
    title: "The Quantum Conundrum",
    vibe: "Futuristic, abstract, complex puzzles, zero-knowledge proofs",
    description: "A Dapp featuring a series of on-chain logic puzzles that require cryptographic proofs to solve.",
    tags: ["ZK-Proofs", "Puzzles", "Gaming"],
    imageQuery: "quantum abstract futuristic glowing particles",
  },
  {
    day: 9,
    title: "The Nomadic Marketplace",
    vibe: "Bohemian, travel, peer-to-peer, local services",
    description:
      "A decentralized marketplace for local services or unique handmade goods, discoverable by geographic location.",
    tags: ["Marketplace", "P2P", "Local"],
    imageQuery: "bohemian marketplace colorful travel nomadic",
  },
  {
    day: 10,
    title: "The Runic Oracle",
    vibe: "Ancient, mystical, prediction markets, randomized outcomes",
    description:
      "A Dapp that acts as a decentralized oracle for random numbers or sports predictions, using on-chain randomness.",
    tags: ["Oracle", "Prediction", "Random"],
    imageQuery: "mystical runes ancient symbols glowing magic",
  },
  {
    day: 11,
    title: "The Digital Canvas",
    vibe: "Modern art gallery, collaborative painting, generative NFTs",
    description: "A collaborative digital canvas where users can draw on-chain, and segments become composable NFTs.",
    tags: ["NFT", "Collaborative", "Art"],
    imageQuery: "digital canvas modern art colorful painting",
  },
  {
    day: 12,
    title: "The Eco-Guardian's Pledge",
    vibe: "Nature, environmentalism, carbon credits, impact DAOs",
    description: "A Dapp for tracking and funding ecological conservation efforts, verifiable via blockchain.",
    tags: ["Impact", "Environment", "DAO"],
    imageQuery: "nature forest eco green conservation earth",
  },
  {
    day: 13,
    title: "The Glitch & Code",
    vibe: "Digital art, error aesthetics, experimental music, token-gated content",
    description:
      "A Dapp that offers exclusive access to experimental music or digital art pieces based on NFT ownership.",
    tags: ["Token-Gating", "Music", "Art"],
    imageQuery: "glitch art digital error aesthetic neon",
  },
  {
    day: 14,
    title: "The Artisan's Guild",
    vibe: "Craftsmanship, mentorship, skill sharing, decentralized education",
    description:
      "A Dapp for skilled artisans to offer on-chain apprenticeships or workshops, with reputation tied to NFTs.",
    tags: ["Education", "NFT", "Community"],
    imageQuery: "artisan crafts workshop tools handmade",
  },
  {
    day: 15,
    title: "The Celestial Chartographer",
    vibe: "Space exploration, mapping, collective data, decentralized science",
    description:
      "A Dapp for citizen scientists to contribute astronomical observations, earning tokens for verified data.",
    tags: ["DeSci", "Space", "Data"],
    imageQuery: "space telescope stars constellation mapping",
  },
  {
    day: 16,
    title: "The Urban Explorer's Log",
    vibe: "City streets, hidden gems, augmented reality, location-based NFTs",
    description: "A Dapp for discovering and minting NFTs at specific real-world locations or landmarks.",
    tags: ["NFT", "Location", "AR"],
    imageQuery: "urban city street neon night exploration",
  },
  {
    day: 17,
    title: "The Harmony Hub",
    vibe: "Music, collaboration, royalty distribution, fan engagement",
    description:
      "A Dapp for musicians to co-create tracks, manage royalties, and engage directly with their fan community.",
    tags: ["Music", "Royalties", "Collaboration"],
    imageQuery: "music harmony instruments collaboration studio",
  },
  {
    day: 18,
    title: "The Cryptic Dispatch",
    vibe: "Espionage, secret messages, encrypted communication, private transactions",
    description: "A Dapp for sending private, verifiable messages or data parcels using zero-knowledge proofs.",
    tags: ["Privacy", "ZK-Proofs", "Messaging"],
    imageQuery: "spy encrypted message secret code cipher",
  },
  {
    day: 19,
    title: "The Time-Worn Tavern",
    vibe: "Cozy, community gathering, micro-DAO, on-chain social club",
    description: "A Dapp for a small, token-gated social club where members can propose and vote on activities.",
    tags: ["Social", "DAO", "Community"],
    imageQuery: "cozy tavern warm gathering social medieval",
  },
  {
    day: 20,
    title: "The Infinite Library",
    vibe: "Knowledge, learning, open access, decentralized publishing",
    description:
      "A Dapp for decentralized publishing of books or research papers, with author royalties managed on-chain.",
    tags: ["Publishing", "Knowledge", "Royalties"],
    imageQuery: "infinite library books knowledge ancient modern",
  },
  {
    day: 21,
    title: "The Biometric Vault",
    vibe: "Secure, personal data, digital identity, self-sovereign identity",
    description:
      "A Dapp for users to manage their verifiable digital credentials and personal data with privacy in mind.",
    tags: ["Identity", "Privacy", "SSI"],
    imageQuery: "secure vault biometric fingerprint digital lock",
  },
  {
    day: 22,
    title: "The Gamified Gauntlet",
    vibe: "Web3 gaming, challenges, leaderboards, play-to-earn",
    description:
      "A Dapp that hosts a series of on-chain micro-games or challenges with token rewards and a dynamic leaderboard.",
    tags: ["Gaming", "P2E", "Challenges"],
    imageQuery: "gaming challenge arena neon competitive",
  },
  {
    day: 23,
    title: "The Prophecy Engine",
    vibe: "Futures, speculation, prediction markets, data analysis",
    description:
      "A Dapp that allows users to create and participate in novel prediction markets on various real-world events.",
    tags: ["Prediction", "Markets", "Oracle"],
    imageQuery: "prophecy future crystal ball mystical prediction",
  },
  {
    day: 24,
    title: "The Galactic Diplomat",
    vibe: "Sci-fi, governance, inter-chain communication, DAOs",
    description: "A Dapp for managing inter-blockchain governance proposals or cross-chain asset transfers.",
    tags: ["Cross-Chain", "Governance", "Bridge"],
    imageQuery: "space diplomat galaxy planets interstellar",
  },
  {
    day: 25,
    title: "The Meme Manifesto",
    vibe: "Internet culture, viral content, community-owned memes, social tokens",
    description:
      "A Dapp for creating, curating, and collectively owning meme content, with creators earning from virality.",
    tags: ["Social", "Memes", "Tokens"],
    imageQuery: "meme culture internet viral colorful fun",
  },
  {
    day: 26,
    title: "The Data Dynamo",
    vibe: "Analytics, insights, data ownership, decentralized data markets",
    description:
      "A Dapp that allows users to sell access to their anonymized personal data or contribute to collective data sets.",
    tags: ["Data", "Privacy", "Marketplace"],
    imageQuery: "data analytics graphs charts futuristic",
  },
  {
    day: 27,
    title: "The Phantom Gallery",
    vibe: "Ephemeral art, digital hauntings, time-locked NFTs, hidden content",
    description:
      "A Dapp for creating NFTs that reveal new content or change over time, or disappear after a certain condition.",
    tags: ["NFT", "Dynamic", "Art"],
    imageQuery: "phantom ghost gallery mysterious ethereal art",
  },
  {
    day: 28,
    title: "The Decentralized Dispatcher",
    vibe: "Logistics, supply chain, transparency, verifiable data",
    description:
      "A Dapp for tracking supply chain assets from origin to consumer, ensuring transparency and authenticity.",
    tags: ["Supply Chain", "Tracking", "Transparency"],
    imageQuery: "logistics supply chain network global tracking",
  },
  {
    day: 29,
    title: "The Sovereign Citizen's Toolkit",
    vibe: "Self-governance, digital democracy, voting, identity",
    description:
      "A Dapp offering tools for secure, on-chain voting or managing digital identities for local communities.",
    tags: ["Voting", "Identity", "Democracy"],
    imageQuery: "democracy voting governance citizen empowerment",
  },
  {
    day: 30,
    title: "The Digital Flora & Fauna",
    vibe: "Nature, biodiversity, generative life, evolving NFTs",
    description:
      "A Dapp that generates unique, evolving digital organisms or plants as NFTs, which 'grow' or change based on interactions.",
    tags: ["NFT", "Generative", "Evolution"],
    imageQuery: "digital nature plants creatures bioluminescent",
  },
  {
    day: 31,
    title: "The Ultimate Vibe Architect",
    vibe: "Meta, customizable, creator tools, open-ended",
    description:
      "A Dapp that acts as a toolkit for creating new 'vibe-coded' micro-Dapps, allowing users to define aesthetics and functionality.",
    tags: ["Tools", "Creator", "Meta"],
    imageQuery: "architect builder tools creative construction",
  },
]
