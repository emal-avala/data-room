# Onboarding — stand up your data room

Hand this file to a founder or their coding agent. Follow the sections
in order. You will have a branded site on Vercel with Google/Microsoft
login and a Supabase database.

**Time:** about 20 minutes if you already have GitHub, Vercel, and Google Cloud.

---

## 0. Accounts you need

| Account | Why |
|---------|-----|
| GitHub | This repo (fork or clone) |
| [Supabase](https://supabase.com) | Auth + Postgres |
| [Vercel](https://vercel.com) | Host the Next.js app |
| Google Cloud and/or Microsoft Entra | OAuth so investors can sign in |
| [Resend](https://resend.com) | Optional. Email on access requests |

Install [Bun](https://bun.sh) and, for local DB, the [Supabase CLI](https://supabase.com/docs/guides/local-development).

---

## 1. Clone and name the company

```bash
git clone https://github.com/emal-avala/data-room.git
cd data-room
cp .env.example .env.local
```

Edit `.env.local` (or tell your agent to):

```
NEXT_PUBLIC_COMPANY_NAME="Northwind Robotics"
NEXT_PUBLIC_COMPANY_LEGAL_NAME="Northwind Robotics, Inc."
NEXT_PUBLIC_COMPANY_DOMAIN="northwind.example"
NEXT_PUBLIC_COMPANY_TAGLINE="Autonomy for last-mile freight."
NEXT_PUBLIC_ROUND_LABEL="Seed"
NEXT_PUBLIC_ACCENT="#1D4ED8"
SUPERADMIN_EMAIL="you@northwind.example"
```

`SUPERADMIN_EMAIL` must be the Google or Microsoft address **you** will
click on the login page. It is not a row you can delete later.

`NEXT_PUBLIC_COMPANY_DOMAIN` is the email hostname treated as staff.
Compared for equality: `you@northwind.example` is staff;
`you@northwind.example.evil.com` is not.

```bash
bun install
bun dev    # http://localhost:3000 — no login on localhost
```

---

## 2. Brand, theme, fonts, copy

Do these before you invite a fund. Details: [guides/branding.md](guides/branding.md).

| What | Where |
|------|--------|
| Name, legal name, tagline, round, accent | `.env.local` or `src/config/site.ts` |
| Favicon | `public/icon.svg` |
| Font | `src/app/layout.tsx` (`Source_Sans_3`) and `--font-sans` in `src/app/globals.css` |
| Colors | `src/app/globals.css` `:root` and [DESIGN.md](../DESIGN.md) |
| Homepage metrics | `src/app/page.tsx` — replace the `—` cells |
| Homepage / company / contact copy | `src/app/page.tsx`, `src/app/company/page.tsx`, `src/app/contact/page.tsx` |
| Banner | `src/data/announcements.ts` |
| NDA | `src/lib/nda-agreement.ts` — have counsel review |
| Deck HTML | `content/documents/sample-pitch-deck.html` |
| Static preview (GitHub Pages) | `demo/*.html` + `demo/styles.css` |

Accent (`--primary`) is for buttons and the active nav only. Body text
stays `--foreground`. Light theme only.

To swap the font: change the `next/font/google` import in `layout.tsx`
and keep `variable: "--font-sans"`. No other files need the family name.

---

## 3. Documents

Sample slugs: `pitch-deck`, `investment-memo`, `financial-overview`,
`use-of-funds` (full room), `cap-table` (NDA), `internal-notes` (staff).

Replace files under `content/documents/`. Register them in
`src/lib/documents.ts`. Follow [guides/add-document.md](guides/add-document.md)
if you add a **new** slug — missing a step hides the file or locks the room.

Never put a deck or PDF in `public/`. Byte routes stamp the viewer's email.

---

## 4. Supabase (auth + database)

1. New project at supabase.com.
2. SQL Editor → run `supabase/migrations/001_schema.sql`.
3. SQL Editor → run `supabase/seed.sql`.
4. **Authentication → Providers** → Google and/or Azure.
   - Google: OAuth client (Web). Redirect
     `https://<project-ref>.supabase.co/auth/v1/callback`.
   - Azure: Entra app registration. Same callback.
5. **Authentication → URL configuration**
   - Site URL: `https://<your-app>.vercel.app` (localhost:
     `http://localhost:3000`)
   - Redirect: `https://<your-app>.vercel.app/auth/callback`
6. **Project Settings → API** — copy URL, `anon` key, `service_role` key
   into `.env.local` / Vercel. Service role is **not** `NEXT_PUBLIC_*`.

Local instead of cloud:

```bash
supabase start
supabase db reset
```

---

## 5. Vercel (production)

[Deploy button](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Femal-avala%2Fdata-room) or `npx vercel`.

Set every key from `.env.example`. Required to boot:

- `NEXT_PUBLIC_COMPANY_NAME`
- `NEXT_PUBLIC_COMPANY_DOMAIN`
- `SUPERADMIN_EMAIL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` (long random string)
- `NEXT_PUBLIC_SITE_URL` (`https://your-app.vercel.app`)

Deploy. Open the URL. Sign in as `SUPERADMIN_EMAIL`. Go to `/admin`.
On `/admin/documents` sync the registry. A colleague signs in → waitlist
→ you approve them on `/admin/access`.

Custom domain: point `ir.yourcompany.com` at Vercel, add that origin to
Supabase redirects, set `NEXT_PUBLIC_SITE_URL`.

Full page: [deploy/vercel-supabase.md](deploy/vercel-supabase.md).

---

## 6. GitHub Pages demo (no login)

`demo/` is static HTML. Investors should use the Vercel app. Pages is
the public walkthrough.

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Actions → **Pages** → Run workflow.
3. Site: `https://<you>.github.io/data-room/`

[deploy/github-pages.md](deploy/github-pages.md).

---

## 7. Done when

- [ ] Homepage shows your name and accent
- [ ] You can sign in on Vercel as `SUPERADMIN_EMAIL`
- [ ] `/admin` loads
- [ ] A second email hits `/pending-approval` and you can approve it
- [ ] Pitch deck opens stamped (view source / print — your email is in it)
- [ ] `bun test` passes after any document-slug change

---

## Agent map

| File | Use |
|------|-----|
| [AGENTS.md](../AGENTS.md) | Root rules |
| [docs/AGENTS.md](AGENTS.md) | This folder |
| [src/AGENTS.md](../src/AGENTS.md) | App + API |
| [supabase/AGENTS.md](../supabase/AGENTS.md) | Schema |
| [demo/AGENTS.md](../demo/AGENTS.md) | Static preview |
| [content/documents/AGENTS.md](../content/documents/AGENTS.md) | Files on disk |
