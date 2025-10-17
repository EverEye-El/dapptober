-- Create or update comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dapp_day int not null,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add user_id column if it doesn't exist (for migration from wallet_address)
alter table public.comments add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Create indexes for performance
create index if not exists idx_comments_day_created on public.comments (dapp_day, created_at desc);
create index if not exists idx_comments_user_id on public.comments (user_id);

-- Add updated_at trigger
drop trigger if exists trg_comments_touch on public.comments;
create trigger trg_comments_touch before update on public.comments
for each row execute function public.touch_updated_at();
