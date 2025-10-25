-- Update RLS policies to work without Supabase Auth (wallet-based system)
-- Since we're using wallet addresses directly without auth.users, we need to allow public writes

-- Profiles policies - Allow public read and write since wallet verification happens in the app
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select all" on public.profiles
for select using (true);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert all" on public.profiles
for insert with check (true);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update all" on public.profiles
for update using (true);

-- Comments policies - Public read, public write (wallet verification in app)
drop policy if exists "comments public read" on public.comments;
create policy "comments public read" on public.comments
for select using (true);

drop policy if exists "comments own write" on public.comments;
create policy "comments public write" on public.comments
for all with check (true);

-- Likes policies - Public read, public write (wallet verification in app)
drop policy if exists "likes public read" on public.likes;
create policy "likes public read" on public.likes
for select using (true);

drop policy if exists "likes own write" on public.likes;
create policy "likes public write" on public.likes
for all with check (true);

-- Submissions policies - Public read, public write (wallet verification in app)
drop policy if exists "submissions public read" on public.submissions;
create policy "submissions public read" on public.submissions
for select using (true);

drop policy if exists "submissions own write" on public.submissions;
create policy "submissions public write" on public.submissions
for all with check (true);
