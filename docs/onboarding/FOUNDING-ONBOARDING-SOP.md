# Founding customer onboarding SOP

Status: internal readiness document. Do not send automatically.

## Trigger

Start this SOP only after the private buyer monitor records one of these Stripe facts:

- a new active Invisible Exit subscription, or
- a new succeeded payment from a customer tied to an Invisible Exit subscription.

The monitor writes the private record to:

`~/.hermes/private/invisibleexit-buyers.jsonl`

A Telegram alert is a notification, not the source of truth. Verify the matching Stripe record before contacting the buyer.

## 1. Verify the payment

1. Open the newest private buyer record.
2. Confirm the Stripe source ID, customer ID, amount, currency, status, and email.
3. Read the matching Stripe subscription or payment intent.
4. Confirm the product name starts with `Invisible Exit` and the subscription is active or the payment intent succeeded.
5. If any field disagrees, stop. Do not contact the buyer until the record is reconciled.

## 2. Verify account provisioning

The production webhook should do four things after `checkout.session.completed`:

1. upsert the buyer into `app_users`;
2. mirror the account into `profiles` for compatibility;
3. create a magic login link;
4. send the welcome email.

Check the matching Vercel function logs for a successful webhook event. Then verify the buyer can enter through the paid return path and reach `/dashboard`.

Do not copy JWTs, magic links, API keys, or Stripe secrets into notes, chat, Telegram, or the buyer log.

## 3. Prevent duplicate email

Before sending the manual first-customer email:

1. check whether the webhook welcome email was sent;
2. check the support inbox for a delivery failure or buyer reply;
3. search the outbound provider log for the buyer's address and subject;
4. send nothing if the automated welcome already arrived unless the buyer asks for help.

The draft is at `docs/onboarding/first-customer-email-draft.md`. It remains unsent until Maryan approves it or the buyer starts a conversation.

## 4. Manual recovery if provisioning failed

1. Identify the failed Stripe event and read the exact server error.
2. Fix the underlying application or environment problem before replaying anything.
3. Re-run the repository tests and production verification gates.
4. Retry the same Stripe event through the supported Stripe replay path. Do not create a second subscription or payment.
5. Verify one `app_users` row, one compatible `profiles` row, and one welcome email. Dedupe by the Stripe session/customer and email.
6. If replay is unavailable, use the existing `checkout-login` recovery path for the paid checkout session. Never email a raw JWT.

## 5. First 24 hours

- Confirm the buyer can open `/dashboard`.
- Confirm the account tier matches the paid Stripe price.
- Reply quickly to any buyer message. Use plain text and answer the actual problem first.
- Record bugs and requests without promising dates.
- Offer a short onboarding call only if the buyer wants one.
- Ask what they expected to do first and where they got stuck.

## 6. First week

- Check whether the buyer returned and used the dashboard.
- Send no unsolicited sequence unless its consent and unsubscribe path are verified.
- If the buyer replies, ask one focused question at a time.
- Treat the first customer's language as product research, not as public proof.
- Do not publish their name, company, quote, revenue, or usage without explicit written permission.

## Completion checklist

- [ ] Stripe payment verified
- [ ] Webhook event verified
- [ ] Account row verified
- [ ] Tier verified
- [ ] Paid return path verified
- [ ] Welcome delivery checked
- [ ] Duplicate email prevented
- [ ] Buyer issue, if any, resolved
- [ ] Private notes updated without secrets
