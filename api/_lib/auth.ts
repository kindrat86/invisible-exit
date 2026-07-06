/**
 * Shared JWT auth helpers for /api/ routes.
 * Not a route itself — imported by auth + db handlers.
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import jwt from "jsonwebtoken";

/**
 * JWT secret — fails hard if not set in production (no insecure fallback).
 * Generate one with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
 */
const JWT_SECRET_RAW = process.env.JWT_SECRET;
if (!JWT_SECRET_RAW && process.env.NODE_ENV === "production") {
  console.error("FATAL: JWT_SECRET environment variable is not set. Authentication will fail.");
}
export const JWT_SECRET = JWT_SECRET_RAW || (process.env.NODE_ENV === "production" ? "" : "dev-secret-change-me");

export interface JwtPayload {
  sub: string;
  email: string;
}

/**
 * Sign an access token (24h).
 */
export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

/**
 * Sign a refresh token (7d, no email).
 */
export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign({ sub: payload.sub }, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Extract + verify Bearer token from Authorization header.
 * Returns the decoded payload or null.
 */
export function verifyBearer(req: VercelRequest): JwtPayload | null {
  const header = req.headers["authorization"] || req.headers["Authorization"];
  if (!header || typeof header !== "string") return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  try {
    const decoded = jwt.verify(match[1], JWT_SECRET) as jwt.JwtPayload;
    if (!decoded.sub) return null;
    return { sub: decoded.sub, email: decoded.email ?? "" };
  } catch {
    return null;
  }
}

/**
 * Reject non-POST requests with 405.
 */
export function requirePost(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return false;
  }
  return true;
}

/**
 * Reject non-GET requests with 405.
 */
export function requireGet(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return false;
  }
  return true;
}

/**
 * Generate a random opaque token (URL-safe).
 */
export function generateToken(): string {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)
  );
}
