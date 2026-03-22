-- Email subscribers table for landing page captures
create table if not exists public.subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  source text not null default 'landing_page',
  created_at timestamptz default now()
);

-- Allow anonymous inserts (visitors aren't logged in)
alter table public.subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated users (admin) can read subscribers
create policy "Authenticated users can read subscribers"
  on public.subscribers
  for select
  to authenticated
  using (true);
