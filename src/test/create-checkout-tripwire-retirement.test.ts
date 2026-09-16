import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createSession: vi.fn(),
}));

vi.hoisted(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_invisibleexit_fixture";
  process.env.STRIPE_STARTER_PRICE_ID = "price_starter_fixture";
  process.env.STRIPE_TRIPWIRE_PRICE_ID = "price_tripwire_fixture";
  process.env.SITE_URL = "https://invisibleexit.com";
});

vi.mock("stripe", () => ({
  default: class StripeMock {
    checkout = { sessions: { create: mocks.createSession } };
  },
}));

vi.mock("../../api/_lib/referral", () => ({
  findReferrer: vi.fn(),
  ensureReferredFirstMonthCoupon: vi.fn(),
  ensureCoupon: vi.fn(),
  isValidCodeFormat: () => false,
  REFERRAL_COUPON_FIRST_MONTH: "fixture_referral_coupon",
}));

import handler from "../../api/create-checkout";

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

async function invoke(tier: string) {
  const res = response();
  await handler(
    {
      method: "POST",
      headers: {},
      body: {
        tier,
        returnUrl: "https://invisibleexit.com/welcome",
        cancelUrl: "https://invisibleexit.com/start",
      },
    } as never,
    res as never,
  );
  return res;
}

describe("retired tripwire checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createSession.mockResolvedValue({ url: "https://checkout.stripe.test/session" });
  });

  it.each(["tripwire", "tripwire_bump"])(
    "fails closed for the unsupported %s offer",
    async (tier) => {
      const res = await invoke(tier);

      expect(res.statusCode).toBe(410);
      expect(res.body).toEqual({
        error: "The Stealth Ops Blueprint is temporarily unavailable",
      });
      expect(mocks.createSession).not.toHaveBeenCalled();
    },
  );

  it("creates the $9 starter subscription without the unsupported Blueprint line item", async () => {
    const res = await invoke("starter");

    expect(res.statusCode).toBe(200);
    expect(mocks.createSession).toHaveBeenCalledTimes(1);
    expect(mocks.createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        line_items: [{ price: "price_starter_fixture", quantity: 1 }],
        metadata: { product: "starter" },
        success_url: "https://invisibleexit.com/welcome?session_id={CHECKOUT_SESSION_ID}",
      }),
    );
  });
});
