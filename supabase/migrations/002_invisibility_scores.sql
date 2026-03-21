-- Migration: Add invisibility_scores table
-- Required by the Invisibility Score feature added to the FYM Dashboard

create table if not exists public.invisibility_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  total_score integer not null default 0,
  entity_score integer not null default 0,
  digital_score integer not null default 0,
  compliance_score integer not null default 0,
  operational_score integer not null default 0,
  financial_score integer not null default 0,
  answers jsonb not null default '{}'::jsonb,
  fixes_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Index for fast lookups by user
create index if not exists idx_invisibility_scores_user_id
  on public.invisibility_scores(user_id);

-- Index for ordering by date
create index if not exists idx_invisibility_scores_created_at
  on public.invisibility_scores(user_id, created_at desc);

-- RLS
alter table public.invisibility_scores enable row level security;

create policy "Users can read own invisibility scores"
  on public.invisibility_scores for select
  using (auth.uid() = user_id);

create policy "Users can insert own invisibility scores"
  on public.invisibility_scores for insert
  with check (auth.uid() = user_id);
