-- 010_user_subscriptions.sql
-- Stores Stripe subscription state per user for tier-gated access.

create table if not exists public.user_subscriptions (
    id            uuid primary key default gen_random_uuid(),
    user_id       uuid not null references auth.users(id) on delete cascade,
    stripe_customer_id text,
    subscription_status text not null default 'inactive',
    tier          text not null default 'free' check (tier in ('free', 'starter', 'pro')),
    current_period_end timestamptz not null default now(),
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now(),
    constraint user_subscriptions_user_id_key unique (user_id)
  );

alter table public.user_subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on public.user_subscriptions for all
  using (auth.role() = 'service_role');

create index if not exists idx_user_subs_stripe_cid
  on public.user_subscriptions(stripe_customer_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_user_subscriptions_updated_at
  before update on public.user_subscriptions
  for each row execute function public.set_updated_at();
