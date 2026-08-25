// Deep links that survive the login / waitlist gate.
//
// An investor is forwarded a specific URL — say `/docs/pitch-deck?slide=4`.
// The gate captures it as `?next=…` so sign-in and the waitlist do not dump
// the visitor on the homepage. Every hop passes the value through
// `sanitizeNextPath`, so an attacker cannot turn a login link into an open
// redirect to their own host.

export const NEXT_PARAM = "next";

const NON_DESTINATION_PREFIXES = [
  "/login",
  "/pending-approval",
  "/auth/",
  "/api/",
  "/_next/",
];

const MAX_NEXT_LENGTH = 2048;

function isSameOriginPath(candidate: string): boolean {
  if (!candidate.startsWith("/")) return false;
  if (candidate.startsWith("//") || candidate.startsWith("/\\")) return false;
  if (/^\/[a-z0-9+.-]*:/i.test(candidate)) return false;
  return true;
}

/**
 * Validate an untrusted `next` value and return it normalized, or null.
 *
 * Accepts only same-origin, absolute-path references. Rejects absolute URLs,
 * `//evil.com`, `/\evil.com`, `/javascript:…`, and gate/API destinations.
 */
export function sanitizeNextPath(raw: string | null | undefined): string | null {
  if (typeof raw !== "string") return null;

  const value = raw.trim();
  if (!value || value.length > MAX_NEXT_LENGTH) return null;
  if (/[\x00-\x1f\x7f]/.test(value)) return null;
  if (!isSameOriginPath(value)) return null;

  let url: URL;
  try {
    url = new URL(value, "http://localhost");
  } catch {
    return null;
  }
  if (url.hostname !== "localhost" || url.protocol !== "http:") return null;
  if (!isSameOriginPath(url.pathname)) return null;
  if (url.pathname === "/") return null;

  const path = `${url.pathname}${url.search}${url.hash}`;
  const lowerPath = url.pathname.toLowerCase();
  const isNonDestination = NON_DESTINATION_PREFIXES.some((prefix) => {
    const base = prefix.replace(/\/+$/, "");
    return lowerPath === base || lowerPath.startsWith(`${base}/`);
  });
  if (isNonDestination) return null;

  return path;
}

export function capturedNextPath(request: {
  method: string;
  headers: Headers;
  nextUrl: { pathname: string; search: string };
}): string | null {
  if (request.method !== "GET") return null;

  const accept = request.headers.get("accept") ?? "";
  const fetchMode = request.headers.get("sec-fetch-mode") ?? "";
  const isDocument = accept.includes("text/html") || fetchMode === "navigate";
  if (!isDocument) return null;

  return sanitizeNextPath(`${request.nextUrl.pathname}${request.nextUrl.search}`);
}

export function withInheritedHash(
  next: string | null,
  hash: string | null | undefined,
): string | null {
  if (!next) return null;
  if (!hash || hash === "#" || next.includes("#")) return next;
  const fragment = hash.startsWith("#") ? hash : `#${hash}`;
  return sanitizeNextPath(`${next}${fragment}`) ?? next;
}

export function withNextPath(url: URL, next: string | null): URL {
  if (next) {
    url.searchParams.set(NEXT_PARAM, next);
  } else {
    url.searchParams.delete(NEXT_PARAM);
  }
  return url;
}

export function appendNextPath(path: string, next: string | null): string {
  if (!next) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${NEXT_PARAM}=${encodeURIComponent(next)}`;
}
