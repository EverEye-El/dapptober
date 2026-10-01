alter table public.submissions
  add column if not exists banner_position text;

comment on column public.submissions.banner_position is
  'CSS object-position for the banner crop, for example 50% 30%.';
