-- 1. Fix badge public exposure: replace USING(true) with a secure RPC
DROP POLICY IF EXISTS "Anyone can read badges by share_id" ON public.fym_badges;

CREATE OR REPLACE FUNCTION public.get_badge_by_share_id(p_share_id text)
RETURNS TABLE(badge_value numeric)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT badge_value FROM public.fym_badges WHERE share_id = p_share_id LIMIT 1;
$$;

-- 2. Fix subscription paywall bypass: add helper function
CREATE OR REPLACE FUNCTION public.is_subscription_active()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT subscription_status = 'active' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- 3. Update fym_entries INSERT policy to require active subscription
DROP POLICY IF EXISTS "Users can insert own entries" ON public.fym_entries;
CREATE POLICY "Users can insert own entries"
  ON public.fym_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_subscription_active());

-- 4. Update fym_scenarios ALL policy to require active subscription for writes
DROP POLICY IF EXISTS "Users can manage own scenarios" ON public.fym_scenarios;
CREATE POLICY "Users can read own scenarios"
  ON public.fym_scenarios FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scenarios"
  ON public.fym_scenarios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_subscription_active());
CREATE POLICY "Users can update own scenarios"
  ON public.fym_scenarios FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND public.is_subscription_active());
CREATE POLICY "Users can delete own scenarios"
  ON public.fym_scenarios FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. Update invisibility_scores INSERT policy
DROP POLICY IF EXISTS "Users can insert own invisibility scores" ON public.invisibility_scores;
CREATE POLICY "Users can insert own invisibility scores"
  ON public.invisibility_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_subscription_active());