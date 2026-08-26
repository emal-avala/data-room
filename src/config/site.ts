/**
 * Company and portal configuration.
 *
 * Defaults ship as Acme Corporation, the worked example. Override with env
 * vars when you fork the room for a real raise. See docs/guides/branding.md.
 */

function env(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

export const siteConfig = {
  companyName: env("NEXT_PUBLIC_COMPANY_NAME", "Acme Corporation"),
  legalName: env("NEXT_PUBLIC_COMPANY_LEGAL_NAME", "Acme Corporation"),
  /** Email domain treated as internal staff. Compared for equality, not suffix. */
  domain: env("NEXT_PUBLIC_COMPANY_DOMAIN", "acme.example").toLowerCase(),
  tagline: env(
    "NEXT_PUBLIC_COMPANY_TAGLINE",
    "Autonomous yard operations for the modern distribution center.",
  ),
  roundLabel: env("NEXT_PUBLIC_ROUND_LABEL", "Series A"),
  siteUrl: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000").replace(/\/$/, ""),
  /**
   * Public GitHub repo shown in the header/footer.
   * Set `NEXT_PUBLIC_REPO_URL=` (empty) to hide the mark on a live raise.
   */
  repoUrl: (process.env.NEXT_PUBLIC_REPO_URL === ""
    ? ""
    : env("NEXT_PUBLIC_REPO_URL", "https://github.com/emal-avala/data-room")
  ).replace(/\/$/, ""),
  /** Accent used for primary CTAs and the active nav indicator. */
  accent: env("NEXT_PUBLIC_ACCENT", "#1D4ED8"),
  fromEmail: env("IR_FROM_EMAIL", "Acme IR <noreply@acme.example>"),
  adminInbox: env("IR_ADMIN_INBOX", "jordan@acme.example"),
} as const;

export type SiteConfig = typeof siteConfig;
