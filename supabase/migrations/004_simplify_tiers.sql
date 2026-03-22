-- Migration: Simplify subscription tiers for one-product model
-- Old tiers: 'fym', 'founding', 'premium'
-- New tiers: 'starter' ($0.97/mo), 'founding' ($17.99/mo), 'standard' ($97.99/mo)

-- 1. Update existing 'fym' tier users to 'starter'
UPDATE public.profiles SET subscription_tier = 'starter' WHERE subscription_tier = 'fym';

-- 2. Update existing 'premium' tier users to 'standard'
UPDATE public.profiles SET subscription_tier = 'standard' WHERE subscription_tier = 'premium';

-- 3. Drop old check constraint and add new one
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('starter', 'founding', 'standard'));

-- 4. Change default tier to 'starter'
ALTER TABLE public.profiles ALTER COLUMN subscription_tier SET DEFAULT 'starter';

-- 5. Create function to get founding member count (for OTO page scarcity counter)
CREATE OR REPLACE FUNCTION public.get_founding_member_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.profiles
  WHERE subscription_tier = 'founding' AND subscription_status = 'active';
$$;

-- 6. Create function to check if user has full access (founding or standard)
CREATE OR REPLACE FUNCTION public.has_full_access()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT subscription_tier IN ('founding', 'standard')
     AND subscription_status = 'active'
     FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- 7. Index for fast founding member count queries
CREATE INDEX IF NOT EXISTS idx_profiles_founding_active
  ON public.profiles(subscription_tier)
  WHERE subscription_tier = 'founding' AND subscription_status = 'active';
