-- RLS + auto-create profile on sign-up

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Recipes
-- ---------------------------------------------------------------------------
alter table public.recipes enable row level security;

create policy "Recipes are publicly readable"
  on public.recipes for select
  using (true);

create policy "Users can insert own recipes"
  on public.recipes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own recipes"
  on public.recipes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own recipes"
  on public.recipes for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Profile on sign-up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := lower(
    regexp_replace(
      coalesce(nullif(split_part(new.email, '@', 1), ''), 'user'),
      '[^a-z0-9_]',
      '_',
      'g'
    )
  );

  if char_length(base_username) < 3 then
    base_username := 'user';
  end if;

  final_username := left(base_username, 30);

  while exists (select 1 from public.profiles where username = final_username) loop
    final_username := left(base_username, 22) || '_' || left(replace(gen_random_uuid()::text, '-', ''), 6);
  end loop;

  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    final_username,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
