# AGENTS.md

How to set up and change this repo. Written for coding agents helping a
founder stand up their own data room.

## What this is

Next.js 16 App Router + Supabase Auth + Vercel. Investors sign in with
Google or Microsoft. Documents are gated by room variant and optional NDA.
`/admin` is the console: access queue, viewers, rooms, analytics.

Production host is **Vercel**. The GitHub Pages site in `demo/` is a static
walkthrough with no login — do not treat it as the app.

## First run (local)

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_COMPANY_NAME, NEXT_PUBLIC_COMPANY_DOMAIN, SUPERADMIN_EMAIL
bun install
bun dev                 # http://localhost:3000 — auth is off on localhost
```

With a real database:

```bash
supabase start
supabase db reset       # applies supabase/migrations + seed.sql
```

Founder / agent playbook: [docs/ONBOARDING.md](docs/ONBOARDING.md).
Production: [docs/deploy/vercel-supabase.md](docs/deploy/vercel-supabase.md).

## Commands

```bash
bun test                # vitest
bun run lint
bun run build           # next build + public-chunk leak check
bun run typecheck
```

Use Bun. CI is `bun install --frozen-lockfile` (see `bun.lock`).

## Brand the site

1. `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_COMPANY_DOMAIN`, `NEXT_PUBLIC_ACCENT`
2. or edit `src/config/site.ts`
3. `SUPERADMIN_EMAIL` = the founder's Google/Microsoft login (not a DB row)

Internal-domain checks compare the email hostname for **equality**.
`founder@example.com.evil.com` is not internal.

## Add a document

Missing any step hides the file or locks every room that names it.

1. Page: add a case in `src/app/docs/[slug]/page.tsx`, or a route under
   `src/app/docs/<slug>/` wrapped in `ArticlePage`.
2. That route's `layout.tsx` must `export const dynamic = "force-dynamic"`
   and `await requireDataRoomDocument("<slug>")`.
3. Register in `src/lib/documents.ts`. HTML/PDF `fileUrl` points at
   `content/documents/…` — **not** `public/`. `version: 1`.
4. Add the slug to `CORE_DOCUMENTS` or `FULL_ONLY_DOCUMENTS` in
   `src/lib/dataroom-variants.ts`.
5. Same commit: update the pinned counts in
   `src/__tests__/dataroom-variants.test.ts`.
6. Add the slug to `supabase/seed.sql` or a **new** migration
   (`dataroom_variant_documents`). Deploy the code **before** applying a
   migration that names a new slug. Unknown slugs lock the room.
7. Later edits: bump `version` so readers see "Updated".

Full checklist: [docs/guides/add-document.md](docs/guides/add-document.md).

## Auth rules you must not break

- Identity for analytics comes from the Supabase session, never the request body.
- Admin routes: session → `isApprovedAdmin` → service-role client. Actor email
  is a separate return value.
- `email_confirmed_at` is required. A matching domain is not enough.
- Fail closed: invalid room composition → zero documents, not a fallback room.
- `src/lib/dataroom-variants.ts` is server-only.

## Demo vs production

| | Localhost | Vercel | GitHub Pages (`demo/`) |
|--|-----------|--------|------------------------|
| Auth | Off | On | None (static HTML) |
| Database | Optional | Required | None |
| Edit | `src/` | `src/` | `demo/*.html` |

If you change homepage / docs / admin layout, update `demo/` to match.

## Do not

- Put decks or PDFs in `public/` (they would be world-readable).
- Edit a merged SQL migration — add a new file.
- Commit `.env.local`, service-role keys, or a live cap table.
- Import `dataroom-variants` from a client component.

## Where things live

| Path | AGENTS.md |
|------|-----------|
| `docs/` | Onboarding and how-to |
| `src/` | App, API, auth contracts |
| `supabase/` | Schema and seed |
| `demo/` | GitHub Pages preview |
| `content/documents/` | Files on disk |
| `.github/` | CI and Pages |
