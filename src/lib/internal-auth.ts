import { NextResponse } from "next/server";

/**
 * Validates that an incoming request to an internal API route carries the
 * CRON_SECRET bearer token. Used by Vercel Cron and server-to-server alerts.
 *
 * If CRON_SECRET is not configured, requests are allowed through so local
 * development works. In production CRON_SECRET MUST be set.
 */
export function requireInternalSecret(request: Request): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return null;
  }
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function internalAuthHeaders(): Record<string, string> {
  const cronSecret = process.env.CRON_SECRET;
  return cronSecret ? { Authorization: `Bearer ${cronSecret}` } : {};
}

export const INTERNAL_API_PATHS: readonly string[] = [
  "/api/analytics/check-hot-leads",
  "/api/analytics/digest",
];

export function isInternalApiPath(pathname: string): boolean {
  return INTERNAL_API_PATHS.some((p) => pathname === p || pathname === p + "/");
}
