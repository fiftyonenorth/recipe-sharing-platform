-- Ensure cooking_time exists on recipes (minutes, nullable for legacy rows)
alter table public.recipes
  add column if not exists cooking_time int;

comment on column public.recipes.cooking_time is 'Active cooking time in whole minutes';
