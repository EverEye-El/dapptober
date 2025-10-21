-- Clean up wallet addresses that have @wallet.local suffix
-- This script removes the fake email domain from wallet addresses

-- Update profiles table
UPDATE public.profiles
SET wallet_address = LOWER(REPLACE(wallet_address, '@wallet.local', ''))
WHERE wallet_address LIKE '%@wallet.local';

-- Update comments table  
UPDATE public.comments
SET wallet_address = LOWER(REPLACE(wallet_address, '@wallet.local', ''))
WHERE wallet_address LIKE '%@wallet.local';

-- Update likes table
UPDATE public.likes
SET wallet_address = LOWER(REPLACE(wallet_address, '@wallet.local', ''))
WHERE wallet_address LIKE '%@wallet.local';

-- Update submissions table
UPDATE public.submissions
SET wallet_address = LOWER(REPLACE(wallet_address, '@wallet.local', ''))
WHERE wallet_address LIKE '%@wallet.local';
