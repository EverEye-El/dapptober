-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.submissions enable row level security;

-- Profiles policies
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
for select using (auth.uid() = user_id);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles
for insert with check (auth.uid() = user_id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
for update using (auth.uid() = user_id);

-- Comments policies
drop policy if exists "comments public read" on public.comments;
create policy "comments public read" on public.comments
for select using (true);

drop policy if exists "comments own write" on public.comments;
create policy "comments own write" on public.comments
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Likes policies
drop policy if exists "likes public read" on public.likes;
create policy "likes public read" on public.likes
for select using (true);

drop policy if exists "likes own write" on public.likes;
create policy "likes own write" on public.likes
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Submissions policies
drop policy if exists "submissions public read" on public.submissions;
create policy "submissions public read" on public.submissions
for select using (true);

drop policy if exists "submissions own write" on public.submissions;
create policy "submissions own write" on public.submissions
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);
