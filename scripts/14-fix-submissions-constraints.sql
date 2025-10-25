-- Fix submissions table constraints for wallet-based system

-- Step 1: Check and drop the problematic status check constraint if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'submissions_status_check'
    ) THEN
        ALTER TABLE public.submissions DROP CONSTRAINT submissions_status_check;
        RAISE NOTICE 'Dropped old submissions_status_check constraint';
    END IF;
END $$;

-- Step 2: Add a proper status check constraint with correct values
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'submissions_status_valid'
    ) THEN
        ALTER TABLE public.submissions 
        ADD CONSTRAINT submissions_status_valid 
        CHECK (status IN ('draft', 'published', 'pending', 'approved', 'rejected'));
        RAISE NOTICE 'Added submissions_status_valid constraint';
    END IF;
END $$;

-- Step 3: Ensure wallet_address column exists and is properly configured
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'submissions' 
        AND column_name = 'wallet_address'
    ) THEN
        ALTER TABLE public.submissions ADD COLUMN wallet_address TEXT;
        RAISE NOTICE 'Added wallet_address column';
    END IF;
END $$;

-- Step 4: Make user_id nullable (we're using wallet_address now)
ALTER TABLE public.submissions ALTER COLUMN user_id DROP NOT NULL;

-- Step 5: Update any existing submissions with null wallet_address
UPDATE public.submissions s
SET wallet_address = p.wallet_address
FROM public.profiles p
WHERE s.user_id = p.user_id 
AND s.wallet_address IS NULL
AND p.wallet_address IS NOT NULL;

-- Step 6: Set default status for any rows with invalid status
UPDATE public.submissions
SET status = 'published'
WHERE status IS NULL OR status NOT IN ('draft', 'published', 'pending', 'approved', 'rejected');

-- Step 7: Verify the fix
DO $$
DECLARE
    bad_status_count INTEGER;
    null_wallet_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO bad_status_count
    FROM public.submissions
    WHERE status NOT IN ('draft', 'published', 'pending', 'approved', 'rejected');
    
    SELECT COUNT(*) INTO null_wallet_count
    FROM public.submissions
    WHERE wallet_address IS NULL AND user_id IS NOT NULL;
    
    RAISE NOTICE 'Submissions with invalid status: %', bad_status_count;
    RAISE NOTICE 'Submissions with null wallet_address but valid user_id: %', null_wallet_count;
END $$;
