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
  | "podcast_pitch_copied"
  | "homepage_formula_bait_clicked"
  | "story_masterclass_bridge_clicked"
  | "story_final_cta_masterclass"
  | "manifesto_hero_cta"
  | "manifesto_final_cta"
  | "manifesto_system_cta"
  | "social_share"
  | "email_signup"
  | "hook_copied"
  | "hook_status_update"
  | "dream100_stage_update"
  | "dream100_touch_increment"
  | "ad_status_update"
  | "content_upgrade_submitted"
  | "blog_share_prompt_clicked"
  | "click_to_tweet_clicked"
  | "blog_hub_share_clicked"
  | "blog_hub_email_submitted"
  | "blog_category_share_clicked"
  | "blog_category_email_submitted"
  | "footer_email_signup"
  | "exit_intent_triggered"
  | "exit_intent_submitted"
  | "exit_intent_closed"
  | "inline_squeeze_submitted"
  | "inline_squeeze_step_clicked"
  | "inline_squeeze_primary_cta"
  | "ask_campaign_submitted"
  | "belief_crusher_answered"
  | "belief_crusher_completed"
  | "belief_crusher_cta_clicked"
  | "belief_crusher_reset"
  | "belief_crusher_started"
  | "book_funnel_page_viewed"
  | "book_ordered"
  | "butterfly_share_unlocked"
  | "cold_traffic_bridge_cta_click"
  | "cold_traffic_bridge_unlocked"
  | "compare_page_cta"
  | "downsell_page_viewed"
  | "downsell_purchased"
  | "founding_wall_cta_clicked"
  | "founding_wall_final_cta_clicked"
  | "frameworks_page_cta_clicked"
  | "freedom_number_calculated"
  | "homepage_framework_card_clicked"
  | "homepage_frameworks_link_clicked"
  | "homepage_free_book_clicked"
  | "homepage_manifesto_clicked"
  | "homepage_stack_cta_clicked"
  | "homepage_stack_cta_final_clicked"
  | "homepage_tribe_cta_clicked"
  | "homepage_tribe_wall_link_clicked"
  | "is_this_you_answered"
  | "is_this_you_completed"
  | "is_this_you_qualified_cta"
  | "join_movement_cta_clicked"
  | "lexicon_cta_clicked"
  | "masterclass_stack_cta_clicked"
  | "movement_declaration_checked"
  | "movement_declaration_committed"
  | "one_thing_cta_clicked"
  | "pillar_guide_calculator_clicked"
  | "pillar_guide_final_cta"
  | "press_book_clicked"
  | "press_email_clicked"
  | "pricing_page_free_clicked"
  | "pricing_page_pro_clicked"
  | "pricing_page_starter_clicked"
  | "proof_page_cta_clicked"
  | "referral_link_copied"
  | "squeeze_email_capture_failed"
  | "start_page_checkout_clicked"
  | "start_page_viewed"
  | "tripwire_page_viewed"
  | "tripwire_purchased"
  | "value_ladder_cta_clicked"
  | "weekend_workshop_applied";

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
