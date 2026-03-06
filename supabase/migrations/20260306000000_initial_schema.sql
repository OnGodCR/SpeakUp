-- ============================================================================
-- SpeakUp Initial Schema
-- ============================================================================

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null,
  avatar_url text,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  total_xp integer not null default 0,
  level integer not null default 1,
  last_challenge_date date,
  streak_shield_available boolean not null default false,
  notification_time time,
  timezone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Daily challenges
create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  challenge_date date not null unique,
  topic text not null,
  category text not null,
  difficulty_tier text not null default 'beginner',
  hint text,
  created_at timestamptz not null default now()
);

-- Speech submissions
create table public.speeches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  audio_path text not null,
  duration_seconds integer not null,
  status text not null default 'processing' check (status in ('processing', 'analyzed', 'failed')),
  created_at timestamptz not null default now()
);

-- Speech scores
create table public.scores (
  id uuid primary key default gen_random_uuid(),
  speech_id uuid not null unique references public.speeches(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  overall_score integer not null,
  clarity_score integer not null,
  pace_score integer not null,
  structure_score integer not null,
  filler_word_count integer not null default 0,
  filler_words_per_min numeric(4,1) not null default 0,
  words_per_minute integer not null default 0,
  speaking_pct integer not null default 0,
  feedback_text text,
  key_improvement text,
  xp_earned integer not null default 0,
  created_at timestamptz not null default now()
);

-- Friends (bidirectional)
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  friend_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  unique (user_id, friend_id)
);

-- ============================================================================
-- Indexes
-- ============================================================================

create index idx_speeches_user_id on public.speeches(user_id);
create index idx_speeches_challenge_id on public.speeches(challenge_id);
create index idx_speeches_created_at on public.speeches(created_at desc);
create index idx_scores_user_id on public.scores(user_id);
create index idx_scores_speech_id on public.scores(speech_id);
create index idx_challenges_date on public.challenges(challenge_date);
create index idx_friendships_user_id on public.friendships(user_id);
create index idx_friendships_friend_id on public.friendships(friend_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.users enable row level security;
alter table public.challenges enable row level security;
alter table public.speeches enable row level security;
alter table public.scores enable row level security;
alter table public.friendships enable row level security;

-- Users: can read own profile, update own profile
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Challenges: all authenticated users can read
create policy "Authenticated users can view challenges"
  on public.challenges for select
  to authenticated
  using (true);

-- Speeches: users can read/insert own
create policy "Users can view own speeches"
  on public.speeches for select
  using (auth.uid() = user_id);

create policy "Users can insert own speeches"
  on public.speeches for insert
  with check (auth.uid() = user_id);

-- Scores: users can read own
create policy "Users can view own scores"
  on public.scores for select
  using (auth.uid() = user_id);

-- Friendships: users can manage their own
create policy "Users can view own friendships"
  on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can create friendships"
  on public.friendships for insert
  with check (auth.uid() = user_id);

create policy "Users can update friendships addressed to them"
  on public.friendships for update
  using (auth.uid() = friend_id);

-- ============================================================================
-- RPC: Increment user XP and auto-level
-- ============================================================================

create or replace function public.increment_user_xp(p_user_id uuid, p_xp integer)
returns void
language plpgsql
security definer
as $$
declare
  v_new_xp integer;
  v_new_level integer;
  v_xp_table integer[] := array[
    0, 100, 200, 350, 500, 700, 900, 1100, 1300, 1500,
    1800, 2100, 2500, 3000, 3500, 4100, 4700, 5400, 5900, 6500,
    7200, 8000, 8800, 9400, 10000
  ];
begin
  update public.users
  set total_xp = total_xp + p_xp,
      updated_at = now()
  where id = p_user_id
  returning total_xp into v_new_xp;

  -- Calculate new level
  v_new_level := 1;
  for i in 2..array_length(v_xp_table, 1) loop
    if v_new_xp >= v_xp_table[i] then
      v_new_level := i;
    else
      exit;
    end if;
  end loop;

  update public.users
  set level = v_new_level,
      updated_at = now()
  where id = p_user_id and level < v_new_level;
end;
$$;

-- ============================================================================
-- Updated_at trigger
-- ============================================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- Storage bucket for audio recordings
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('speech-recordings', 'speech-recordings', false);

create policy "Users can upload own recordings"
  on storage.objects for insert
  with check (
    bucket_id = 'speech-recordings' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can read own recordings"
  on storage.objects for select
  using (
    bucket_id = 'speech-recordings' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
