-- Complete migration to wallet_address system
-- This script adds wallet_address to ALL tables and removes user_id dependencies

-- Step 1: Add wallet_address column to comments table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'comments' 
                   AND column_name = 'wallet_address') THEN
        ALTER TABLE public.comments ADD COLUMN wallet_address TEXT;
        RAISE NOTICE 'Added wallet_address column to comments table';
    END IF;
END $$;

-- Step 2: Add wallet_address column to likes table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'likes' 
                   AND column_name = 'wallet_address') THEN
        ALTER TABLE public.likes ADD COLUMN wallet_address TEXT;
        RAISE NOTICE 'Added wallet_address column to likes table';
    END IF;
END $$;

-- Step 3: Add wallet_address column to submissions table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'submissions' 
                   AND column_name = 'wallet_address') THEN
        ALTER TABLE public.submissions ADD COLUMN wallet_address TEXT;
        RAISE NOTICE 'Added wallet_address column to submissions table';
    END IF;
END $$;

-- Step 4: Migrate existing data from user_id to wallet_address for comments
UPDATE public.comments c
SET wallet_address = p.wallet_address
FROM public.profiles p
WHERE c.user_id = p.user_id 
AND c.wallet_address IS NULL
AND p.wallet_address IS NOT NULL;

-- Step 5: Migrate existing data from user_id to wallet_address for likes
UPDATE public.likes l
SET wallet_address = p.wallet_address
FROM public.profiles p
WHERE l.user_id = p.user_id 
AND l.wallet_address IS NULL
AND p.wallet_address IS NOT NULL;

-- Step 6: Migrate existing data from user_id to wallet_address for submissions
UPDATE public.submissions s
SET wallet_address = p.wallet_address
FROM public.profiles p
WHERE s.user_id = p.user_id 
AND s.wallet_address IS NULL
AND p.wallet_address IS NOT NULL;

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

-- Step 11: Make user_id nullable in all tables (we're not using it anymore)
ALTER TABLE public.comments ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.likes ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.submissions ALTER COLUMN user_id DROP NOT NULL;

-- Step 12: Add indexes for wallet_address lookups
CREATE INDEX IF NOT EXISTS idx_comments_wallet_address ON public.comments(wallet_address);
CREATE INDEX IF NOT EXISTS idx_likes_wallet_address ON public.likes(wallet_address);
CREATE INDEX IF NOT EXISTS idx_submissions_wallet_address ON public.submissions(wallet_address);

-- Step 13: Update unique constraints for likes (wallet_address + dapp_day)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'likes_wallet_dapp_day_key') THEN
        ALTER TABLE public.likes ADD CONSTRAINT likes_wallet_dapp_day_key UNIQUE (wallet_address, dapp_day);
        RAISE NOTICE 'Added unique constraint for likes on wallet_address and dapp_day';
    END IF;
END $$;

-- Step 14: Update unique constraints for submissions (wallet_address + day)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'submissions_wallet_day_key') THEN
        ALTER TABLE public.submissions ADD CONSTRAINT submissions_wallet_day_key UNIQUE (wallet_address, day);
        RAISE NOTICE 'Added unique constraint for submissions on wallet_address and day';
    END IF;
END $$;

-- Step 15: Wrapped final notice in DO block to fix syntax error
DO $$
BEGIN
    RAISE NOTICE 'Migration complete! All tables now use wallet_address.';
END $$;
