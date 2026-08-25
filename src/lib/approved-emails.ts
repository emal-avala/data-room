import { siteConfig } from "@/config/site";
import { isInternalViewer } from "@/lib/document-audience";

/**
 * Access control for the portal.
 *
 * - Internal-domain emails: always approved (staff)
 * - Other emails: must be approved via access_requests or APPROVED_INVESTOR_EMAILS
 */

export function isInternalEmail(email: string): boolean {
  return isInternalViewer(email);
}

export function getEnvApprovedEmails(): string[] {
  const envEmails = process.env.APPROVED_INVESTOR_EMAILS;
  if (!envEmails) return [];
  return envEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Synchronous check: internal domain or env whitelist.
 * Database approval is checked separately in middleware.
 */
export function isEmailApproved(email: string): boolean {
  const normalizedEmail = email.toLowerCase();
  if (isInternalEmail(normalizedEmail)) return true;
  return getEnvApprovedEmails().includes(normalizedEmail);
}

export function internalDomain(): string {
  return siteConfig.domain;
}
