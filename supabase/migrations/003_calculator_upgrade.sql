-- Add growth rate and scenario tracking columns to fym_entries
ALTER TABLE public.fym_entries
  ADD COLUMN IF NOT EXISTS monthly_growth_rate NUMERIC(5,2) DEFAULT 15,
  ADD COLUMN IF NOT EXISTS corporate_salary NUMERIC(14,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS target_monthly_revenue NUMERIC(12,2) DEFAULT 4000,
  ADD COLUMN IF NOT EXISTS freedom_level INTEGER DEFAULT 0 CHECK (freedom_level BETWEEN 0 AND 5),
  ADD COLUMN IF NOT EXISTS combined_readiness_score NUMERIC(5,2) DEFAULT 0;

-- Scenarios table for side-by-side comparison
CREATE TABLE IF NOT EXISTS public.fym_scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL DEFAULT 'Scenario A',
  starting_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  monthly_growth_rate NUMERIC(5,2) NOT NULL DEFAULT 15,
  monthly_expenses NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.fym_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own scenarios"
  ON public.fym_scenarios FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_fym_scenarios_user ON public.fym_scenarios(user_id, sort_order);
