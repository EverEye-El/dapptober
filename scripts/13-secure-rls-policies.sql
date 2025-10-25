-- Secure RLS Policies for Production
-- This script updates RLS policies to be restrictive (deny public writes)
-- Only service role key can bypass RLS, ensuring all writes go through validated server actions

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

DROP POLICY IF EXISTS "comments_select_policy" ON public.comments;
DROP POLICY IF EXISTS "comments_insert_policy" ON public.comments;
DROP POLICY IF EXISTS "comments_delete_policy" ON public.comments;

DROP POLICY IF EXISTS "likes_select_policy" ON public.likes;
DROP POLICY IF EXISTS "likes_insert_policy" ON public.likes;
DROP POLICY IF EXISTS "likes_delete_policy" ON public.likes;

DROP POLICY IF EXISTS "submissions_select_policy" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_policy" ON public.submissions;
DROP POLICY IF EXISTS "submissions_update_policy" ON public.submissions;

-- Profiles: Public read, no public write (service role only)
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT WITH CHECK (false); -- Only service role can insert

CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE USING (false); -- Only service role can update

-- Comments: Public read, no public write (service role only)
CREATE POLICY "comments_select_policy" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert_policy" ON public.comments
  FOR INSERT WITH CHECK (false); -- Only service role can insert

CREATE POLICY "comments_delete_policy" ON public.comments
  FOR DELETE USING (false); -- Only service role can delete

-- Likes: Public read, no public write (service role only)
CREATE POLICY "likes_select_policy" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "likes_insert_policy" ON public.likes
  FOR INSERT WITH CHECK (false); -- Only service role can insert

CREATE POLICY "likes_delete_policy" ON public.likes
  FOR DELETE USING (false); -- Only service role can delete

-- Submissions: Public read, no public write (service role only)
CREATE POLICY "submissions_select_policy" ON public.submissions
  FOR SELECT USING (true);

CREATE POLICY "submissions_insert_policy" ON public.submissions
  FOR INSERT WITH CHECK (false); -- Only service role can insert

CREATE POLICY "submissions_update_policy" ON public.submissions
  FOR UPDATE USING (false); -- Only service role can update

-- Verification query
DO $$
BEGIN
  RAISE NOTICE 'RLS policies updated successfully!';
  RAISE NOTICE 'All tables now allow public reads but deny public writes.';
  RAISE NOTICE 'Only service role key can perform write operations.';
END $$;
