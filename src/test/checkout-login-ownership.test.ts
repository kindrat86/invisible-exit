import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
  queryOne: vi.fn(),
}));

vi.hoisted(() => {
  process.env.JWT_SECRET = "invisibleexit-test-jwt-secret";
});

vi.mock("../../api/_lib/db", () => ({
  execute: mocks.execute,
  queryOne: mocks.queryOne,
}));
vi.mock("../../api/_lib/rate-limit", () => ({
  checkRateLimit: () => ({ allowed: true }),
  getClientIP: () => "127.0.0.1",
}));
import { createCheckoutLoginHandler } from "../../api/checkout-login";

function response() {
  return {
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
  };
}

const foreignGitDealFlowSession = {
  id: "cs_live_b1YT1hupteOe5cvg90saJZYucg9Zu9v2MJsJ2RZArs4NTxnpp27pUle8GT",
  object: "checkout.session",
  mode: "payment",
  payment_status: "paid",
  status: "complete",
  amount_total: 100,
  currency: "eur",
  payment_link: "plink_1TU4ZvCwGoUDklReEjuprkH0",
  customer: "cus_foreign_gitdealflow",
  customer_details: { email: "foreign-gitdealflow@example.com" },
  metadata: {
    product: "starter",
    source: "landing-tripwire",
    tier: "teardown",
  },
  line_items: {
    data: [
      {
        price: {
          id: "price_1TU4ZuCwGoUDklRev3fh8xib",
          product: "prod_UT0aPLSENVCw5o",
        },
      },
    ],
    has_more: false,
  },
};

describe("checkout-login ownership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts Stripe live Session IDs for authoritative retrieval", async () => {
    const retrieveSession = vi.fn().mockResolvedValue({
      id: "cs_live_validfixture123",
      payment_status: "unpaid",
    });
    const handler = createCheckoutLoginHandler({ retrieveSession });
    const res = response();

    await handler(
      {
        method: "POST",
        headers: {},
        body: { session_id: "cs_live_validfixture123" },
      } as never,
      res as never,
    );

    expect(retrieveSession).toHaveBeenCalledWith("cs_live_validfixture123");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Payment not completed" });
    expect(mocks.execute).not.toHaveBeenCalled();
  });

  it("rejects Checkout Session IDs without a live or test prefix before Stripe retrieval", async () => {
    const retrieveSession = vi.fn().mockResolvedValue({
      ...foreignGitDealFlowSession,
      id: "cs_arbitrary",
      payment_link: "plink_1TwIP7CwGoUDklRe5Y0faAyw",
    });
    const handler = createCheckoutLoginHandler({ retrieveSession });
    const res = response();

    await handler(
      {
        method: "POST",
        headers: {},
        body: { session_id: "cs_arbitrary" },
      } as never,
      res as never,
    );

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Invalid session_id format" });
    expect(retrieveSession).not.toHaveBeenCalled();
    expect(mocks.execute).not.toHaveBeenCalled();
    expect(mocks.queryOne).not.toHaveBeenCalled();
  });

  it("rejects the foreign GitDealFlow checkout before account or token side effects", async () => {
    const handler = createCheckoutLoginHandler({
      retrieveSession: vi.fn().mockResolvedValue(foreignGitDealFlowSession),
    });
    const res = response();

    await handler(
      {
        method: "POST",
        headers: {},
        body: { session_id: foreignGitDealFlowSession.id },
      } as never,
      res as never,
    );

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "Checkout does not belong to InvisibleExit",
    });
    expect(mocks.execute).not.toHaveBeenCalled();
    expect(mocks.queryOne).not.toHaveBeenCalled();
  });

  it("rejects a dynamic checkout whose line items are foreign", async () => {
    const foreignDynamicSession = {
      ...foreignGitDealFlowSession,
      id: "cs_live_foreigndynamic123",
      payment_link: null,
    };
    const handler = createCheckoutLoginHandler({
      retrieveSession: vi.fn().mockResolvedValue(foreignDynamicSession),
    });
    const res = response();

    await handler(
      {
        method: "POST",
        headers: {},
        body: { session_id: foreignDynamicSession.id },
      } as never,
      res as never,
    );

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "Checkout does not belong to InvisibleExit",
    });
    expect(mocks.execute).not.toHaveBeenCalled();
    expect(mocks.queryOne).not.toHaveBeenCalled();
  });

  it.each([
    {
      label: "owned Payment Link",
      session: {
        ...foreignGitDealFlowSession,
        id: "cs_live_ownedpaymentlink123",
        payment_link: "plink_1TwIP7CwGoUDklRe5Y0faAyw",
        metadata: { product: "founding" },
      },
    },
    {
      label: "owned dynamic line items",
      session: {
        ...foreignGitDealFlowSession,
        id: "cs_live_owneddynamic123",
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
          has_more: false,
        },
      },
    },
    {
      label: "legacy FYM dynamic line item",
      session: {
        ...foreignGitDealFlowSession,
        id: "cs_live_legacyfym123",
        payment_link: null,
        metadata: { product: "founding" },
        line_items: {
          data: [
            {
              price: {
                id: "price_1TDSPLCwGoUDklReUFuepC1B",
                product: "prod_UBq5XD865QrF4e",
              },
            },
          ],
          has_more: false,
        },
      },
    },
  ])("preserves a paid $label checkout", async ({ session }) => {
    mocks.execute.mockResolvedValue(undefined);
    mocks.queryOne.mockResolvedValue({
      id: "user-owned-123",
      email: session.customer_details.email,
      stripe_customer_id: session.customer,
      subscription_status: "active",
      subscription_tier: session.metadata.product,
    });
    const handler = createCheckoutLoginHandler({
      retrieveSession: vi.fn().mockResolvedValue(session),
    });
    const res = response();

    await handler(
      {
        method: "POST",
        headers: {},
        body: { session_id: session.id },
      } as never,
      res as never,
    );

    expect(res.statusCode).toBe(200);
    expect(mocks.execute).toHaveBeenCalledTimes(1);
    expect(mocks.queryOne).toHaveBeenCalledTimes(1);
    expect(res.body).toMatchObject({
      token: expect.any(String),
      user: { id: "user-owned-123" },
    });
  });
});
