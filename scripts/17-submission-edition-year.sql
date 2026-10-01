-- Separate each Dapptober year. 2026 is the live showcase. Earlier years are the archive.
-- A wallet may ship the same prompt day again in a new year.

alter table public.submissions add column if not exists edition_year integer;

update public.submissions
set edition_year = extract(year from (created_at at time zone 'America/New_York'))::int
where edition_year is null;

alter table public.submissions alter column edition_year set default 2026;
alter table public.submissions alter column edition_year set not null;

alter table public.submissions drop constraint if exists submissions_day_key;
alter table public.submissions drop constraint if exists submissions_user_id_day_key;
alter table public.submissions drop constraint if exists submissions_wallet_day_key;

create unique index if not exists submissions_wallet_day_edition
  on public.submissions (wallet_address, day, edition_year);
