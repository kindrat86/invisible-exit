-- ═══ Email Sequence Schedule Table ═══
-- Tracks subscriber progress through the Soap Opera and Seinfeld sequences
-- The email-sequence-scheduler Edge Function checks this table daily

CREATE TABLE IF NOT EXISTS email_sequence_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

ALTER TABLE IF EXISTS email_sequence_schedule ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (Edge Functions use service role key)
CREATE POLICY "Service role full access" ON email_sequence_schedule
  FOR ALL USING (auth.role() = 'service_role');

-- Allow anon inserts (from newsletter subscribe form)
CREATE POLICY "Anon can insert" ON email_sequence_schedule
  FOR INSERT WITH CHECK (true);

-- Allow users to read their own rows by email
CREATE POLICY "Users read own" ON email_sequence_schedule
  FOR SELECT USING (true);

-- ═══ Referral Tracking Table ═══
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_email TEXT,
  referrer_code TEXT NOT NULL UNIQUE,
  referred_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reward_applied BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referrer_code);

ALTER TABLE IF EXISTS referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access referrals" ON referrals
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Anon read referrals" ON referrals FOR SELECT USING (true);
