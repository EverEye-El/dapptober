-- Paid competition. Separate from likes and comments.

create table if not exists public.competition_entries (
  id uuid primary key default gen_random_uuid(),
  onchain_entry_id bigint unique,
  wallet_address text not null,
  name text not null,
  description text not null,
  demo_url text not null,
  image_url text,
  metadata_uri text,
  tx_hash text,
  status text not null default 'registered',
  created_at timestamptz not null default now()
);

create table if not exists public.competition_votes (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.competition_entries(id) on delete cascade,
  wallet_address text not null,
  tx_hash text,
  created_at timestamptz not null default now(),
  unique (entry_id, wallet_address)
);

alter table public.competition_entries enable row level security;
alter table public.competition_votes enable row level security;

drop policy if exists "competition_entries_select" on public.competition_entries;
create policy "competition_entries_select" on public.competition_entries for select using (true);
drop policy if exists "competition_entries_insert" on public.competition_entries;
create policy "competition_entries_insert" on public.competition_entries for insert with check (false);

drop policy if exists "competition_votes_select" on public.competition_votes;
create policy "competition_votes_select" on public.competition_votes for select using (true);
drop policy if exists "competition_votes_insert" on public.competition_votes;
create policy "competition_votes_insert" on public.competition_votes for insert with check (false);
