import posthog from 'posthog-js';

const POSTHOG_KEY = 'phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX';
const POSTHOG_HOST = 'https://eu.i.posthog.com';

posthog.init(POSTHOG_KEY, {
  api_host: POSTHOG_HOST,
  person_profiles: 'identified_only',
  capture_pageview: false,
  capture_pageleave: true,
  autocapture: true,
});

export default posthog;
