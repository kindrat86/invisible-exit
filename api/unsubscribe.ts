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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const email = String(req.query.email || "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendPage(res, "Invalid email address");
  }

  try {
    await query(`DELETE FROM subscribers WHERE email = $1`, [email]);
    await query(`DELETE FROM email_sequence_schedule WHERE email = $1`, [email]);
  } catch (err) {
    console.error("Unsubscribe query failed:", err);
  }

  return sendPage(res, email);
}

function sendPage(res: VercelResponse, email: string) {
  const esc = String(email || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unsubscribed — Invisible Exit</title>
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
</style>
</head>
<body>
<div class="card">
  <div class="check">&#10003;</div>
  <h1>You have been unsubscribed</h1>
  <p><span class="email">${esc}</span> has been removed from Invisible Exit emails.</p>
  <p class="footer"><a href="https://invisibleexit.com">invisibleexit.com</a></p>
</div>
</body>
</html>`);
}
