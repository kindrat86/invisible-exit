/**
 * Referral Engine, client-side capture.
 *
 * Any landing URL carrying ?ref=CODE (or ?via=CODE) stores the code for 90
 * days. The API shim (src/lib/neon/client.ts) automatically attaches it to
 * every create-checkout call, and the server validates it, an unknown or
 * malformed code is simply ignored.
 */

const KEY = "ie_referral_code";
const TS_KEY = "ie_referral_ts";
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

const CODE_RE = /^[a-z0-9-]{3,32}$/;

/** Call once on app boot, reads ?ref= / ?via= from the URL. */
export function captureReferralFromUrl(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get("ref") || params.get("via") || "").toLowerCase().trim();
    if (raw && CODE_RE.test(raw)) {
      localStorage.setItem(KEY, raw);
      localStorage.setItem(TS_KEY, String(Date.now()));
    }
  } catch {
    // Storage unavailable (private mode), referral attribution silently off.
  }
}

/** The stored referral code, or null when absent/expired. */
export function getReferralCode(): string | null {
  try {
    const code = localStorage.getItem(KEY);
    if (!code || !CODE_RE.test(code)) return null;
    const ts = Number(localStorage.getItem(TS_KEY) || 0);
    if (ts && Date.now() - ts > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      localStorage.removeItem(TS_KEY);
      return null;
    }
    return code;
  } catch {
    return null;
  }
}
