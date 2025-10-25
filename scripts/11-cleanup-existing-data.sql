-- Simple cleanup script to remove @wallet.local from all existing data
-- Run this to fix any data that was created before the migration

-- Clean profiles
UPDATE public.profiles
SET wallet_address = REPLACE(wallet_address, '@wallet.local', '')
WHERE wallet_address LIKE '%@wallet.local';

-- Clean comments
UPDATE public.comments
SET wallet_address = REPLACE(wallet_address, '@wallet.local', '')
WHERE wallet_address LIKE '%@wallet.local';

-- Clean likes  
UPDATE public.likes
SET wallet_address = REPLACE(wallet_address, '@wallet.local', '')
WHERE wallet_address LIKE '%@wallet.local';

-- Clean submissions
UPDATE public.submissions
SET wallet_address = REPLACE(wallet_address, '@wallet.local', '')
WHERE wallet_address LIKE '%@wallet.local';

-- Verify cleanup
SELECT 'profiles' as table_name, COUNT(*) as remaining_bad_addresses
FROM public.profiles
WHERE wallet_address LIKE '%@wallet.local'
UNION ALL
SELECT 'comments', COUNT(*)
FROM public.comments
WHERE wallet_address LIKE '%@wallet.local'
UNION ALL
SELECT 'likes', COUNT(*)
FROM public.likes
WHERE wallet_address LIKE '%@wallet.local'
UNION ALL
SELECT 'submissions', COUNT(*)
FROM public.submissions
WHERE wallet_address LIKE '%@wallet.local';
