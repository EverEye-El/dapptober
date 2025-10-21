-- Complete migration to wallet_address system
-- This script adds columns, migrates data, and cleans up

-- Step 1: Add wallet_address columns if they don't exist
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS wallet_address TEXT;
ALTER TABLE public.likes ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Step 2: Make user_id nullable
ALTER TABLE public.comments ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.likes ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Clean up profiles table first (remove @wallet.local suffix)
UPDATE public.profiles
SET wallet_address = LOWER(REPLACE(wallet_address, '@wallet.local', ''))
WHERE wallet_address LIKE '%@wallet.local';

-- Step 4: For comments - populate wallet_address from profiles via user_id
-- (for any existing comments that have user_id but no wallet_address)
UPDATE public.comments c
SET wallet_address = p.wallet_address
FROM public.profiles p
WHERE c.user_id = p.user_id 
  AND c.wallet_address IS NULL
  AND p.wallet_address IS NOT NULL;

-- Step 5: For likes - populate wallet_address from profiles via user_id
UPDATE public.likes l
SET wallet_address = p.wallet_address
FROM public.profiles p
WHERE l.user_id = p.user_id 
  AND l.wallet_address IS NULL
  AND p.wallet_address IS NOT NULL;

-- Step 6: Clean up any @wallet.local suffixes in comments and likes
UPDATE public.comments
SET wallet_address = LOWER(REPLACE(wallet_address, '@wallet.local', ''))
WHERE wallet_address LIKE '%@wallet.local';

UPDATE public.likes
SET wallet_address = LOWER(REPLACE(wallet_address, '@wallet.local', ''))
WHERE wallet_address LIKE '%@wallet.local';

-- Step 7: Update unique constraint on likes
ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS likes_user_id_dapp_day_key;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'likes_wallet_dapp_day_key'
  ) THEN
    ALTER TABLE public.likes ADD CONSTRAINT likes_wallet_dapp_day_key UNIQUE (wallet_address, dapp_day);
  END IF;
END $$;

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_wallet_address ON public.comments (wallet_address);
CREATE INDEX IF NOT EXISTS idx_likes_wallet_address ON public.likes (wallet_address);
