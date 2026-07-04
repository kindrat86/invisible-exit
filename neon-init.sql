-- ═══════════════════════════════════════════════════════════════
-- InvisibleExit — Neon Postgres Initialization Script
-- Consolidated from 13 Supabase migrations, adapted for plain Postgres
-- (removes auth.users, RLS, pg_cron, pg_net — handled in app layer)
-- ═══════════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══ app_users (replaces Supabase auth.users) ═══
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  stripe_customer_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'inactive'
    CHECK (subscription_status IN ('active', 'inactive', 'past_due', 'trialing', 'canceled')),
  subscription_tier TEXT NOT NULL DEFAULT 'starter'
    CHECK (subscription_tier IN ('starter', 'founding', 'standard')),
  monthly_validations_used INTEGER NOT NULL DEFAULT 0,
  validations_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ideas_browsed_total INTEGER NOT NULL DEFAULT 0,
  magic_link_token TEXT,
  magic_link_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_stripe ON app_users(stripe_customer_id);

-- ═══ profiles (now references app_users instead of auth.users) ═══
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES app_users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'inactive'
    CHECK (subscription_status IN ('active', 'inactive', 'past_due', 'trialing', 'canceled')),
  subscription_tier TEXT NOT NULL DEFAULT 'starter'
    CHECK (subscription_tier IN ('starter', 'founding', 'standard')),
  monthly_validations_used INTEGER NOT NULL DEFAULT 0,
  validations_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ideas_browsed_total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ═══ fym_entries ═══
CREATE TABLE IF NOT EXISTS fym_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE NOT NULL,
  runway_months INTEGER NOT NULL CHECK (runway_months >= 1 AND runway_months <= 120),
  monthly_burn NUMERIC(12,2) NOT NULL CHECK (monthly_burn >= 0),
  monthly_revenue NUMERIC(12,2) NOT NULL CHECK (monthly_revenue >= 0),
  fym_monthly NUMERIC(12,2) NOT NULL,
  fym_total NUMERIC(14,2) NOT NULL,
  fym_freedom_number NUMERIC(14,2) NOT NULL,
  monthly_growth_rate NUMERIC(5,2) DEFAULT 15,
  corporate_salary NUMERIC(14,2) DEFAULT 0,
  target_monthly_revenue NUMERIC(12,2) DEFAULT 4000,
  freedom_level INTEGER DEFAULT 0 CHECK (freedom_level BETWEEN 0 AND 5),
  combined_readiness_score NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_fym_entries_user_id ON fym_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_fym_entries_not_deleted ON fym_entries(user_id) WHERE deleted_at IS NULL;

-- ═══ fym_badges ═══
CREATE TABLE IF NOT EXISTS fym_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE NOT NULL,
  badge_value NUMERIC(14,2) NOT NULL,
  share_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fym_badges_share_id ON fym_badges(share_id);

-- ═══ fym_scenarios ═══
CREATE TABLE IF NOT EXISTS fym_scenarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL DEFAULT 'Scenario A',
  starting_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  monthly_growth_rate NUMERIC(5,2) NOT NULL DEFAULT 15,
  monthly_expenses NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_fym_scenarios_user ON fym_scenarios(user_id, sort_order);

-- ═══ invisibility_scores ═══
CREATE TABLE IF NOT EXISTS invisibility_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL DEFAULT 0,
  entity_score INTEGER NOT NULL DEFAULT 0,
  digital_score INTEGER NOT NULL DEFAULT 0,
  compliance_score INTEGER NOT NULL DEFAULT 0,
  operational_score INTEGER NOT NULL DEFAULT 0,
  financial_score INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  fixes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_invisibility_scores_user_id ON invisibility_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_invisibility_scores_created_at ON invisibility_scores(user_id, created_at DESC);

-- ═══ subscribers ═══
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'landing_page',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ roadmap_features ═══
CREATE TABLE IF NOT EXISTS roadmap_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══ roadmap_votes ═══
CREATE TABLE IF NOT EXISTS roadmap_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES roadmap_features(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, feature_id)
);

-- ═══ roadmap_requests ═══
CREATE TABLE IF NOT EXISTS roadmap_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial roadmap features
INSERT INTO roadmap_features (title, description) VALUES
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
  ('Micro-SaaS Idea Validator with Market Data', 'Validate ideas with real search volume, competitor analysis, and TAM estimates before you build.')
ON CONFLICT DO NOTHING;

-- ═══ feature_requests ═══
CREATE TABLE IF NOT EXISTS feature_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL CHECK (char_length(title) <= 150),
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'under_review', 'planned', 'in_progress', 'shipped')),
  vote_count INTEGER NOT NULL DEFAULT 0,
  submitted_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  submitted_email TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_feature_requests_board ON feature_requests (is_approved, vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_feature_requests_pending ON feature_requests (is_approved, created_at DESC);

CREATE TRIGGER set_feature_requests_updated_at
  BEFORE UPDATE ON feature_requests
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Seed: 10 pre-approved feature requests
INSERT INTO feature_requests (title, description, status, vote_count, is_approved) VALUES
  ('Stripe and PayPal unified revenue view', 'See all income streams from Stripe, PayPal, and other payment processors in a single dashboard with unified MRR and churn calculations.', 'planned', 18, true),
  ('AI business idea scorer with market size estimates', 'Score each micro-SaaS idea by market size, competition level, time investment, and invisibility compatibility.', 'under_review', 22, true),
  ('Employer detection alert system', 'Real-time alerts if your digital footprint becomes visible to your employer.', 'in_progress', 15, true),
  ('Weekly email digest of revenue changes', 'Every Monday morning, get a summary of what changed: new subscribers, churn, MRR movement, and exit timeline.', 'under_review', 19, true),
  ('Dark mode for all dashboard tools', 'Full dark mode across all dashboard tools.', 'planned', 25, true),
  ('Mobile app for revenue tracking', 'Native iOS and Android app for MRR and exit timeline on the go.', 'under_review', 16, true),
  ('Anonymized community benchmarks', 'See how your revenue and timeline compare to other members. Fully anonymized.', 'planned', 20, true),
  ('AI-generated monthly progress report', 'Automated PDF report summarizing revenue trajectory, milestones, risk areas, and recommended actions.', 'under_review', 14, true),
  ('Integration with Wise and Revolut for international income', 'Connect Wise and Revolut to track international revenue streams and currency conversions.', 'under_review', 12, true),
  ('Compliance checklist by country', 'Country-specific checklists for running a side business while employed.', 'in_progress', 17, true)
ON CONFLICT DO NOTHING;

-- ═══ feature_votes ═══
CREATE TABLE IF NOT EXISTS feature_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_id UUID NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (feature_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_feature_votes_feature ON feature_votes (feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_user ON feature_votes (user_id);

-- ═══ feature_request_limits ═══
CREATE TABLE IF NOT EXISTS feature_request_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL,
  submission_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, month_year)
);

-- ═══ user_subscriptions ═══
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'inactive',
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro')),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id)
);
CREATE INDEX IF NOT EXISTS idx_user_subs_stripe_cid ON user_subscriptions(stripe_customer_id);

-- ═══ email_sequence_schedule ═══
CREATE TABLE IF NOT EXISTS email_sequence_schedule (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  sequence TEXT NOT NULL DEFAULT 'soap_opera',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  days_sent INT[] NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_seq_email ON email_sequence_schedule(email);
CREATE INDEX IF NOT EXISTS idx_email_seq_pending ON email_sequence_schedule(sequence, completed_at)
  WHERE completed_at IS NULL;

-- ═══ referrals ═══
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_email TEXT,
  referrer_code TEXT NOT NULL UNIQUE,
  referred_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reward_applied BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referrer_code);

-- ═══ Helper functions ═══
CREATE OR REPLACE FUNCTION get_founding_member_count()
RETURNS integer LANGUAGE sql STABLE AS $$
  SELECT COUNT(*)::integer FROM profiles
  WHERE subscription_tier = 'founding' AND subscription_status = 'active';
$$;

CREATE OR REPLACE FUNCTION handle_vote(
  p_feature_id uuid, p_user_id uuid, p_vote_type text
) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  v_existing_vote_type text;
  v_action text;
  v_final_vote_type text;
  v_new_count integer;
BEGIN
  IF p_vote_type NOT IN ('up', 'down') THEN
    RAISE EXCEPTION 'vote_type must be up or down';
  END IF;
  SELECT vote_type INTO v_existing_vote_type
  FROM feature_votes WHERE feature_id = p_feature_id AND user_id = p_user_id;
  IF v_existing_vote_type IS NULL THEN
    INSERT INTO feature_votes (feature_id, user_id, vote_type) VALUES (p_feature_id, p_user_id, p_vote_type);
    UPDATE feature_requests SET vote_count = vote_count + CASE WHEN p_vote_type = 'up' THEN 1 ELSE -1 END WHERE id = p_feature_id;
    v_action := 'added'; v_final_vote_type := p_vote_type;
  ELSIF v_existing_vote_type = p_vote_type THEN
    DELETE FROM feature_votes WHERE feature_id = p_feature_id AND user_id = p_user_id;
    UPDATE feature_requests SET vote_count = vote_count + CASE WHEN p_vote_type = 'up' THEN -1 ELSE 1 END WHERE id = p_feature_id;
    v_action := 'removed'; v_final_vote_type := NULL;
  ELSE
    UPDATE feature_votes SET vote_type = p_vote_type WHERE feature_id = p_feature_id AND user_id = p_user_id;
    UPDATE feature_requests SET vote_count = vote_count + CASE WHEN p_vote_type = 'up' THEN 2 ELSE -2 END WHERE id = p_feature_id;
    v_action := 'changed'; v_final_vote_type := p_vote_type;
  END IF;
  SELECT vote_count INTO v_new_count FROM feature_requests WHERE id = p_feature_id;
  RETURN jsonb_build_object('action', v_action, 'vote_type', v_final_vote_type, 'new_count', v_new_count);
END;
$$;

-- Done. All tables, indexes, functions, and seed data ready.
