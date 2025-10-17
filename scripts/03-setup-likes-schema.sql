-- Create or update likes table
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dapp_day int not null,
  created_at timestamptz default now(),
  unique (user_id, dapp_day)
);

-- Add user_id column if it doesn't exist
alter table public.likes add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Create unique constraint if it doesn't exist
do $$ 
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'likes_user_id_dapp_day_key'
  ) then
    alter table public.likes add constraint likes_user_id_dapp_day_key unique (user_id, dapp_day);
  end if;
end $$;

-- Create indexes for performance
create index if not exists idx_likes_day on public.likes (dapp_day);
create index if not exists idx_likes_user_id on public.likes (user_id);
