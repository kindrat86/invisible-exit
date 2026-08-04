/**
 * Bot flag for analytics events.
 *
 * Every event we capture — client and server — carries a boolean `is_bot`
 * property so traffic queries can say `WHERE is_bot = false` and mean it.
 * This matches the convention already used by sanctionsai.dev, whose
 * dashboards filter on the same property name and value type.
 *
 * Two detectors, because the two sides see different things:
 *   - `isBotUserAgent(ua)` — string match, usable anywhere. On the server the
 *     User-Agent header is authoritative; in the browser it is `navigator.userAgent`.
 *   - `detectClientBot()` — adds the runtime signals only a browser exposes
 *     (WebDriver automation, headless builds, no declared languages), which
 *     catch crawlers that send an honest-looking Chrome UA string.
 *
 * This is a *flag*, not a block: flagged traffic is still captured and still
 * served. Deliberately biased toward false negatives — mislabelling a real
 * visitor as a bot would hide a lead, which costs more than an over-counted
 * pageview.
 */

/**
 * Substrings that only ever appear in non-human user agents. Curated rather
 * than generic on purpose: tokens like "search", "fetch", or "preview" would
 * also match legitimate browsers, and a false positive here silently deletes
 * a real visitor from every traffic report.
 */
const BOT_UA_PATTERNS = [
  // Generic self-identifying crawlers
  'bot/', 'bot;', 'bot)', '-bot', '_bot', 'bot ', 'crawler', 'spider', 'scraper',
  'slurp', 'archiver', 'indexer',
  // Headless / automation runtimes. Note: "electron" is deliberately absent —
  // plenty of real people browse from Electron-shelled apps, and driven
  // Electron sets navigator.webdriver anyway (see detectClientBot).
  'headless', 'phantomjs', 'selenium', 'puppeteer', 'playwright',
  'cypress', 'webdriver',
  // Non-browser HTTP clients
  'curl/', 'wget/', 'python-requests', 'python-httpx', 'aiohttp', 'axios/',
  'go-http-client', 'java/', 'okhttp', 'libwww-perl', 'guzzlehttp', 'postmanruntime',
  'node-fetch', 'undici',
  // Search / SEO / uptime infrastructure
  'googlebot', 'bingbot', 'yandex', 'duckduckbot', 'baiduspider', 'sogou',
  'ahrefs', 'semrush', 'mj12', 'dotbot', 'dataforseo', 'screaming frog',
  'petalbot', 'bytespider', 'applebot', 'amazonbot', 'uptimerobot', 'pingdom',
  'lighthouse', 'pagespeed', 'gtmetrix', 'chrome-lighthouse',
  // AI crawlers and answer engines
  'gptbot', 'oai-searchbot', 'chatgpt-user', 'claudebot', 'claude-web',
  'anthropic-ai', 'perplexitybot', 'youbot', 'ccbot', 'google-extended',
  'meta-externalagent', 'cohere-ai', 'diffbot', 'timpibot', 'omgili',
  // Link unfurlers — a real person triggered these, but no page was read
  'facebookexternalhit', 'whatsapp', 'telegrambot', 'slackbot', 'discordbot',
  'twitterbot', 'linkedinbot', 'redditbot', 'embedly', 'quora link preview',
  'skypeuripreview', 'vkshare', 'w3c_validator',
];

/**
 * True when the user-agent string self-identifies as non-human.
 * Empty or absent UA counts as a bot: every real browser sends one.
 */
export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  return BOT_UA_PATTERNS.some((pattern) => ua.includes(pattern));
}

/**
 * Browser-side detection. Runs the UA check plus the runtime signals that a
 * spoofed UA string cannot hide:
 *   - `navigator.webdriver` is set by every WebDriver-controlled browser
 *     (Selenium, Playwright, Puppeteer with default settings).
 *   - `navigator.languages` is always populated in a real browser; headless
 *     builds routinely report an empty list.
 *
 * Safe to call before PostHog is initialised, and on any platform — anything
 * unexpected resolves to `false` (treat as human) rather than throwing.
 */
export function detectClientBot(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  try {
    if (isBotUserAgent(navigator.userAgent)) return true;
    if (navigator.webdriver === true) return true;
    if (Array.isArray(navigator.languages) && navigator.languages.length === 0) return true;
    return false;
  } catch {
    // A detector that throws must never take analytics — or the page — down.
    return false;
  }
}
