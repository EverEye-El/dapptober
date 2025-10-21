-- Migration: Remove dependency on auth.users, use wallet_address directly
-- Run this script in your Supabase SQL Editor

-- Step 1: Add wallet_address to comments table
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Step 2: Make user_id nullable in comments (we'll stop using it)
ALTER TABLE public.comments ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Add wallet_address to likes table
ALTER TABLE public.likes ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Step 4: Make user_id nullable in likes
ALTER TABLE public.likes ALTER COLUMN user_id DROP NOT NULL;

-- Step 5: Update unique constraint on likes to use wallet_address
ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS likes_user_id_dapp_day_key;
-- Removed IF NOT EXISTS from ADD CONSTRAINT (not supported in PostgreSQL)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'likes_wallet_dapp_day_key'
  ) THEN
    ALTER TABLE public.likes ADD CONSTRAINT likes_wallet_dapp_day_key UNIQUE (wallet_address, dapp_day);
  END IF;
END $$;

-- Step 6: Create indexes on wallet_address for performance
CREATE INDEX IF NOT EXISTS idx_comments_wallet_address ON public.comments (wallet_address);
CREATE INDEX IF NOT EXISTS idx_likes_wallet_address ON public.likes (wallet_address);

-- Step 7: Make user_id nullable in profiles (already is, but ensure it)
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

-- Step 8: Add check constraint to ensure wallet_address is present
-- Using DO blocks for conditional constraint creation
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'comments_wallet_address_check'
  ) THEN
    ALTER TABLE public.comments ADD CONSTRAINT comments_wallet_address_check CHECK (wallet_address IS NOT NULL);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'likes_wallet_address_check'
  ) THEN
    ALTER TABLE public.likes ADD CONSTRAINT likes_wallet_address_check CHECK (wallet_address IS NOT NULL);
  END IF;
END $$;
