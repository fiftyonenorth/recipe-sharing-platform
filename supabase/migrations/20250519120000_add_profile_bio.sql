-- Optional short bio on public profiles
alter table public.profiles
  add column if not exists bio text;

comment on column public.profiles.bio is 'Short public bio shown on the user profile';
