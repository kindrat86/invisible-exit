import posthog from 'posthog-js';
import { detectClientBot } from './bot-detection';

const POSTHOG_KEY = 'phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX';
const POSTHOG_HOST = 'https://eu.i.posthog.com';

posthog.init(POSTHOG_KEY, {
  api_host: POSTHOG_HOST,
  person_profiles: 'identified_only',
  capture_pageview: false,
  capture_pageleave: true,
  autocapture: true,
});

// Super property: rides on every event, so traffic queries can filter
// `is_bot = false`. Safe to register straight after init — this site fires
// pageviews manually (capture_pageview: false), so nothing is captured
// before this line runs.
posthog.register({ is_bot: detectClientBot() });

export default posthog;
