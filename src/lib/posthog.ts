import posthog from "posthog-js";

const POSTHOG_KEY = "phc_xH1Kecm9NIkyt0vve3FCa3KYIDcIoXMRkaSQOaD1x83";
const POSTHOG_HOST = "https://us.i.posthog.com";

export function initPostHog() {
  if (typeof window === "undefined") return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  });
}

export { posthog };
