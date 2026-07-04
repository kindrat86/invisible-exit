import posthog from "@/integrations/posthog";

type AnalyticsEvent =
  | "oto_page_viewed"
  | "oto_video_clicked"
  | "oto_cta_clicked"
  | "oto_declined"
  | "homepage_cta_clicked"
  | "homepage_subscribe_submitted"
  | "homepage_hero_cta_clicked"
  | "homepage_mid_cta_clicked"
  | "homepage_final_cta_clicked"
  | "homepage_blog_clicked"
  | "blog_archive_viewed"
  | "blog_start_here_clicked"
  | "blog_featured_clicked"
  | "blog_article_cta_clicked"
  | "blog_related_clicked"
  | "blog_back_to_hub_clicked"
  | "blog_category_post_clicked"
  | "story_page_viewed"
  | "story_email_submitted"
  | "masterclass_registered"
  | "masterclass_registered_v2"
  | "intensive_applied"
  | "squeeze_page_submitted"
  | "inner_circle_cta_clicked"
  | "adrian_story_clicked"
  | "traffic_blueprint_viewed"
  | "content_calendar_copied"
  | "affiliate_asset_copied"
  | "podcast_pitch_copied";

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
