-- Prompt day for a paid competition agent. Same 1–31 range as showcase submissions.

alter table public.competition_entries add column if not exists day int;

alter table public.competition_entries drop constraint if exists competition_entries_day_range;
alter table public.competition_entries add constraint competition_entries_day_range
  check (day is null or (day >= 1 and day <= 31));
