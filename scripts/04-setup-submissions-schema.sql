-- Create or update submissions table
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day int not null,
  title text not null check (char_length(title) between 1 and 140),
  description text,
  tags text[] default '{}',
  technical_implementation text,
  key_features text[] default '{}',
  demo_url text,
  github_url text,
  image_url text,
  status text default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, day)
);

-- Add user_id column if it doesn't exist
alter table public.submissions add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Create unique constraint if it doesn't exist
do $$ 
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'submissions_user_id_day_key'
  ) then
    alter table public.submissions add constraint submissions_user_id_day_key unique (user_id, day);
  end if;
end $$;

-- Create indexes for performance
create index if not exists idx_submissions_day on public.submissions (day);
create index if not exists idx_submissions_user_id on public.submissions (user_id);
create index if not exists idx_submissions_status on public.submissions (status);

-- Add updated_at trigger
drop trigger if exists trg_submissions_touch on public.submissions;
create trigger trg_submissions_touch before update on public.submissions
for each row execute function public.touch_updated_at();
