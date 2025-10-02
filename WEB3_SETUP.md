# Web3 Integration Setup Guide

This guide covers the complete setup for the Dapptober Web3 integration using thirdweb and Supabase.

## Overview

The Dapptober app now includes full Web3 functionality:
- **Wallet Connection**: Connect with MetaMask, Coinbase Wallet, Rainbow, Rabby, and Zerion
- **Authentication**: thirdweb Auth integrated with Supabase for secure, wallet-based login
- **User Interactions**: Like DApps and post comments with your wallet identity
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) for data protection

## Architecture

\`\`\`
┌─────────────────┐
│   User Wallet   │
└────────┬────────┘
         │
         ├─── thirdweb SDK (Wallet Connection)
         │
         ├─── Sign Message (Authentication)
         │
         ├─── thirdweb Auth (Signature Verification)
         │
         └─── Supabase Auth (Session Management)
                    │
                    └─── Supabase Database (User Data, Likes, Comments)
\`\`\`

## Prerequisites

1. **Supabase Integration**: Already connected via v0 Project Settings
2. **thirdweb Client ID**: Get from [thirdweb Dashboard](https://thirdweb.com/dashboard)

## Setup Steps

### 1. Database Setup

The database schema is automatically created via SQL scripts in the `scripts/` folder:

- `001_create_users_and_auth.sql` - Creates profiles table and auth trigger
- `002_create_likes_table.sql` - Creates likes table with RLS policies
- `003_create_comments_table.sql` - Creates comments table with RLS policies

**To run the scripts:**
1. The scripts will be executed automatically by v0
2. Alternatively, you can run them manually from the v0 interface

### 2. Environment Variables

Add the following to your Vercel project environment variables:

\`\`\`bash
# thirdweb (Required)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

# Supabase (Already configured via integration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### 3. Get thirdweb Client ID

1. Go to [thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Create a new project or select existing
3. Copy your Client ID
4. Add to environment variables as `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`

### 4. Supabase Configuration

The Supabase integration is already configured. The following tables are created:

#### `profiles` Table
\`\`\`sql
- id (uuid, primary key, references auth.users)
- wallet_address (text, unique)
- display_name (text)
- avatar_url (text)
- created_at (timestamp)
- updated_at (timestamp)
\`\`\`

#### `likes` Table
\`\`\`sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- dapp_day (integer)
- created_at (timestamp)
- unique constraint on (user_id, dapp_day)
\`\`\`

#### `comments` Table
\`\`\`sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- dapp_day (integer)
- content (text)
- created_at (timestamp)
- updated_at (timestamp)
\`\`\`

## How It Works

### Authentication Flow

1. **User connects wallet** via thirdweb ConnectButton
2. **Sign message** to prove wallet ownership
3. **Verify signature** using thirdweb Auth
4. **Create/login user** in Supabase with wallet address
5. **Session established** - user can now interact with the app

### Wallet-Based Authentication

Instead of traditional email/password, users authenticate with their wallet:

\`\`\`typescript
// User signs a message
const message = `Sign this message to authenticate with Dapptober.
Wallet: ${address}
Timestamp: ${Date.now()}`

const signature = await account.signMessage({ message })

// Verify signature and create session
await authenticateWithWallet(address, signature, message)
\`\`\`

### Row Level Security (RLS)

All tables use RLS policies to ensure:
- Users can only modify their own data
- All users can view public data (likes, comments)
- Authentication is required for write operations

Example policy:
\`\`\`sql
CREATE POLICY "likes_insert_own"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
\`\`\`

## Components

### WalletConnectButton
Located in `components/web3/wallet-connect-button.tsx`
- Handles wallet connection
- Triggers authentication flow
- Displays connected wallet address

### LikeButton
Located in `components/web3/like-button.tsx`
- Allows users to like/unlike DApps
- Requires wallet connection
- Updates in real-time

### CommentsSection
Located in `components/web3/comments-section.tsx`
- Post and view comments
- Requires wallet connection
- Displays user wallet addresses

## Middleware

The middleware (`middleware.ts`) handles:
- Session refresh on every request
- Token management
- Cookie synchronization

**Important**: Always call `getUser()` immediately after creating the Supabase client to prevent random logouts.

## Security Considerations

1. **RLS Enabled**: All tables have Row Level Security enabled
2. **Signature Verification**: All wallet authentications verify signatures
3. **Server-Side Validation**: Auth logic runs on the server
4. **No Direct Auth Schema Access**: Use public tables with RLS instead

## Testing

1. **Connect Wallet**: Click "Connect Wallet" in the sidebar
2. **Sign Message**: Approve the signature request in your wallet
3. **Like a DApp**: Navigate to any DApp page and click the like button
4. **Post Comment**: Write a comment and submit

## Troubleshooting

### "Please connect your wallet" error
- Ensure wallet is connected via the sidebar button
- Check that signature was approved
- Verify thirdweb Client ID is set correctly

### Likes/Comments not saving
- Check Supabase connection in Project Settings
- Verify database scripts have been run
- Check browser console for RLS policy errors

### Random logouts
- Ensure middleware is calling `getUser()` after creating client
- Check that cookies are being set correctly
- Verify session refresh is working

## Development

### Local Development
\`\`\`bash
npm install
npm run dev
\`\`\`

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

## Resources

- [thirdweb Documentation](https://portal.thirdweb.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the thirdweb and Supabase documentation
3. Open an issue in the repository
\`\`\`

```typescript file="" isHidden
