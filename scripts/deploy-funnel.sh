#!/bin/bash
# ═══════════════════════════════════════════════════════════
# INVISIBLE EXIT — FULL FUNNEL DEPLOYMENT SCRIPT
# Deploys: SQL migrations + Edge Functions + Cron schedule
#
# Usage:
#   ./scripts/deploy-funnel.sh
#
# Prerequisites:
#   - npm install -g supabase
#   - supabase login
# ═══════════════════════════════════════════════════════════

set -e

PROJECT_REF="maybpahtbbcxnucposjy"
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BOLD}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  INVISIBLE EXIT — FUNNEL DEPLOYMENT                   ${NC}"
echo -e "${BOLD}═══════════════════════════════════════════════════════${NC}"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo -e "${RED}✗ supabase CLI not found. Installing...${NC}"
  npm install -g supabase
fi

# Check login
echo -e "${YELLOW}→ Checking Supabase auth...${NC}"
if ! supabase projects list &> /dev/null; then
  echo -e "${YELLOW}  Please login to Supabase:${NC}"
  supabase login
fi

echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

# ── 1. Run SQL Migration ──
echo -e "${BOLD}[1/4] Running SQL migration (email_sequence_schedule + referrals)...${NC}"
supabase db execute --project-ref "$PROJECT_REF" \
  < supabase/migrations/20260704000001_email_sequence_and_referrals.sql
echo -e "${GREEN}✓ Tables created${NC}"
echo ""

# ── 2. Deploy email-sequence Edge Function ──
echo -e "${BOLD}[2/4] Deploying email-sequence Edge Function...${NC}"
supabase functions deploy email-sequence --project-ref "$PROJECT_REF"
echo -e "${GREEN}✓ email-sequence deployed${NC}"
echo ""

# ── 3. Deploy email-sequence-scheduler Edge Function ──
echo -e "${BOLD}[3/4] Deploying email-sequence-scheduler Edge Function...${NC}"
supabase functions deploy email-sequence-scheduler --project-ref "$PROJECT_REF"
echo -e "${GREEN}✓ email-sequence-scheduler deployed${NC}"
echo ""

# ── 4. Set up daily cron schedule ──
echo -e "${BOLD}[4/4] Setting up daily cron schedule (8am UTC)...${NC}"
echo -e "${YELLOW}  To enable the daily email scheduler, add this cron job in:${NC}"
echo -e "${YELLOW}  Supabase Dashboard → Database → Cron (pg_cron)${NC}"
echo ""
echo -e "  Run this SQL in the Supabase SQL Editor:"
echo ""
cat << 'SQLEOF'
-- ═══ Enable daily email sequence scheduler ═══
-- Requires pg_cron extension (enable in Supabase Dashboard)

SELECT cron.schedule(
  'email-sequence-daily',
  '0 8 * * *',  -- 8:00 AM UTC daily
  $$
  SELECT net.http_post(
    url := 'https://maybpahtbbcxnucposjy.supabase.co/functions/v1/email-sequence-scheduler',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
    ),
    body := '{}'::jsonb
  );
  $$
);
SQLEOF
echo ""

echo -e "${BOLD}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ FUNNEL DEPLOYMENT COMPLETE                          ${NC}"
echo -e "${BOLD}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BOLD}What's now active:${NC}"
echo -e "  • ${GREEN}email_sequence_schedule${NC} table (tracks subscriber sequences)"
echo -e "  • ${GREEN}referrals${NC} table (tracks referral codes)"
echo -e "  • ${GREEN}email-sequence${NC} Edge Function (sends individual emails)"
echo -e "  • ${GREEN}email-sequence-scheduler${NC} Edge Function (daily batch sender)"
echo ""
echo -e "${BOLD}Final step:${NC} Run the cron SQL above in Supabase SQL Editor"
echo -e "to enable automatic daily email sending."
