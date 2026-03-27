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
