/**
 * Who a data-room document may be served to.
 *
 * `investor` is every document the room lists by default: any authenticated
 * viewer who clears the document's own NDA and distribution rules.
 *
 * `internal` restricts a document to staff by email domain. It exists for
 * work-in-progress artifacts that must be openable by the team without being
 * reachable by an investor who happens to hold the link.
 *
 * THIS MODULE IS A SERVER BOUNDARY, NOT A UI HINT. A client-side capability
 * check is UX and can be spoofed. Every call that decides whether bytes leave
 * the server must run here, on the server, against the session's own email.
 */

import { siteConfig } from "@/config/site";

export type DocumentAudience = "investor" | "internal";

/**
 * The one domain that counts as internal.
 *
 * Taken from NEXT_PUBLIC_COMPANY_DOMAIN / siteConfig.domain. Compared for
 * equality against the parsed hostname — suffix matching would admit
 * lookalikes like `example.com.evil.com`.
 */
export function getInternalEmailDomain(): string {
  return siteConfig.domain;
}

const HOSTNAME = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/**
 * True only for a syntactically valid address in the internal domain.
 *
 * FAIL CLOSED. Unauthenticated / unknown viewers arrive as null and get false.
 * Requires exactly one `@` and a hostname-shaped domain.
 */
export function isInternalViewer(email: string | null | undefined): boolean {
  if (!email) return false;
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !HOSTNAME.test(domain)) return false;
  return domain === getInternalEmailDomain();
}

export function canViewAudience(
  audience: DocumentAudience | undefined,
  viewerEmail: string | null | undefined,
): boolean {
  if (audience !== "internal") return true;
  return isInternalViewer(viewerEmail);
}
