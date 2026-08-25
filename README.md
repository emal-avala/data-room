<p align="center">
  <img src="public/icon.svg" alt="Data Room" width="72">
</p>

<h1 align="center">Data Room</h1>

<p align="center">
  Investor relations for a seed or Series A raise.<br>
  Next.js · Supabase · Vercel · MIT
</p>

<p align="center">
  <a href="https://emal-avala.github.io/data-room/">Live demo</a> ·
  <a href="docs/ONBOARDING.md">Onboarding</a> ·
  <a href="#deploy">Deploy</a> ·
  <a href="docs/deploy/vercel-supabase.md">Vercel + Supabase</a>
</p>

<p align="center">
  <a href="https://github.com/emal-avala/data-room/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/emal-avala/data-room/actions/workflows/ci.yml/badge.svg"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

---

A partner opens this between board meetings. They scan the numbers, open
the room, download what they need. You see the session in `/admin`.

Fork it. Put your name, domain, and documents in. Deploy. Sample pages
are templates — fill them from your books.

**New here?** [docs/ONBOARDING.md](docs/ONBOARDING.md) is the full
checklist (brand, fonts, Supabase, Google login, Vercel).

```bash
git clone https://github.com/emal-avala/data-room.git
cd data-room
./scripts/onboard.sh
bun install && bun dev    # http://localhost:3000
```

**Demo (no login):** [emal-avala.github.io/data-room](https://emal-avala.github.io/data-room/)
— static HTML from `demo/`, published from the `gh-pages` branch.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Femal-avala%2Fdata-room&env=NEXT_PUBLIC_COMPANY_NAME,NEXT_PUBLIC_COMPANY_DOMAIN,SUPERADMIN_EMAIL,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,CRON_SECRET&envDescription=Company%20name%2C%20domain%2C%20your%20login%2C%20and%20Supabase%20keys.%20See%20.env.example&project-name=data-room&repository-name=data-room)

| Step | What to do |
|------|------------|
| 1 | Supabase project. SQL Editor: `supabase/migrations/001_schema.sql`, then `supabase/seed.sql`. |
| 2 | Auth → Google and/or Azure. Redirect `https://<project>.supabase.co/auth/v1/callback`. Site URL = your Vercel URL. App redirect = `https://<app>.vercel.app/auth/callback`. |
| 3 | Vercel env from `.env.example`. `SUPERADMIN_EMAIL` is the address you sign in with. |
| 4 | Deploy. Sign in. Open `/admin`. Sync documents. Approve the rest of the team on `/admin/access`. |

[docs/deploy/vercel-supabase.md](docs/deploy/vercel-supabase.md) ·
[docs/deploy/environment-variables.md](docs/deploy/environment-variables.md)

## What ships

| Route | What it is |
|-------|------------|
| `/` | Acme overview: metrics, why-now, recognized revenue, contracted yards. |
| `/roadmap` | Path, next ship, competitive matrix. |
| `/financials` | Books hub — P&L, forecast, pipeline, revenue by customer. |
| `/docs`, `/docs/[slug]` | Data room. Registry: `src/lib/documents.ts`. |
| `/company`, `/contact` | Founders, offices, risks, IR contact. |
| `/login` | Google + Microsoft. New emails go to `/pending-approval`. |
| `/admin` | Access queue, viewers, rooms, analytics. |

How a viewer gets in:

1. Middleware refreshes the Supabase session.
2. Verified email on your domain, an env allowlist, an admin row, or an approved waitlist row.
3. Each viewer maps to one fund and one room (core or full). A broken room shows zero documents.
4. Decks and PDFs are stamped with their email. Files live in `content/documents/`, not `public/`.

[ARCHITECTURE.md](ARCHITECTURE.md)

## Make it yours

| Job | File |
|-----|------|
| Name, domain, accent | `.env.local` / `src/config/site.ts` |
| Font | `src/app/layout.tsx` |
| Colors | `src/app/globals.css` + [DESIGN.md](DESIGN.md) |
| Copy | [docs/guides/branding.md](docs/guides/branding.md) |
| Documents | [docs/guides/add-document.md](docs/guides/add-document.md) |
| Rooms | [docs/guides/dataroom-variants.md](docs/guides/dataroom-variants.md) |

## Docs

| Guide | |
|-------|---|
| [Onboarding](docs/ONBOARDING.md) | Brand → Supabase → Vercel |
| [Vercel + Supabase](docs/deploy/vercel-supabase.md) | Production |
| [Environment variables](docs/deploy/environment-variables.md) | Every key |
| [Local development](docs/deploy/local-development.md) | Supabase CLI |
| [GitHub Pages](docs/deploy/github-pages.md) | Public demo |
| [Branding](docs/guides/branding.md) | Name, color, font, copy |
| [Deck theme](docs/guides/deck.md) | Ten-slide HTML deck + restyle |
| [Add a document](docs/guides/add-document.md) | Registry + gating |
| [Room variants](docs/guides/dataroom-variants.md) | Core vs full |
| [Analytics](docs/guides/analytics.md) | Events, digest |
| [Database](docs/reference/database.md) | Tables + RLS |
| [Auth flow](docs/architecture/auth-flow.md) | Login → room |

Coding agents: [AGENTS.md](AGENTS.md).

## Layout

```
src/app/             Pages, admin, API
src/lib/             Auth, documents, rooms, analytics
src/config/          Company defaults
content/documents/   Decks and PDFs (not public/)
supabase/            Schema + seed
docs/                Onboarding and how-to
demo/                GitHub Pages preview (no auth)
scripts/onboard.sh   Copy .env.example
```

## License

[MIT](LICENSE)
