# Dapptober Showcase App

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/evereyeels-projects/v0-dapptober-showcase-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/KLlchNFCQdD)

## Overview

A showcase of 31 vibe-coded Web3 applications - one for each day of October. Built with Next.js, thirdweb, and Supabase, featuring full wallet authentication and community interactions.

## Features

### 🎨 Vibe-Coded Design
- 31 unique DApp concepts with custom aesthetics
- Neon gradient themes with glass-morphism effects
- Responsive design optimized for all devices

### 🔐 Web3 Authentication
- **Wallet Connection**: Connect with MetaMask, Coinbase Wallet, Rainbow, Rabby, and Zerion
- **thirdweb Auth**: Secure signature-based authentication
- **Supabase Integration**: User profiles stored with wallet addresses

### 💬 Community Features
- **Like System**: Show appreciation for DApps with your wallet
- **Comments**: Engage in discussions with wallet-based identity
- **Real-time Updates**: Live interaction counts and community stats

### 🛡️ Security
- Row Level Security (RLS) on all database tables
- Server-side signature verification
- Secure session management with Supabase Auth

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Web3**: thirdweb SDK for wallet connection and authentication
- **Database**: Supabase PostgreSQL with RLS
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Deployment**: Vercel

## Getting Started

### Prerequisites

1. **Supabase Integration**: Connected via v0 Project Settings
2. **thirdweb Client ID**: Get from [thirdweb Dashboard](https://thirdweb.com/dashboard)

### Environment Variables

\`\`\`bash
# thirdweb (Required)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

# Supabase (Auto-configured via integration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### Installation

\`\`\`bash
# Install dependencies
npm install

# Run database migrations (automatic via v0)
# Scripts in /scripts folder will be executed

# Start development server
npm run dev
\`\`\`

### Database Setup

The app automatically creates the following tables:

- **profiles**: User profiles with wallet addresses
- **likes**: DApp likes with user associations
- **comments**: Community comments with timestamps

All tables include Row Level Security policies for data protection.

## Project Structure

\`\`\`
├── app/
│   ├── dapp/[day]/          # Dynamic DApp detail pages
│   ├── layout.tsx           # Root layout with ThirdwebProvider
│   └── page.tsx             # Main gallery page
├── components/
│   ├── web3/                # Web3-specific components
│   │   ├── wallet-connect-button.tsx
│   │   ├── like-button.tsx
│   │   └── comments-section.tsx
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase/            # Supabase client utilities
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   └── middleware.ts    # Session management
│   └── web3/                # Web3 utilities
│       ├── thirdweb-client.ts
│       └── auth.ts          # Authentication logic
├── scripts/                 # Database migration scripts
└── middleware.ts            # Next.js middleware for auth

\`\`\`

## How It Works

### Authentication Flow

1. User clicks "Connect Wallet" in the sidebar
2. Wallet connection modal appears (powered by thirdweb)
3. User signs a message to prove wallet ownership
4. Signature is verified server-side using thirdweb Auth
5. User profile is created/retrieved in Supabase
6. Session is established for authenticated interactions

### Interaction Flow

1. **Liking a DApp**:
   - User must be connected with wallet
   - Click like button on any DApp page
   - Like is stored in database with user_id and dapp_day
   - Real-time count updates for all users

2. **Commenting**:
   - User must be connected with wallet
   - Write comment and submit
   - Comment is stored with user profile reference
   - Displays with wallet address/display name

## Documentation

- **[WEB3_SETUP.md](./WEB3_SETUP.md)**: Complete Web3 integration guide
- **[thirdweb Docs](https://portal.thirdweb.com/)**: thirdweb SDK documentation
- **[Supabase Docs](https://supabase.com/docs)**: Supabase documentation

## Deployment

Your project is live at:

**[https://vercel.com/evereyeels-projects/v0-dapptober-showcase-app](https://vercel.com/evereyeels-projects/v0-dapptober-showcase-app)**

### Deploy Your Own

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Continue Building

Build and modify your app on:

**[https://v0.app/chat/projects/KLlchNFCQdD](https://v0.app/chat/projects/KLlchNFCQdD)**

## Security Considerations

- All database tables use Row Level Security (RLS)
- Wallet signatures are verified server-side
- No sensitive data exposed to client
- Session tokens managed securely via cookies

## Troubleshooting

### Wallet Connection Issues
- Ensure thirdweb Client ID is set correctly
- Check that wallet extension is installed and unlocked
- Try refreshing the page

### Database Errors
- Verify Supabase integration is connected
- Check that database scripts have been executed
- Review RLS policies in Supabase dashboard

### Authentication Problems
- Clear browser cookies and reconnect wallet
- Verify middleware is running correctly
- Check server logs for signature verification errors

## License

Built with [v0.app](https://v0.app) - AI-powered development platform by Vercel.

---

*This repository stays in sync with your deployed chats on v0.app. Any changes you make to your deployed app will be automatically pushed to this repository.*
