-- Add foreign key constraint from comments.user_id to profiles.id
-- This enables Supabase REST API to perform nested selects

ALTER TABLE comments
DROP CONSTRAINT IF EXISTS comments_user_id_fkey;

ALTER TABLE comments
ADD CONSTRAINT comments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
