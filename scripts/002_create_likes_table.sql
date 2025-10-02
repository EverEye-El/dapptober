-- Create likes table for DApp likes
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  dapp_day integer not null,
  created_at timestamp with time zone default now(),
  unique(user_id, dapp_day)
);

-- Enable RLS
alter table public.likes enable row level security;

-- RLS Policies for likes
create policy "likes_select_all"
  on public.likes for select
  using (true);

create policy "likes_insert_own"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "likes_delete_own"
  on public.likes for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists likes_dapp_day_idx on public.likes(dapp_day);
create index if not exists likes_user_id_idx on public.likes(user_id);
