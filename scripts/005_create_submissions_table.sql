-- Create submissions table for user-submitted DApps
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  day integer not null unique,
  title text not null,
  description text not null,
  tags text[] default '{}',
  technical_implementation text,
  key_features text[] default '{}',
  demo_url text,
  github_url text,
  image_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.submissions enable row level security;

-- RLS Policies for submissions
create policy "submissions_select_all"
  on public.submissions for select
  using (true);

create policy "submissions_insert_own"
  on public.submissions for insert
  with check (auth.uid() = user_id);

create policy "submissions_update_own"
  on public.submissions for update
  using (auth.uid() = user_id);

create policy "submissions_delete_own"
  on public.submissions for delete
  using (auth.uid() = user_id);

-- Create indexes for faster queries
create index if not exists submissions_user_id_idx on public.submissions(user_id);
create index if not exists submissions_day_idx on public.submissions(day);
create index if not exists submissions_status_idx on public.submissions(status);
create index if not exists submissions_created_at_idx on public.submissions(created_at desc);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
drop trigger if exists submissions_updated_at on public.submissions;
create trigger submissions_updated_at
  before update on public.submissions
  for each row execute procedure public.handle_updated_at();
