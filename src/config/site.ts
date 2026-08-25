/**
 * Company and portal configuration.
 *
 * Replace these values (or set the matching env vars) before you share the
 * room. Nothing in this file is Avala-specific — it is the one place a
 * adopting team should edit first. See docs/guides/branding.md.
 */

function env(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

export const siteConfig = {
  companyName: env("NEXT_PUBLIC_COMPANY_NAME", "Example Co."),
  legalName: env("NEXT_PUBLIC_COMPANY_LEGAL_NAME", "Example Co., Inc."),
  /** Email domain treated as internal staff. Compared for equality, not suffix. */
  domain: env("NEXT_PUBLIC_COMPANY_DOMAIN", "example.com").toLowerCase(),
  tagline: env(
    "NEXT_PUBLIC_COMPANY_TAGLINE",
    "The institutional data room for your round.",
  ),
  roundLabel: env("NEXT_PUBLIC_ROUND_LABEL", "Series A"),
  siteUrl: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000").replace(/\/$/, ""),
  /** Accent used for primary CTAs and the active nav indicator. */
  accent: env("NEXT_PUBLIC_ACCENT", "#1D4ED8"),
  fromEmail: env("IR_FROM_EMAIL", "IR <noreply@example.com>"),
  adminInbox: env("IR_ADMIN_INBOX", "founder@example.com"),
} as const;

export type SiteConfig = typeof siteConfig;
