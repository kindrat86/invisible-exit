-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Profiles table (linked to Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  stripe_customer_id text,
  subscription_status text not null default 'inactive'
    check (subscription_status in ('active', 'inactive', 'past_due', 'trialing', 'canceled')),
  subscription_tier text not null default 'fym'
    check (subscription_tier in ('fym', 'founding', 'premium')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- FYM Entries table
create table public.fym_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  runway_months integer not null check (runway_months >= 1 and runway_months <= 120),
  monthly_burn numeric(12,2) not null check (monthly_burn >= 0),
  monthly_revenue numeric(12,2) not null check (monthly_revenue >= 0),
  fym_monthly numeric(12,2) not null,
  fym_total numeric(14,2) not null,
  fym_freedom_number numeric(14,2) not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- FYM Badges table (for shareable badges)
create table public.fym_badges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_value numeric(14,2) not null,
  share_id text unique not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_fym_badges_share_id on public.fym_badges(share_id);
create index idx_fym_entries_user_id on public.fym_entries(user_id);
create index idx_fym_entries_not_deleted on public.fym_entries(user_id) where deleted_at is null;

-- Updated_at trigger for profiles
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ROW LEVEL SECURITY

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- INSERT on profiles is done by Edge Function using service role key (bypasses RLS)

alter table public.fym_entries enable row level security;

create policy "Users can read own entries"
  on public.fym_entries for select using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.fym_entries for insert with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.fym_entries for update using (auth.uid() = user_id);

create policy "Users can delete own entries"
  on public.fym_entries for delete using (auth.uid() = user_id);

alter table public.fym_badges enable row level security;

create policy "Users can read own badges"
  on public.fym_badges for select using (auth.uid() = user_id);

create policy "Anyone can read badges by share_id"
  on public.fym_badges for select using (true);

create policy "Users can insert own badges"
  on public.fym_badges for insert with check (auth.uid() = user_id);

create policy "Users can delete own badges"
  on public.fym_badges for delete using (auth.uid() = user_id);
