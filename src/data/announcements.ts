/**
 * Signed-in announcement banner.
 *
 * This file ships in a PUBLIC pre-auth JS chunk (next.config.ts SHELL_PREFIXES).
 * Banner copy must carry no gated facts: no customer names, no figures, no
 * identities. The component renders the first active entry.
 */

export type Announcement = {
  id: string;
  message: string;
  href?: string;
  active: boolean;
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "welcome",
    message: "Sample data room. Edit this banner in src/data/announcements.ts.",
    href: "/docs",
    active: true,
  },
];
