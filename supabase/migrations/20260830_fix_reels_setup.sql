create table if not exists public.reels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  video_path text not null,
  thumbnail_path text,
  caption text not null default '',
  location text not null default '',
  hashtags text[] not null default '{}',
  duration numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  saves_count integer not null default 0,
  views_count integer not null default 0
);

create table if not exists public.reel_likes (
  id uuid primary key default gen_random_uuid(),
  reel_id uuid not null references public.reels(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(reel_id, user_id)
);

create table if not exists public.reel_comments (
  id uuid primary key default gen_random_uuid(),
  reel_id uuid not null references public.reels(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reel_saves (
  id uuid primary key default gen_random_uuid(),
  reel_id uuid not null references public.reels(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(reel_id, user_id)
);

create table if not exists public.reel_views (
  id uuid primary key default gen_random_uuid(),
  reel_id uuid not null references public.reels(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(reel_id, user_id)
);

create table if not exists public.reel_reports (
  id uuid primary key default gen_random_uuid(),
  reel_id uuid not null references public.reels(id) on delete cascade,
  reported_by uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('Spam','Inappropriate content','Violence','Harassment','Misleading','Other')),
  created_at timestamptz not null default now(),
  unique(reel_id, reported_by)
);

create index if not exists reels_user_created_idx on public.reels(user_id, created_at desc);
create index if not exists reels_created_idx on public.reels(created_at desc);
create index if not exists reel_comments_reel_idx on public.reel_comments(reel_id, created_at);

alter table public.reels enable row level security;
alter table public.reel_likes enable row level security;
alter table public.reel_comments enable row level security;
alter table public.reel_saves enable row level security;
alter table public.reel_views enable row level security;
alter table public.reel_reports enable row level security;

do $$ begin create policy "public reel read" on public.reels for select using (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "create own reels" on public.reels for insert to authenticated with check (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "update own reels" on public.reels for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "delete own reels" on public.reels for delete to authenticated using (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "read likes" on public.reel_likes for select using (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "own likes" on public.reel_likes for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "read comments" on public.reel_comments for select using (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "create comments" on public.reel_comments for insert to authenticated with check (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "delete own comments" on public.reel_comments for delete to authenticated using (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "own saves" on public.reel_saves for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "own views" on public.reel_views for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "own reports" on public.reel_reports for insert to authenticated with check (auth.uid() = reported_by); exception when duplicate_object then null; end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('reels', 'reels', false, 104857600, array['video/mp4','video/webm','video/quicktime','image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public = false,
    file_size_limit = 104857600,
    allowed_mime_types = array['video/mp4','video/webm','video/quicktime','image/jpeg','image/png','image/webp'];

do $$ begin create policy "read reel storage for signed urls" on storage.objects for select using (bucket_id = 'reels'); exception when duplicate_object then null; end $$;
do $$ begin create policy "upload own reel files" on storage.objects for insert to authenticated with check (bucket_id = 'reels' and (storage.foldername(name))[1] = auth.uid()::text); exception when duplicate_object then null; end $$;
do $$ begin create policy "delete own reel files" on storage.objects for delete to authenticated using (bucket_id = 'reels' and (storage.foldername(name))[1] = auth.uid()::text); exception when duplicate_object then null; end $$;
