# Meta (Facebook/Instagram) Retargeting Campaign — Setup Guide
# =================================================================
# TRAFFIC SECRETS Sec 6-10: Traffic You Control
# Pixel ID: 1278454893564033 (already installed on invisibleexit.com)
# Ads account: Configured (AW-18046014876)

## CAMPAIGN 1: Retargeting — Warm Traffic → $0.97 Offer
## =================================================================
## Audience: Anyone who visited invisibleexit.com in the last 90 days
##           AND did NOT visit /start or /checkout/success (exclude converters)
## Budget: $10/day
## Goal: Conversions (Purchase — starter subscription)

### Ad Set 1: The Stack (Value-focused)
**Headline:** 5 AI Tools for $0.97/Month. Total Value: $328/mo.
**Primary Text:**
  You visited Invisible Exit. Here's what $0.97/month actually gets you:

  → FYM Dashboard — tracks your exit timeline ($12/mo value)
  → Idea Pipeline — 500+ validated ideas with AI scoring ($15/mo value)
  → Stealth Ops Hub — employer-proof entity setup ($25/mo value)
  → Launch Control — ship products in 5 hrs/week ($18/mo value)
  → Brand Manager — faceless audience building ($27/mo value)
  + 3 exclusive bonuses ($101 value)

  Total value: $328/month. Founding member price: $0.97/month.

  **Image:** The 5-tool SVG diagram from the homepage (dark navy w/ blue circles)

### Ad Set 2: The Fear (Pain-focused)
**Headline:** Every Month You Wait Costs You $4,000
**Primary Text:**
  Still thinking about it? Your boss isn't thinking about giving you a raise.

  While you wait:
  - Your 0.5% equity isn't growing
  - Your golden handcuffs are getting tighter
  - Someone else is building YOUR idea

  The Freedom Number Calculator takes 90 seconds.
  See exactly how much MRR you need to walk away.

  **Image:** The "Death of the Old Vehicle" equity math breakdown from the homepage

### Ad Set 3: The Calculator (Curiosity)
**Headline:** Your Employer Will Never Know. See Your Freedom Number Now.
**Primary Text:**
  A Managing Director earning $165K built a $4,100/month side business
  in 14 months — working 5 hours/week. His employer still doesn't know.

  Calculate your freedom number in 90 seconds. Free. No credit card.

  **Image:** Mystery box / locked door visual with "Your Freedom Number" text overlay

## CAMPAIGN 2: Lookalike Audience — Cold Traffic → Calculator
## =================================================================
## Prerequisite: You need at least 100 email subscribers for Lookalike
## (Currently 0 — this is blocked until email capture is working)

## CAMPAIGN 3: Instagram Story Ads — Curiosity Hook
## =================================================================
## Budget: $5/day
## Format: Story (9:16 vertical)
## Creative: Text-over-dark-bg — "The Cage Has a Door. Here's the Key."
## Swipe up → Freedom Number Calculator (/freedom)

## ── Creative Specs ──
## Image: 1080x1080 (feed), 1080x1920 (story)
## Headline: 40 chars max
## Primary Text: 125 chars max (truncated after)
## CTA Button: "Learn More" or "Sign Up"

## ── Tracking ──
## Standard Events (already firing via pixel):
##   PageView — every page
##   Lead — email capture (InvisibleExit inline squeeze)
##   Purchase — checkout success (/checkout/success)
##
## Custom Conversions to create:
##   - "Calculator Started" — URL contains /freedom
##   - "Email Captured" — URL contains ?subscribed=true
##   - "Started Checkout" — URL contains /start
