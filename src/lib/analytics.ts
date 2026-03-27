import posthog from "@/integrations/posthog";

type AnalyticsEvent =
  | "oto_page_viewed"
  | "oto_video_clicked"
  | "oto_cta_clicked"
  | "oto_declined";

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>
) {
  if (import.meta.env.DEV) {
    console.log(`[analytics] ${event}`, properties ?? "");
  }

  posthog.capture(event, properties);

  window.dispatchEvent(
    new CustomEvent("ie:analytics", {
      detail: { event, properties, timestamp: Date.now() },
    })
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    rdt?: (...args: unknown[]) => void;
  }
}

export function trackGoogleConversion(value?: number, currency = "USD") {
  window.gtag?.("event", "conversion", {
    send_to: "AW-18046014876/p7N-CLi97JAcEJyrgZ1D",
    value,
    currency,
  });
}

export function trackRedditConversion(value?: number, currency = "USD") {
  window.rdt?.("track", "Purchase", {
    value,
    currency,
  });
}
