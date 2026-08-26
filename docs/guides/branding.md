# Branding

Work top to bottom. After env changes, restart `bun dev`.

## Company identity

Set in `.env.local` (Vercel: Project → Settings → Environment Variables):

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_COMPANY_NAME` | `Northwind Robotics` |
| `NEXT_PUBLIC_COMPANY_LEGAL_NAME` | `Northwind Robotics, Inc.` |
| `NEXT_PUBLIC_COMPANY_DOMAIN` | `northwind.example` |
| `NEXT_PUBLIC_COMPANY_TAGLINE` | `Autonomy for last-mile freight.` |
| `NEXT_PUBLIC_ROUND_LABEL` | `Seed` |
| `NEXT_PUBLIC_SITE_URL` | `https://ir.northwind.example` |
| `NEXT_PUBLIC_ACCENT` | `#1D4ED8` |
| `NEXT_PUBLIC_REPO_URL` | `https://github.com/you/data-room` (empty hides the mark) |
| `SUPERADMIN_EMAIL` | `you@northwind.example` |

Same defaults live in `src/config/site.ts` if env is unset.

## Color

`NEXT_PUBLIC_ACCENT` feeds `--primary` (buttons, active nav, link hover).

Everything else is in `src/app/globals.css`:

| Token | Role |
|-------|------|
| `--background` | Page |
| `--foreground` | Body and metric values |
| `--muted-foreground` | Eyebrows, captions |
| `--border` / `--card` | Cards |
| `--primary` | CTAs only |

Do not paint metric numbers in the accent. See [DESIGN.md](../../DESIGN.md).

## Type

`src/app/layout.tsx` loads **Source Sans 3** (400 / 600) from
`next/font/google` as `--font-sans`.

To change the family:

```ts
import { IBM_Plex_Sans } from "next/font/google";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
  display: "swap",
});
```

Keep the CSS variable name. `demo/styles.css` uses a Google Fonts
`<link>` — update that file if you want the Pages preview to match.

## Copy

| Surface | File |
|---------|------|
| Homepage hero + metric cards | `src/data/metrics.ts` + `src/app/page.tsx` |
| Company | `src/data/company.ts` + `src/app/company/page.tsx` |
| Contact | `src/app/contact/page.tsx` |
| Financials / roadmap | `src/data/financials.ts`, `src/data/roadmap.ts` |
| Banner | `src/data/announcements.ts` |
| Footer | `src/components/Footer.tsx` (uses `siteConfig`) |
| NDA | `src/lib/nda-agreement.ts` |
| Memos | `src/content/ir/articles.tsx` |

The repo ships **Acme Corporation** as a complete worked example. Replace `src/data/` before you invite a real fund. Do not type a dollar figure in two files.

## Icon

Replace `public/icon.svg`. Keep it simple; it is the favicon.

## Deck

Replace `content/documents/sample-pitch-deck.html`. Keep the ten-slide
spine and `ACCENT` contract in `docs/guides/deck.md`. The production
viewer loads it through `/api/docs/pitch-deck/deck` and stamps the
email. `demo/deck.html` must stay byte-identical — `deck-theme.test.ts`
enforces that.
