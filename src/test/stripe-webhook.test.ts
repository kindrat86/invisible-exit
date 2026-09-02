import { EventEmitter } from "node:events";
import crypto from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  queryOne: vi.fn(),
  execute: vi.fn(),
  sendEmail: vi.fn(),
  triggerWinback: vi.fn(),
  recordReferralConversion: vi.fn(),
}));

vi.hoisted(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_invisibleexit_fixture";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_invisibleexit_fixture";
});

vi.mock("../../api/_lib/db", () => ({
  query: mocks.query,
  queryOne: mocks.queryOne,
  execute: mocks.execute,
}));
vi.mock("../../api/email-sequence", () => ({ sendEmail: mocks.sendEmail }));
vi.mock("../../api/winback-sequence", () => ({
  triggerWinback: mocks.triggerWinback,
}));
vi.mock("../../api/_lib/referral", () => ({
  recordReferralConversion: mocks.recordReferralConversion,
}));

import {
  default as handler,
  isOwnedCheckoutSession,
} from "../../api/stripe-webhook";

function request(payload: string) {
  const req = new EventEmitter() as EventEmitter & {
    method: string;
    headers: Record<string, string>;
  };
  req.method = "POST";
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHmac("sha256", process.env.STRIPE_WEBHOOK_SECRET!)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  req.headers = { "stripe-signature": `t=${timestamp},v1=${signature}` };
  queueMicrotask(() => {
    req.emit("data", Buffer.from(payload));
    req.emit("end");
  });
  return req;
}

function response() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
    send(body: unknown) {
      this.body = body;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
}

const foreignGitDealFlowSession = {
  id: "cs_live_b1YT1hupteOe5cvg90saJZYucg9Zu9v2MJsJ2RZArs4NTxnpp27pUle8GT",
  object: "checkout.session",
  mode: "payment",
  payment_status: "paid",
  amount_total: 100,
  currency: "eur",
  payment_link: "plink_1TU4ZvCwGoUDklReEjuprkH0",
  customer: "cus_foreign_gitdealflow",
  customer_details: { email: "foreign-gitdealflow@example.com" },
  metadata: { source: "landing-tripwire", tier: "teardown" },
  line_items: {
    data: [
      {
        price: {
          id: "price_1TU4ZuCwGoUDklRev3fh8xib",
          product: "prod_UT0aPLSENVCw5o",
        },
      },
    ],
  },
};

describe("stripe webhook ownership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.queryOne.mockResolvedValue(null);
    mocks.query.mockResolvedValue([]);
    mocks.sendEmail.mockResolvedValue({ success: true });
  });

  it("retrieves missing dynamic line items before accepting an owned checkout", async () => {
    const listLineItems = vi.fn().mockResolvedValue({
      data: [
        {
          price: {
            id: "price_1TwIP7CwGoUDklRe46yWBXPZ",
            product: "prod_UwAkYNaooSKPFc",
          },
        },
      ],
      has_more: false,
    });

    const owned = await isOwnedCheckoutSession(
      {
        ...foreignGitDealFlowSession,
        id: "cs_live_ownedfallback123",
        payment_link: null,
        line_items: undefined,
      } as never,
      listLineItems,
    );

    expect(owned).toBe(true);
    expect(listLineItems).toHaveBeenCalledWith("cs_live_ownedfallback123");
  });

  it("acknowledges the foreign GitDealFlow checkout without side effects", async () => {
    const payload = JSON.stringify({
      id: "evt_foreign_gitdealflow_fixture",
      object: "event",
      type: "checkout.session.completed",
      data: { object: foreignGitDealFlowSession },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.queryOne).not.toHaveBeenCalled();
    expect(mocks.query).not.toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.recordReferralConversion).not.toHaveBeenCalled();
  });

  it("does not let owned-looking metadata rescue a foreign Payment Link", async () => {
    const payload = JSON.stringify({
      id: "evt_foreign_payment_link_metadata_collision",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          ...foreignGitDealFlowSession,
          metadata: { product: "starter" },
          line_items: {
            data: [
              {
                price: {
                  id: "price_1TwIP7CwGoUDklRe46yWBXPZ",
                  product: "prod_UwAkYNaooSKPFc",
                },
              },
            ],
            has_more: false,
          },
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.queryOne).not.toHaveBeenCalled();
    expect(mocks.query).not.toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.recordReferralConversion).not.toHaveBeenCalled();
  });

  it("rejects a mixed checkout when any line item is foreign", async () => {
    const payload = JSON.stringify({
      id: "evt_mixed_checkout_fixture",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          ...foreignGitDealFlowSession,
          id: "cs_live_mixedcheckout123",
          payment_link: null,
          metadata: { product: "starter" },
          line_items: {
            data: [
              {
                price: {
                  id: "price_1TwIP7CwGoUDklRe46yWBXPZ",
                  product: "prod_UwAkYNaooSKPFc",
                },
              },
              foreignGitDealFlowSession.line_items.data[0],
            ],
            has_more: false,
          },
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.queryOne).not.toHaveBeenCalled();
    expect(mocks.query).not.toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.recordReferralConversion).not.toHaveBeenCalled();
  });

  it("rejects an incomplete expanded line-item page", async () => {
    const payload = JSON.stringify({
      id: "evt_paginated_checkout_fixture",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          ...foreignGitDealFlowSession,
          id: "cs_live_paginatedcheckout123",
          payment_link: null,
          metadata: { product: "starter" },
          line_items: {
            data: [
              {
                price: {
                  id: "price_1TwIP7CwGoUDklRe46yWBXPZ",
                  product: "prod_UwAkYNaooSKPFc",
                },
              },
            ],
            has_more: true,
          },
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.queryOne).not.toHaveBeenCalled();
    expect(mocks.query).not.toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.recordReferralConversion).not.toHaveBeenCalled();
  });

  it("does not fulfill an owned checkout before payment succeeds", async () => {
    const payload = JSON.stringify({
      id: "evt_unpaid_invisibleexit_fixture",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          ...foreignGitDealFlowSession,
          id: "cs_live_unpaid_invisibleexit_fixture",
          payment_status: "unpaid",
          payment_link: "plink_1TwIP7CwGoUDklRe5Y0faAyw",
          metadata: { product: "starter" },
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.queryOne).not.toHaveBeenCalled();
    expect(mocks.query).not.toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.recordReferralConversion).not.toHaveBeenCalled();
  });

  it("fulfills a paid owned checkout after ownership approval", async () => {
    const payload = JSON.stringify({
      id: "evt_paid_owned_invisibleexit_fixture",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          ...foreignGitDealFlowSession,
          id: "cs_live_paid_owned_invisibleexit_fixture",
          payment_link: "plink_1TwIP7CwGoUDklRe5Y0faAyw",
          customer: "cus_owned_invisibleexit",
          customer_details: { email: "owned-buyer@example.com" },
          metadata: { product: "founding" },
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.queryOne).toHaveBeenCalledTimes(1);
    expect(mocks.query).toHaveBeenCalledTimes(4);
    expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
    expect(mocks.recordReferralConversion).toHaveBeenCalledTimes(1);
  });

  it("does not update subscriptions for an unowned Stripe customer", async () => {
    const payload = JSON.stringify({
      id: "evt_foreign_subscription_updated",
      object: "event",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_foreign_gitdealflow",
          object: "subscription",
          customer: "cus_foreign_gitdealflow",
          status: "active",
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it("does not update a locally known customer from a foreign subscription", async () => {
    mocks.queryOne.mockResolvedValue({ id: "known-invisibleexit-user" });
    const payload = JSON.stringify({
      id: "evt_foreign_subscription_known_customer",
      object: "event",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_foreign_known_customer",
          object: "subscription",
          customer: "cus_known_invisibleexit",
          status: "active",
          items: {
            data: [foreignGitDealFlowSession.line_items.data[0]],
            has_more: false,
          },
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it("preserves subscription updates for owned items and a locally bound customer", async () => {
    mocks.queryOne.mockResolvedValue({ id: "known-invisibleexit-user" });
    const payload = JSON.stringify({
      id: "evt_owned_subscription_known_customer",
      object: "event",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_owned_known_customer",
          object: "subscription",
          customer: "cus_known_invisibleexit",
          status: "active",
          items: {
            data: [
              {
                price: {
                  id: "price_1TwIP7CwGoUDklRe46yWBXPZ",
                  product: "prod_UwAkYNaooSKPFc",
                },
              },
            ],
            has_more: false,
          },
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.query).toHaveBeenCalledTimes(2);
  });

  it("does not mark an unowned Stripe customer past due", async () => {
    const payload = JSON.stringify({
      id: "evt_foreign_invoice_failed",
      object: "event",
      type: "invoice.payment_failed",
      data: {
        object: {
          id: "in_foreign_gitdealflow",
          object: "invoice",
          customer: "cus_foreign_gitdealflow",
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it("does not mark a locally known customer past due from a foreign invoice", async () => {
    mocks.queryOne.mockResolvedValue({ id: "known-invisibleexit-user" });
    const payload = JSON.stringify({
      id: "evt_foreign_invoice_known_customer",
      object: "event",
      type: "invoice.payment_failed",
      data: {
        object: {
          id: "in_foreign_known_customer",
          object: "invoice",
          customer: "cus_known_invisibleexit",
          lines: {
            data: [
              {
                pricing: {
                  price_details: {
                    price: "price_1TU4ZuCwGoUDklRev3fh8xib",
                    product: "prod_UT0aPLSENVCw5o",
                  },
                },
              },
            ],
            has_more: false,
          },
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it("preserves failed-invoice updates for owned lines and a locally bound customer", async () => {
    mocks.queryOne.mockResolvedValue({ id: "known-invisibleexit-user" });
    const payload = JSON.stringify({
      id: "evt_owned_invoice_known_customer",
      object: "event",
      type: "invoice.payment_failed",
      data: {
        object: {
          id: "in_owned_known_customer",
          object: "invoice",
          customer: "cus_known_invisibleexit",
          lines: {
            data: [
              {
                pricing: {
                  price_details: {
                    price: "price_1TwIP7CwGoUDklRe46yWBXPZ",
                    product: "prod_UwAkYNaooSKPFc",
                  },
                },
              },
            ],
            has_more: false,
          },
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.query).toHaveBeenCalledTimes(2);
  });

  it("does not cancel or email an unowned Stripe customer", async () => {
    const payload = JSON.stringify({
      id: "evt_foreign_subscription_deleted",
      object: "event",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_foreign_gitdealflow",
          object: "subscription",
          customer: "cus_foreign_gitdealflow",
          status: "canceled",
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.query).not.toHaveBeenCalled();
    expect(mocks.triggerWinback).not.toHaveBeenCalled();
  });

  it("does not cancel a locally known customer from a foreign subscription", async () => {
    mocks.queryOne.mockResolvedValue({ id: "known-invisibleexit-user" });
    const payload = JSON.stringify({
      id: "evt_foreign_subscription_deleted_known_customer",
      object: "event",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_foreign_deleted_known_customer",
          object: "subscription",
          customer: "cus_known_invisibleexit",
          status: "canceled",
          items: {
            data: [foreignGitDealFlowSession.line_items.data[0]],
            has_more: false,
          },
        },
      },
    });

    const res = response();
    await handler(request(payload) as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(mocks.query).not.toHaveBeenCalled();
    expect(mocks.triggerWinback).not.toHaveBeenCalled();
  });
});
