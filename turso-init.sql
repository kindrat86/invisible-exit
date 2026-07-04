-- ═══════════════════════════════════════════════════════════════
-- InvisibleExit — Turso SQLite Initialization Script
-- Consolidated from 13 Supabase migrations, converted Postgres → SQLite
-- ═══════════════════════════════════════════════════════════════
-- SQLite differences from Postgres:
--   - UUIDs: use lower(hex(randomblob(16))) with formatting
--   - No TIMESTAMPTZ: use TEXT (ISO 8601 strings)
--   - No JSONB: use TEXT (SQLite stores JSON natively)
--   - No gen_random_uuid(): use a custom function or hex(randomblob(16))
--   - No pg_cron: use Vercel Cron
--   - No RLS: handle auth in app layer
--   - No auth.users: use app_users table
--   - No SERIAL: use INTEGER PRIMARY KEY AUTOINCREMENT or TEXT PRIMARY KEY
-- ═══════════════════════════════════════════════════════════════

-- Helper: generate a UUID-like string
CREATE TABLE IF NOT EXISTS _uuid_helper (dummy TEXT);

-- ═══ app_users (replaces Supabase auth.users) ═══
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  stripe_customer_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'inactive'
    CHECK (subscription_status IN ('active', 'inactive', 'past_due', 'trialing', 'canceled')),
  subscription_tier TEXT NOT NULL DEFAULT 'starter'
    CHECK (subscription_tier IN ('starter', 'founding', 'standard')),
  monthly_validations_used INTEGER NOT NULL DEFAULT 0,
  validations_reset_at TEXT NOT NULL DEFAULT (datetime('now')),
  ideas_browsed_total INTEGER NOT NULL DEFAULT 0,
  magic_link_token TEXT,
  magic_link_expires TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_stripe ON app_users(stripe_customer_id);

-- Updated_at trigger
CREATE TRIGGER IF NOT EXISTS app_users_updated_at
  AFTER UPDATE ON app_users
  FOR EACH ROW
  BEGIN
    UPDATE app_users SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

-- ═══ profiles ═══
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'inactive'
    CHECK (subscription_status IN ('active', 'inactive', 'past_due', 'trialing', 'canceled')),
  subscription_tier TEXT NOT NULL DEFAULT 'starter'
    CHECK (subscription_tier IN ('starter', 'founding', 'standard')),
  monthly_validations_used INTEGER NOT NULL DEFAULT 0,
  validations_reset_at TEXT NOT NULL DEFAULT (datetime('now')),
  ideas_browsed_total INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_profiles_founding_active ON profiles(subscription_tier, subscription_status);

CREATE TRIGGER IF NOT EXISTS profiles_updated_at
  AFTER UPDATE ON profiles
  FOR EACH ROW
  BEGIN
    UPDATE profiles SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

-- ═══ fym_entries ═══
CREATE TABLE IF NOT EXISTS fym_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  runway_months INTEGER NOT NULL CHECK (runway_months >= 1 AND runway_months <= 120),
  monthly_burn REAL NOT NULL CHECK (monthly_burn >= 0),
  monthly_revenue REAL NOT NULL CHECK (monthly_revenue >= 0),
  fym_monthly REAL NOT NULL,
  fym_total REAL NOT NULL,
  fym_freedom_number REAL NOT NULL,
  monthly_growth_rate REAL DEFAULT 15,
  corporate_salary REAL DEFAULT 0,
  target_monthly_revenue REAL DEFAULT 4000,
  freedom_level INTEGER DEFAULT 0 CHECK (freedom_level BETWEEN 0 AND 5),
  combined_readiness_score REAL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_fym_entries_user_id ON fym_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_fym_entries_not_deleted ON fym_entries(user_id) WHERE deleted_at IS NULL;

-- ═══ fym_badges ═══
CREATE TABLE IF NOT EXISTS fym_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  badge_value REAL NOT NULL,
  share_id TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_fym_badges_share_id ON fym_badges(share_id);

-- ═══ fym_scenarios ═══
CREATE TABLE IF NOT EXISTS fym_scenarios (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL DEFAULT 'Scenario A',
  starting_revenue REAL NOT NULL DEFAULT 0,
  monthly_growth_rate REAL NOT NULL DEFAULT 15,
  monthly_expenses REAL NOT NULL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_fym_scenarios_user ON fym_scenarios(user_id, sort_order);

-- ═══ invisibility_scores ═══
CREATE TABLE IF NOT EXISTS invisibility_scores (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL DEFAULT 0,
  entity_score INTEGER NOT NULL DEFAULT 0,
  digital_score INTEGER NOT NULL DEFAULT 0,
  compliance_score INTEGER NOT NULL DEFAULT 0,
  operational_score INTEGER NOT NULL DEFAULT 0,
  financial_score INTEGER NOT NULL DEFAULT 0,
  answers TEXT NOT NULL DEFAULT '{}',
  fixes_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_invisibility_scores_user_id ON invisibility_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_invisibility_scores_created_at ON invisibility_scores(user_id, created_at DESC);

-- ═══ subscribers ═══
CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'landing_page',
  created_at TEXT DEFAULT (datetime('now'))
);

-- ═══ roadmap_features ═══
CREATE TABLE IF NOT EXISTS roadmap_features (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══ roadmap_votes ═══
CREATE TABLE IF NOT EXISTS roadmap_votes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  feature_id TEXT NOT NULL REFERENCES roadmap_features(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, feature_id)
);

-- ═══ roadmap_requests ═══
CREATE TABLE IF NOT EXISTS roadmap_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed initial roadmap features
INSERT OR IGNORE INTO roadmap_features (id, title, description) VALUES
  (lower(hex(randomblob(16))), 'AI-Powered Exit Readiness Score', 'Get a real-time assessment of how ready your business is for a silent exit, combining revenue, anonymity, and risk factors.'),
  (lower(hex(randomblob(16))), 'Automated Entity Formation Wizard', 'Step-by-step guide to set up holding companies and trusts across jurisdictions without revealing your identity.'),
  (lower(hex(randomblob(16))), 'Revenue Stream Diversification Planner', 'Map out new income channels to reduce single-point-of-failure risk and accelerate your freedom number.'),
  (lower(hex(randomblob(16))), 'Stealth Brand Identity Generator', 'Create anonymous brand assets, logos, and messaging without revealing your real identity or employer.'),
  (lower(hex(randomblob(16))), 'Peer Mastermind Matching', 'Get matched with other founding members at your stage for anonymous accountability and strategy sessions.'),
  (lower(hex(randomblob(16))), 'Tax Optimization Playbook', 'Jurisdiction-specific guides on structuring your side income to minimize tax liability legally.'),
  (lower(hex(randomblob(16))), 'Automated MRR Tracking Integrations', 'Connect Stripe, Gumroad, or Paddle to auto-import revenue data into your FYM calculator.'),
  (lower(hex(randomblob(16))), 'Content Repurposing Engine', 'Turn one piece of content into 10 formats automatically — blog, tweets, LinkedIn, email, shorts.'),
  (lower(hex(randomblob(16))), 'Competitor Intelligence Dashboard', 'Track competitor pricing, features, and positioning changes in your niche automatically.'),
  (lower(hex(randomblob(16))), 'Exit Simulation Mode', 'Model what happens if you quit today: runway, income gaps, insurance, and a 90-day transition plan.'),
  (lower(hex(randomblob(16))), 'Anonymous Networking Directory', 'Find and connect with other invisible entrepreneurs in your industry without exposing your identity.'),
  (lower(hex(randomblob(16))), 'Micro-SaaS Idea Validator with Market Data', 'Validate ideas with real search volume, competitor analysis, and TAM estimates before you build.');

-- ═══ feature_requests ═══
CREATE TABLE IF NOT EXISTS feature_requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK (length(title) <= 150),
  description TEXT NOT NULL CHECK (length(description) <= 500),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'under_review', 'planned', 'in_progress', 'shipped')),
  vote_count INTEGER NOT NULL DEFAULT 0,
  submitted_by TEXT REFERENCES app_users(id) ON DELETE SET NULL,
  submitted_email TEXT,
  is_approved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_feature_requests_board ON feature_requests (is_approved, vote_count DESC);

CREATE TRIGGER IF NOT EXISTS feature_requests_updated_at
  AFTER UPDATE ON feature_requests
  FOR EACH ROW
  BEGIN
    UPDATE feature_requests SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

-- Seed: 10 pre-approved feature requests
INSERT OR IGNORE INTO feature_requests (id, title, description, status, vote_count, is_approved) VALUES
  (lower(hex(randomblob(16))), 'Stripe and PayPal unified revenue view', 'See all income streams from Stripe, PayPal, and other payment processors in a single dashboard with unified MRR and churn calculations.', 'planned', 18, 1),
  (lower(hex(randomblob(16))), 'AI business idea scorer with market size estimates', 'Score each micro-SaaS idea by market size, competition level, time investment, and invisibility compatibility.', 'under_review', 22, 1),
  (lower(hex(randomblob(16))), 'Employer detection alert system', 'Real-time alerts if your digital footprint becomes visible to your employer.', 'in_progress', 15, 1),
  (lower(hex(randomblob(16))), 'Weekly email digest of revenue changes', 'Every Monday morning, get a summary of what changed: new subscribers, churn, MRR movement, and exit timeline.', 'under_review', 19, 1),
  (lower(hex(randomblob(16))), 'Dark mode for all dashboard tools', 'Full dark mode across all dashboard tools.', 'planned', 25, 1),
  (lower(hex(randomblob(16))), 'Mobile app for revenue tracking', 'Native iOS and Android app for MRR and exit timeline on the go.', 'under_review', 16, 1),
  (lower(hex(randomblob(16))), 'Anonymized community benchmarks', 'See how your revenue and timeline compare to other members. Fully anonymized.', 'planned', 20, 1),
  (lower(hex(randomblob(16))), 'AI-generated monthly progress report', 'Automated PDF report summarizing revenue trajectory, milestones, risk areas, and recommended actions.', 'under_review', 14, 1),
  (lower(hex(randomblob(16))), 'Integration with Wise and Revolut for international income', 'Connect Wise and Revolut to track international revenue streams and currency conversions.', 'under_review', 12, 1),
  (lower(hex(randomblob(16))), 'Compliance checklist by country', 'Country-specific checklists for running a side business while employed.', 'in_progress', 17, 1);

-- ═══ feature_votes ═══
CREATE TABLE IF NOT EXISTS feature_votes (
  id TEXT PRIMARY KEY,
  feature_id TEXT NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (feature_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_feature_votes_feature ON feature_votes (feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_user ON feature_votes (user_id);

-- ═══ user_subscriptions ═══
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'inactive',
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro')),
  current_period_end TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_user_subs_stripe_cid ON user_subscriptions(stripe_customer_id);

-- ═══ email_sequence_schedule ═══
CREATE TABLE IF NOT EXISTS email_sequence_schedule (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  sequence TEXT NOT NULL DEFAULT 'soap_opera',
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  days_sent TEXT NOT NULL DEFAULT '[]',
  completed_at TEXT,
  converted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_email_seq_email ON email_sequence_schedule(email);
CREATE INDEX IF NOT EXISTS idx_email_seq_pending ON email_sequence_schedule(sequence, completed_at);

-- ═══ referrals ═══
CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referrer_email TEXT,
  referrer_code TEXT NOT NULL UNIQUE,
  referred_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reward_applied INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referrer_code);

-- Done. All tables, indexes, triggers, and seed data ready.
-- Note: days_sent is stored as JSON TEXT array (SQLite has no array type).
--       The API layer handles JSON.parse/stringify.
