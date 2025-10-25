-- Clean up wallet_address column in comments table
-- Remove @wallet.local suffix from all wallet addresses

UPDATE public.comments
SET wallet_address = REPLACE(wallet_address, '@wallet.local', '')
WHERE wallet_address LIKE '%@wallet.local';

-- Verify cleanup
SELECT 
  COUNT(*) as total_comments,
  COUNT(CASE WHEN wallet_address LIKE '%@wallet.local%' THEN 1 END) as remaining_bad_addresses
FROM public.comments;
