-- Enable required extensions
create extension if not exists pgcrypto;

-- Create or update profiles table with user_id reference
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  wallet_address text unique,
  display_name text,
  avatar_url text,
  bio text,
  twitter_handle text,
  github_handle text,
  website_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_login_at timestamptz
);

-- Add columns if they don't exist (for existing tables)
alter table public.profiles add column if not exists user_id uuid unique references auth.users(id) on delete cascade;
alter table public.profiles add column if not exists wallet_address text;
alter table public.profiles add column if not exists last_login_at timestamptz;
alter table public.profiles add column if not exists updated_at timestamptz default now();

-- Create unique constraint on wallet_address if it doesn't exist
do $$ 
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'profiles_wallet_address_key'
  ) then
    alter table public.profiles add constraint profiles_wallet_address_key unique (wallet_address);
  end if;
end $$;

-- Create or replace updated_at trigger function
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- Drop and recreate trigger to ensure it's up to date
drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

-- Create index on wallet_address for faster lookups
create index if not exists idx_profiles_wallet_address on public.profiles (wallet_address);
create index if not exists idx_profiles_user_id on public.profiles (user_id);
