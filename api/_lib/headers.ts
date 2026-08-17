/**
 * Shared header access helper for /api/ routes.
 *
 * Node/Vercel may deliver a request header as `string | string[]` (duplicate
 * headers) or `undefined` (absent). String operations (`startsWith`, `replace`,
 * …) only work on `string`, so coerce here once instead of at every call site.
 */
import type { VercelRequest } from "./types";

export function getHeader(req: VercelRequest, name: string): string {
  const value = req.headers[name];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
