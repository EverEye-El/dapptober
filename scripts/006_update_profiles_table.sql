-- Add bio and social links to profiles
alter table public.profiles
  add column if not exists bio text,
  add column if not exists twitter_handle text,
  add column if not exists github_handle text,
  add column if not exists website_url text;

-- Update the handle_new_user function to include wallet address properly
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, wallet_address, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'wallet_address', new.email),
    coalesce(new.raw_user_meta_data->>'display_name', new.email),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/identicon/svg?seed=' || new.id::text
    )
  );
  return new;
end;
$$ language plpgsql security definer;
