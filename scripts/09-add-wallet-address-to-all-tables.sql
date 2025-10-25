-- COMPLETE MIGRATION: Add wallet_address to all tables and remove user_id dependency
-- This script adds wallet_address columns to comments, likes, and submissions tables
-- and migrates existing data from user_id to wallet_address via profiles table

-- Step 1: Add wallet_address column to comments table
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Step 2: Add wallet_address column to likes table  
ALTER TABLE public.likes ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Step 3: Add wallet_address column to submissions table
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Step 4: Populate wallet_address in comments from profiles table
UPDATE public.comments c
SET wallet_address = p.wallet_address
FROM public.profiles p
WHERE c.user_id = p.user_id AND c.wallet_address IS NULL;

-- Step 5: Populate wallet_address in likes from profiles table
UPDATE public.likes l
SET wallet_address = p.wallet_address
FROM public.profiles p
WHERE l.user_id = p.user_id AND l.wallet_address IS NULL;

-- Step 6: Populate wallet_address in submissions from profiles table
UPDATE public.submissions s
SET wallet_address = p.wallet_address
FROM public.profiles p
WHERE s.user_id = p.user_id AND s.wallet_address IS NULL;

-- Step 7: Clean up @wallet.local suffix from profiles
UPDATE public.profiles
SET wallet_address = REPLACE(wallet_address, '@wallet.local', '')
WHERE wallet_address LIKE '%@wallet.local';

-- Step 8: Clean up @wallet.local suffix from comments
UPDATE public.comments
SET wallet_address = REPLACE(wallet_address, '@wallet.local', '')
WHERE wallet_address LIKE '%@wallet.local';

-- Step 9: Clean up @wallet.local suffix from likes
UPDATE public.likes
SET wallet_address = REPLACE(wallet_address, '@wallet.local', '')
WHERE wallet_address LIKE '%@wallet.local';

-- Step 10: Clean up @wallet.local suffix from submissions
UPDATE public.submissions
SET wallet_address = REPLACE(wallet_address, '@wallet.local', '')
WHERE wallet_address LIKE '%@wallet.local';

-- Step 11: Make wallet_address NOT NULL in comments (after data is populated)
ALTER TABLE public.comments ALTER COLUMN wallet_address SET NOT NULL;

-- Step 12: Make wallet_address NOT NULL in likes (after data is populated)
ALTER TABLE public.likes ALTER COLUMN wallet_address SET NOT NULL;

-- Step 13: Make wallet_address NOT NULL in submissions (after data is populated)
ALTER TABLE public.submissions ALTER COLUMN wallet_address SET NOT NULL;

-- Step 14: Drop old unique constraint on comments (user_id, dapp_day)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'comments_user_id_dapp_day_key'
  ) THEN
    ALTER TABLE public.comments DROP CONSTRAINT comments_user_id_dapp_day_key;
  END IF;
END $$;

-- Step 15: Add new unique constraint on comments (wallet_address, dapp_day)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'comments_wallet_dapp_day_key'
  ) THEN
    ALTER TABLE public.comments ADD CONSTRAINT comments_wallet_dapp_day_key UNIQUE (wallet_address, dapp_day);
  END IF;
END $$;

-- Step 16: Drop old unique constraint on likes (user_id, dapp_day)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'likes_user_id_dapp_day_key'
  ) THEN
    ALTER TABLE public.likes DROP CONSTRAINT likes_user_id_dapp_day_key;
  END IF;
END $$;

-- Step 17: Add new unique constraint on likes (wallet_address, dapp_day)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'likes_wallet_dapp_day_key'
  ) THEN
    ALTER TABLE public.likes ADD CONSTRAINT likes_wallet_dapp_day_key UNIQUE (wallet_address, dapp_day);
  END IF;
END $$;

-- Step 18: Drop old unique constraint on submissions (user_id, day)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'submissions_user_id_day_key'
  ) THEN
    ALTER TABLE public.submissions DROP CONSTRAINT submissions_user_id_day_key;
  END IF;
END $$;

-- Step 19: Add new unique constraint on submissions (wallet_address, day)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'submissions_wallet_day_key'
  ) THEN
    ALTER TABLE public.submissions ADD CONSTRAINT submissions_wallet_day_key UNIQUE (wallet_address, day);
  END IF;
END $$;

-- Step 20: Create indexes on wallet_address columns
CREATE INDEX IF NOT EXISTS idx_comments_wallet_address ON public.comments (wallet_address);
CREATE INDEX IF NOT EXISTS idx_likes_wallet_address ON public.likes (wallet_address);
CREATE INDEX IF NOT EXISTS idx_submissions_wallet_address ON public.submissions (wallet_address);

-- Step 21: Make user_id nullable in comments (so we can stop using it)
ALTER TABLE public.comments ALTER COLUMN user_id DROP NOT NULL;

-- Step 22: Make user_id nullable in likes (so we can stop using it)
ALTER TABLE public.likes ALTER COLUMN user_id DROP NOT NULL;

-- Step 23: Make user_id nullable in submissions (so we can stop using it)
ALTER TABLE public.submissions ALTER COLUMN user_id DROP NOT NULL;
