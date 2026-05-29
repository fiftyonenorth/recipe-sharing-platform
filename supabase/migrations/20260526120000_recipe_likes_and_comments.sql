-- Likes and comments on recipes

-- ---------------------------------------------------------------------------
-- Likes (one per user per recipe)
-- ---------------------------------------------------------------------------
create table public.recipe_likes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  recipe_id   uuid not null references public.recipes (id) on delete cascade,
  constraint recipe_likes_user_recipe_unique unique (user_id, recipe_id)
);

create index recipe_likes_recipe_id_idx on public.recipe_likes (recipe_id);
create index recipe_likes_user_id_idx on public.recipe_likes (user_id);
create index recipe_likes_created_at_idx on public.recipe_likes (created_at desc);

comment on table public.recipe_likes is 'User likes on community recipes';

-- ---------------------------------------------------------------------------
-- Comments
-- ---------------------------------------------------------------------------
create table public.recipe_comments (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  recipe_id   uuid not null references public.recipes (id) on delete cascade,
  body        text not null,
  constraint recipe_comments_body_length check (
    char_length(trim(body)) between 1 and 2000
  )
);

create index recipe_comments_recipe_id_created_at_idx
  on public.recipe_comments (recipe_id, created_at desc);

create index recipe_comments_user_id_idx on public.recipe_comments (user_id);

comment on table public.recipe_comments is 'User comments on community recipes';

create trigger recipe_comments_set_updated_at
  before update on public.recipe_comments
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security — likes
-- ---------------------------------------------------------------------------
alter table public.recipe_likes enable row level security;

create policy "Likes are publicly readable"
  on public.recipe_likes for select
  using (true);

create policy "Authenticated users can like recipes"
  on public.recipe_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can remove own likes"
  on public.recipe_likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Row level security — comments
-- ---------------------------------------------------------------------------
alter table public.recipe_comments enable row level security;

create policy "Comments are publicly readable"
  on public.recipe_comments for select
  using (true);

create policy "Authenticated users can comment on recipes"
  on public.recipe_comments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own comments"
  on public.recipe_comments for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.recipe_comments for delete
  to authenticated
  using (auth.uid() = user_id);
