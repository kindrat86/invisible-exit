-- Migration: Add Starter tier usage tracking columns and helper functions
-- Purpose: Track monthly validations and ideas browsed for Starter tier limits

-- Add tracking columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS monthly_validations_used integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS validations_reset_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS ideas_browsed_total integer NOT NULL DEFAULT 0;

-- Function: get remaining validations for a user (lazy monthly reset)
CREATE OR REPLACE FUNCTION public.get_starter_validations_remaining(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier text;
  v_used integer;
  v_reset_at timestamptz;
BEGIN
  SELECT subscription_tier, monthly_validations_used, validations_reset_at
  INTO v_tier, v_used, v_reset_at
  FROM profiles WHERE id = p_user_id;

  -- Founding/standard get unlimited
  IF v_tier != 'starter' THEN RETURN 999; END IF;

  -- Lazy reset: if last reset was before start of current month, reset counter
  IF v_reset_at < date_trunc('month', now()) THEN
    UPDATE profiles
    SET monthly_validations_used = 0, validations_reset_at = now()
    WHERE id = p_user_id;
    RETURN 3;
  END IF;

  RETURN GREATEST(0, 3 - v_used);
END;
$$;

-- Function: increment validation counter after a validation is completed
CREATE OR REPLACE FUNCTION public.increment_validation_count(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET monthly_validations_used = monthly_validations_used + 1
  WHERE id = p_user_id;
END;
$$;

-- Function: increment ideas browsed counter, returns new total
CREATE OR REPLACE FUNCTION public.increment_ideas_browsed(p_user_id uuid, p_count integer DEFAULT 10)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_total integer;
BEGIN
  UPDATE profiles
  SET ideas_browsed_total = ideas_browsed_total + p_count
  WHERE id = p_user_id
  RETURNING ideas_browsed_total INTO v_new_total;
  RETURN v_new_total;
END;
$$;
