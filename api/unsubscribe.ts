/**
 * /api/unsubscribe.ts
 *
 * One-click unsubscribe: GET /api/unsubscribe?email=X
 * Removes the row from `subscribers` (source of truth for sends) and
 * `email_sequence_schedule` (stops any pending drip), matching the
 * portfolio's List-Unsubscribe pattern.
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { query } from "./_lib/db";
import { createHmac, timingSafeEqual } from "node:crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORT = "escape@invisibleexit.com";

/**
 * Changed 2026-07-25 (portfolio-wide audit). This was the most destructive of the
 * portfolio's five unsubscribe endpoints: a bare GET ran two DELETEs, so it
 * permanently removed rows for ANY address supplied, no token, no confirmation.
 * Two consequences, both verified reachable live:
 *   1. Anyone could destroy subscriber rows for any address they could guess.
 *      Unlike the Resend "unsubscribed: true" flag used elsewhere, a DELETE is
 *      irreversible and leaves no record that the person opted out.
 *   2. Mail-security link scanners, Outlook SafeLinks and link prefetchers fetch
 *      URLs in email bodies automatically, so they were deleting real
 *      subscribers who never clicked.
 * Links already in the wild carry no signature, so REQUIRING one would strand
 * real recipients with no way to opt out, worse than the bug. Hence: unsigned
 * GET renders a one-click confirmation POST; a signed GET (UNSUB_SECRET) and POST
 * act directly, so RFC 8058 one-click still works. HEAD answers but never
 * mutates, because scanners HEAD links and a 405 makes them report the
 * unsubscribe link broken.
 */
function sign(email: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(email.trim().toLowerCase())
    .digest("base64url")
    .slice(0, 32);
}

function validToken(email: string, token: string, secret?: string): boolean {
  if (!secret || !token) return false;
  const a = Buffer.from(sign(email, secret));
  const b = Buffer.from(String(token));
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const isHead = req.method === "HEAD";
  if (req.method !== "GET" && req.method !== "POST" && !isHead) {
    res.setHeader("Allow", "GET, HEAD, POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  const q = (req.query || {}) as Record<string, unknown>;
  const b = (req.body || {}) as Record<string, unknown>;
  const email = String(q.email ?? b.email ?? "").trim().toLowerCase();
  const token = String(q.t ?? b.t ?? "").trim();

  if (!email || !EMAIL_RE.test(email)) {
    return sendPage(res, "error", "That does not look like a valid email address.");
  }

  if (isHead || (req.method === "GET" && !validToken(email, token, process.env.UNSUB_SECRET))) {
    return confirmPage(res, email);
  }

  let ok = false;
  try {
    await query(`DELETE FROM subscribers WHERE email = $1`, [email]);
    await query(`DELETE FROM email_sequence_schedule WHERE email = $1`, [email]);
    ok = true;
  } catch (err) {
    // Previously swallowed, then the success page was shown anyway, producing
    // people who believed they had opted out and were still on the list.
    console.error("Unsubscribe query failed:", err);
  }

  return ok
    ? sendPage(res, "ok", email)
    : sendPage(res, "error",
        `We could not complete that just now. Email ${SUPPORT} and we will remove you by hand.`);
}

const esc = (s: unknown): string =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );

function shell(title: string, icon: string, heading: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}, Invisible Exit</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0a0a0a;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 24px; color: #f8fafc;
  }
  .card {
    background: #111;
    border: 1px solid #1a1a1a;
    border-radius: 16px;
    padding: 48px 40px;
    max-width: 480px;
    width: 100%;
    text-align: center;
  }
  .check {
    width: 64px; height: 64px;
    background: rgba(96,165,250,.12);
    border-radius: 50%;
    display: inline-flex;
    align-items: center; justify-content: center;
    font-size: 28px;
    color: #60A5FA;
    margin-bottom: 20px;
  }
  h1 { font-size: 22px; color: #f8fafc; margin-bottom: 8px; }
  p { font-size: 15px; color: #999; line-height: 1.6; }
  .email { font-weight: 600; color: #f8fafc; }
  .footer { margin-top: 24px; font-size: 12px; color: #555; }
  a { color: #60A5FA; text-decoration: none; }
  p + p { margin-top: 12px; }
  button { margin-top:24px;width:100%;padding:14px 20px;font:inherit;font-weight:600;color:#04121f;background:#60A5FA;border:0;border-radius:10px;cursor:pointer }
  button:hover { filter: brightness(.95) }
</style>
</head>
<body>
<div class="card">
  <div class="check">${icon}</div>
  <h1>${heading}</h1>
  ${body}
  <p class="footer"><a href="https://invisibleexit.com">invisibleexit.com</a></p>
</div>
</body>
</html>`;
}

function send(res: VercelResponse, html: string) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}

/** Explicit confirmation for unsigned GETs, still one click, but a human's. */
function confirmPage(res: VercelResponse, email: string) {
  return send(res, shell("Confirm unsubscribe", "&#9993;", "Confirm you want to unsubscribe",
    `<p>Click below and <span class="email">${esc(email)}</span> will stop receiving Invisible Exit emails.</p>
  <form method="POST" action="/api/unsubscribe">
    <input type="hidden" name="email" value="${esc(email)}">
    <button type="submit">Unsubscribe me</button>
  </form>`));
}

function sendPage(res: VercelResponse, kind: "ok" | "error", detail: string) {
  if (kind === "ok") {
    return send(res, shell("Unsubscribed", "&#10003;", "You have been unsubscribed",
      `<p><span class="email">${esc(detail)}</span> has been removed from Invisible Exit emails.</p>`));
  }
  return send(res, shell("Unsubscribe", "&#9888;", "We hit a problem", `<p>${esc(detail)}</p>`));
}
