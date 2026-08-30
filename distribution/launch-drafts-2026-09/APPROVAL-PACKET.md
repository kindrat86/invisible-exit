# Invisible Exit launch approval packet

Status: prepared only. Nothing in this folder has been published.

## Recommended launch order

1. Show HN
2. X thread from @Sipiteno
3. One Reddit post, only after checking that subreddit's current rules
4. Product Hunt after current screenshots are ready and the team can answer comments for the day

Do not post all channels at once. Use the first response set to improve the next draft.

## Hard publish blockers

### 1. Pricing mismatch

The public `/start` page says `$9/month`, `$9 today`, and secure checkout. The live `starter` Checkout Session currently totals `$16` on the first charge because it includes a mandatory `$7` one-time blueprint. The `founding` tier is not the $9 offer; it charges `$17.99/month`.

Do not publish a launch while this remains undisclosed. Resolve it by either:

- removing the mandatory $7 line item from the $9 checkout, which requires explicit approval before changing Stripe pricing; or
- clearly disclosing the $16 first charge before the checkout button and correcting every inconsistent price statement.

### 2. Unsupported claims on the live site

The live homepage contains founder-history, revenue, timing, anonymity, idea-count, and outcome claims that were not verified in this mission. The launch drafts do not repeat them, but launch traffic will still see them.

Run a claims audit before publishing. Keep only claims supported by product behavior or documented evidence.

### 3. Buyer return path

Publish only after `/welcome?session_id=...` logs a paid buyer in and reaches `/dashboard` on the production apex and immutable deployment URL.

## Prepared files

- `show-hn.md`
- `product-hunt.md`
- `reddit.md`
- `x-thread.md`

## Approval choices

- Approve Show HN only
- Approve X only
- Approve one named Reddit community only
- Approve Product Hunt only
- Request edits

Approval for one channel does not authorize another. No draft authorizes cold outreach, direct messages, paid promotion, vote coordination, or personal LinkedIn/Facebook activity.

## Pre-publish checklist

- [ ] Pricing mismatch resolved
- [ ] Live claims audit completed
- [ ] Production checkout return flow verified
- [ ] Current screenshots captured
- [ ] Current platform and subreddit rules read
- [ ] Encoding preflight passed
- [ ] Exact account identity verified
- [ ] Maryan explicitly approved the named channel and final text
