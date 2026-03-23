-- ============================================================
-- Feature Request Board: tables, functions, RLS, and seed data
-- ============================================================

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND email = 'escape@invisibleexit.com'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- Table: feature_requests
-- ============================================================
CREATE TABLE public.feature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) <= 150),
  description text NOT NULL CHECK (char_length(description) <= 500),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'under_review', 'planned', 'in_progress', 'shipped')),
  vote_count integer NOT NULL DEFAULT 0,
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_email text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_feature_requests_board ON public.feature_requests (is_approved, vote_count DESC);
CREATE INDEX idx_feature_requests_pending ON public.feature_requests (is_approved, created_at DESC);

CREATE TRIGGER set_feature_requests_updated_at
  BEFORE UPDATE ON public.feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

-- Authenticated users can see approved features, their own submissions, or everything if admin
CREATE POLICY "feature_requests_select"
  ON public.feature_requests FOR SELECT
  TO authenticated
  USING (is_approved = true OR submitted_by = auth.uid() OR is_admin());

-- Authenticated users can insert their own submissions
CREATE POLICY "feature_requests_insert"
  ON public.feature_requests FOR INSERT
  TO authenticated
  WITH CHECK (submitted_by = auth.uid());

-- Only admin can update
CREATE POLICY "feature_requests_update"
  ON public.feature_requests FOR UPDATE
  TO authenticated
  USING (is_admin());

-- Only admin can delete
CREATE POLICY "feature_requests_delete"
  ON public.feature_requests FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- Table: feature_votes
-- ============================================================
CREATE TABLE public.feature_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (feature_id, user_id)
);

CREATE INDEX idx_feature_votes_feature ON public.feature_votes (feature_id);
CREATE INDEX idx_feature_votes_user ON public.feature_votes (user_id);

ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feature_votes_select"
  ON public.feature_votes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "feature_votes_insert"
  ON public.feature_votes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "feature_votes_delete"
  ON public.feature_votes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- Table: feature_request_limits
-- ============================================================
CREATE TABLE public.feature_request_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year text NOT NULL,
  submission_count integer NOT NULL DEFAULT 0,
  UNIQUE (user_id, month_year)
);

ALTER TABLE public.feature_request_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feature_request_limits_select"
  ON public.feature_request_limits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "feature_request_limits_insert"
  ON public.feature_request_limits FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "feature_request_limits_update"
  ON public.feature_request_limits FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- Function: handle_vote (atomic vote toggle/switch)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_vote(
  p_feature_id uuid,
  p_user_id uuid,
  p_vote_type text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_vote_type text;
  v_action text;
  v_final_vote_type text;
  v_new_count integer;
BEGIN
  -- Check input
  IF p_vote_type NOT IN ('up', 'down') THEN
    RAISE EXCEPTION 'vote_type must be up or down';
  END IF;

  -- Look for existing vote
  SELECT vote_type INTO v_existing_vote_type
  FROM public.feature_votes
  WHERE feature_id = p_feature_id AND user_id = p_user_id;

  IF v_existing_vote_type IS NULL THEN
    -- No existing vote: insert new vote
    INSERT INTO public.feature_votes (feature_id, user_id, vote_type)
    VALUES (p_feature_id, p_user_id, p_vote_type);

    -- Adjust count
    UPDATE public.feature_requests
    SET vote_count = vote_count + CASE WHEN p_vote_type = 'up' THEN 1 ELSE -1 END
    WHERE id = p_feature_id;

    v_action := 'added';
    v_final_vote_type := p_vote_type;

  ELSIF v_existing_vote_type = p_vote_type THEN
    -- Same vote type: toggle off (remove vote)
    DELETE FROM public.feature_votes
    WHERE feature_id = p_feature_id AND user_id = p_user_id;

    -- Reverse count
    UPDATE public.feature_requests
    SET vote_count = vote_count + CASE WHEN p_vote_type = 'up' THEN -1 ELSE 1 END
    WHERE id = p_feature_id;

    v_action := 'removed';
    v_final_vote_type := NULL;

  ELSE
    -- Different vote type: switch vote
    UPDATE public.feature_votes
    SET vote_type = p_vote_type
    WHERE feature_id = p_feature_id AND user_id = p_user_id;

    -- Adjust count by 2 (reverse old + apply new)
    UPDATE public.feature_requests
    SET vote_count = vote_count + CASE WHEN p_vote_type = 'up' THEN 2 ELSE -2 END
    WHERE id = p_feature_id;

    v_action := 'changed';
    v_final_vote_type := p_vote_type;
  END IF;

  -- Get the updated count
  SELECT vote_count INTO v_new_count
  FROM public.feature_requests
  WHERE id = p_feature_id;

  RETURN jsonb_build_object(
    'action', v_action,
    'vote_type', v_final_vote_type,
    'new_count', v_new_count
  );
END;
$$;

-- ============================================================
-- Seed data: 10 pre-approved feature requests
-- ============================================================
INSERT INTO public.feature_requests (title, description, status, vote_count, submitted_by, submitted_email, is_approved)
VALUES
  (
    'Stripe and PayPal unified revenue view',
    'See all income streams from Stripe, PayPal, and other payment processors in a single dashboard with unified MRR and churn calculations.',
    'planned',
    floor(random() * 21 + 15)::int,
    NULL, NULL, true
  ),
  (
    'AI business idea scorer with market size estimates',
    'Score each micro-SaaS idea by market size, competition level, time investment, and invisibility compatibility. Powered by AI analysis.',
    'under_review',
    floor(random() * 21 + 15)::int,
    NULL, NULL, true
  ),
  (
    'Employer detection alert system',
    'Real-time alerts if your digital footprint becomes visible to your employer. Monitors domain registrations, social mentions, and corporate network exposure.',
    'in_progress',
    floor(random() * 21 + 15)::int,
    NULL, NULL, true
  ),
  (
    'Weekly email digest of revenue changes',
    'Every Monday morning, get a summary of what changed: new subscribers, churn events, MRR movement, and your updated exit timeline.',
    'under_review',
    floor(random() * 21 + 15)::int,
    NULL, NULL, true
  ),
  (
    'Dark mode for all dashboard tools',
    'Full dark mode across FYM Dashboard, Idea Pipeline, Stealth Ops Hub, Launch Control, and Brand Manager. Easier on the eyes during late-night sessions.',
    'planned',
    floor(random() * 21 + 15)::int,
    NULL, NULL, true
  ),
  (
    'Mobile app for revenue tracking',
    'Native iOS and Android app to check your MRR, invisibility score, and exit timeline on the go. Push notifications for milestone hits.',
    'under_review',
    floor(random() * 21 + 15)::int,
    NULL, NULL, true
  ),
  (
    'Anonymized community benchmarks',
    'See how your revenue, growth rate, and timeline compare to other Invisible Exit members. Fully anonymized. Know if you are ahead or behind.',
    'planned',
    floor(random() * 21 + 15)::int,
    NULL, NULL, true
  ),
  (
    'AI-generated monthly progress report',
    'An automated PDF report each month summarizing your revenue trajectory, completed milestones, risk areas, and recommended next actions.',
    'under_review',
    floor(random() * 21 + 15)::int,
    NULL, NULL, true
  ),
  (
    'Integration with Wise and Revolut for international income',
    'Connect Wise and Revolut accounts to track international revenue streams and currency conversions automatically inside FYM Dashboard.',
    'under_review',
    floor(random() * 21 + 15)::int,
    NULL, NULL, true
  ),
  (
    'Compliance checklist by country',
    'Country-specific checklists for running a side business while employed. Employment law, tax obligations, corporate policy norms. Starting with EU, UK, US.',
    'in_progress',
    floor(random() * 21 + 15)::int,
    NULL, NULL, true
  );
