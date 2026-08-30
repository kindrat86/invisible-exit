import { beforeEach, describe, expect, it, vi } from "vitest";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";
import { completeCheckoutLogin, startCheckout } from "@/lib/checkout";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: vi.fn() } },
}));

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

const invoke = vi.mocked(supabase.functions.invoke);
const capture = vi.mocked(trackEvent);
const showError = vi.mocked(toast.error);

describe("checkout flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("starts checkout with the welcome return path and redirects", async () => {
    invoke.mockResolvedValue({ data: { url: "https://checkout.stripe.com/c/pay/test" }, error: null });
    const redirect = vi.fn();

    await startCheckout("starter", { redirect });

    expect(invoke).toHaveBeenCalledWith("create-checkout", {
      body: {
        tier: "starter",
        returnUrl: `${window.location.origin}/welcome`,
        cancelUrl: window.location.href,
      },
    });
    expect(capture).toHaveBeenCalledWith("checkout_start", { tier: "starter" });
    expect(redirect).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/test");
  });

  it("passes an approved promo code through to checkout", async () => {
    invoke.mockResolvedValue({ data: { url: "https://checkout.stripe.com/c/pay/promo" }, error: null });

    await startCheckout("starter", { coupon: "COMEBACK50", redirect: vi.fn() });

    expect(invoke).toHaveBeenCalledWith("create-checkout", {
      body: {
        tier: "starter",
        returnUrl: `${window.location.origin}/welcome`,
        cancelUrl: window.location.href,
        coupon: "COMEBACK50",
      },
    });
  });

  it("tracks and reports checkout errors", async () => {
    invoke.mockResolvedValue({ data: null, error: { message: "checkout unavailable" } });

    await expect(startCheckout("starter", { redirect: vi.fn() })).rejects.toThrow("checkout unavailable");

    expect(capture).toHaveBeenCalledWith("checkout_error", {
      tier: "starter",
      message: "checkout unavailable",
    });
    expect(showError).toHaveBeenCalledWith("Checkout is temporarily unavailable. Please try again.");
  });

  it("stores the paid checkout JWT for the existing auth guard", async () => {
    invoke.mockResolvedValue({
      data: { token: "paid-jwt", user: { id: "usr_1", email: "buyer@example.com" } },
      error: null,
    });

    const user = await completeCheckoutLogin("cs_live_paid");

    expect(invoke).toHaveBeenCalledWith("checkout-login", { body: { session_id: "cs_live_paid" } });
    expect(localStorage.getItem("ie_session_token")).toBe("paid-jwt");
    expect(user).toEqual({ id: "usr_1", email: "buyer@example.com" });
  });
});
