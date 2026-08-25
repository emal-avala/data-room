// Which generated JS chunks may be served WITHOUT a session.
//
// Client bundles can carry gated figures, so middleware runs auth for
// /_next/static/chunks/*.js. Gating EVERY chunk also gated the login page's
// own chunks — a logged-out visitor got HTML redirects for each .js request
// and /login never hydrated.
//
// webpack concentrates src/data into `gated-data-*` and non-shell first-party
// modules into `app-gated-*`. scripts/check-public-chunks.ts fails the build
// if a public chunk contains a sentinel from the sample data layer.

const CHUNK_PREFIX = "/_next/static/chunks/";

const PUBLIC_APP_PREFIXES = [
  "app/login/",
  "app/pending-approval/",
  "app/auth/",
  "app/_not-found/",
  "app/_not-found-",
  "app/layout-",
];

export function isPublicChunk(pathname: string): boolean {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return false;
  }
  if (!decoded.startsWith(CHUNK_PREFIX)) return false;
  const name = decoded.slice(CHUNK_PREFIX.length);
  if (name.includes("..") || name.includes("%") || name.includes("\\")) return false;

  if (name.startsWith("gated-data") || name.startsWith("app-gated")) return false;

  if (name.startsWith("app/")) {
    return PUBLIC_APP_PREFIXES.some((p) => name.startsWith(p));
  }

  return true;
}
