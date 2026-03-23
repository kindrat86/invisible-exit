-- Roadmap features table (seeded with initial ideas)
create table if not exists public.roadmap_features (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  upvotes integer not null default 0,
  downvotes integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.roadmap_features enable row level security;

create policy "Authenticated users can read features"
  on public.roadmap_features for select
  to authenticated
  using (true);

-- Roadmap votes table (one vote per user per feature)
create table if not exists public.roadmap_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_id uuid not null references public.roadmap_features(id) on delete cascade,
  vote_type text not null check (vote_type in ('up', 'down')),
  created_at timestamptz not null default now(),
  unique (user_id, feature_id)
);

alter table public.roadmap_votes enable row level security;

create policy "Users can read own votes"
  on public.roadmap_votes for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own votes"
  on public.roadmap_votes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own votes"
  on public.roadmap_votes for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own votes"
  on public.roadmap_votes for delete
  to authenticated
  using (auth.uid() = user_id);

-- Roadmap feature requests table
create table if not exists public.roadmap_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

alter table public.roadmap_requests enable row level security;

create policy "Users can insert own requests"
  on public.roadmap_requests for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own requests"
  on public.roadmap_requests for select
  to authenticated
  using (auth.uid() = user_id);

-- Seed initial feature ideas
insert into public.roadmap_features (title, description) values
  ('AI-Powered Exit Readiness Score', 'Get a real-time assessment of how ready your business is for a silent exit, combining revenue, anonymity, and risk factors.'),
  ('Automated Entity Formation Wizard', 'Step-by-step guide to set up holding companies and trusts across jurisdictions without revealing your identity.'),
  ('Revenue Stream Diversification Planner', 'Map out new income channels to reduce single-point-of-failure risk and accelerate your freedom number.'),
  ('Stealth Brand Identity Generator', 'Create anonymous brand assets, logos, and messaging without revealing your real identity or employer.'),
  ('Peer Mastermind Matching', 'Get matched with other founding members at your stage for anonymous accountability and strategy sessions.'),
  ('Tax Optimization Playbook', 'Jurisdiction-specific guides on structuring your side income to minimize tax liability legally.'),
  ('Automated MRR Tracking Integrations', 'Connect Stripe, Gumroad, or Paddle to auto-import revenue data into your FYM calculator.'),
  ('Content Repurposing Engine', 'Turn one piece of content into 10 formats automatically — blog, tweets, LinkedIn, email, shorts.'),
  ('Competitor Intelligence Dashboard', 'Track competitor pricing, features, and positioning changes in your niche automatically.'),
  ('Exit Simulation Mode', 'Model what happens if you quit today: runway, income gaps, insurance, and a 90-day transition plan.'),
  ('Anonymous Networking Directory', 'Find and connect with other invisible entrepreneurs in your industry without exposing your identity.'),
  ('Micro-SaaS Idea Validator with Market Data', 'Validate ideas with real search volume, competitor analysis, and TAM estimates before you build.');
