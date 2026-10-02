-- Unlimited comments on paid competition agents, separate from prompt and showcase threads.

alter table public.comments add column if not exists entry_id uuid references public.competition_entries(id) on delete cascade;

alter table public.comments alter column dapp_day drop not null;

alter table public.comments drop constraint if exists comments_has_target;
alter table public.comments add constraint comments_has_target check (
  dapp_day is not null or submission_id is not null or entry_id is not null
);

create index if not exists idx_comments_entry_created
  on public.comments (entry_id, created_at desc)
  where entry_id is not null;
