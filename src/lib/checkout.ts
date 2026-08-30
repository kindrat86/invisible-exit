import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

export type CheckoutTier = "tripwire" | "starter" | "founding" | "standard" | "workshop";

interface CheckoutOptions {
  returnUrl?: string;
  cancelUrl?: string;
  coupon?: string;
  redirect?: (url: string) => void;
}

interface CheckoutUser {
  id: string;
  email: string;
  [key: string]: unknown;
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: unknown }).message ?? "").trim();
    if (message) return message;
  }
  return fallback;
}

export async function startCheckout(tier: CheckoutTier, options: CheckoutOptions = {}): Promise<void> {
  trackEvent("checkout_start", { tier });

  try {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        tier,
        returnUrl: options.returnUrl ?? `${window.location.origin}/welcome`,
        cancelUrl: options.cancelUrl ?? window.location.href,
        ...(options.coupon ? { coupon: options.coupon } : {}),
      },
    });

    if (error) throw new Error(errorMessage(error, "Checkout unavailable"));
    if (!data?.url || typeof data.url !== "string") throw new Error("Checkout URL missing");

    const redirect = options.redirect ?? ((url: string) => window.location.assign(url));
    redirect(data.url);
  } catch (error) {
    const message = errorMessage(error, "Checkout unavailable");
    trackEvent("checkout_error", { tier, message });
    toast.error("Checkout is temporarily unavailable. Please try again.");
    throw error instanceof Error ? error : new Error(message);
  }
}

export async function completeCheckoutLogin(sessionId: string): Promise<CheckoutUser> {
  const { data, error } = await supabase.functions.invoke("checkout-login", {
    body: { session_id: sessionId },
  });

  if (error) throw new Error(errorMessage(error, "Could not verify checkout"));
  if (!data?.token || typeof data.token !== "string") throw new Error("Checkout login token missing");
  if (!data?.user || typeof data.user !== "object") throw new Error("Checkout user missing");

  localStorage.setItem("ie_session_token", data.token);
  return data.user as CheckoutUser;
}
