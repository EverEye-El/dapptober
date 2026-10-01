-- Stream A: prompt vs submission engagement (likes + unlimited comments)

ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS submission_id uuid REFERENCES public.submissions(id) ON DELETE CASCADE;
ALTER TABLE public.likes ADD COLUMN IF NOT EXISTS submission_id uuid REFERENCES public.submissions(id) ON DELETE CASCADE;

-- Unlimited prompt comments (remove one-comment-per-wallet-per-day)
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_wallet_dapp_day_key;
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_user_id_dapp_day_key;

-- Likes: prompt vs submission partial uniques
ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS likes_wallet_dapp_day_key;
ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS likes_user_id_dapp_day_key;

CREATE UNIQUE INDEX IF NOT EXISTS likes_prompt_wallet_day
  ON public.likes (wallet_address, dapp_day)
  WHERE submission_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS likes_submission_wallet
  ON public.likes (wallet_address, submission_id)
  WHERE submission_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_comments_submission_created
  ON public.comments (submission_id, created_at DESC)
  WHERE submission_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_likes_submission
  ON public.likes (submission_id)
  WHERE submission_id IS NOT NULL;

INSERT INTO storage.buckets (id, name, public)
VALUES ('submission-images', 'submission-images', true)
ON CONFLICT (id) DO NOTHING;
