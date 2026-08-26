# AGENTS.md

How to set up and change this repo. Written for coding agents helping a
founder stand up their own data room.

## What this is

Next.js 16 App Router + Supabase Auth + Vercel. Investors sign in with
Google or Microsoft. Documents are gated by room variant and optional NDA.
`/admin` is the console: access queue, viewers, rooms, analytics.

Production host is **Vercel**
(`https://data-room-coral.vercel.app/`). GitHub Pages is retired — do
not republish `demo/` to `gh-pages`. `demo/` is a local HTML snapshot
for tests only.

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
   `content/documents/…` — **not** `public/`. `version: 1`. Keep
   `outputFileTracingIncludes` in `next.config.ts` pointed at that
   folder or Vercel 500s the deck/file APIs.
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

| | Localhost | Vercel without Supabase | Vercel + Supabase |
|--|-----------|-------------------------|-------------------|
| Auth | Off (staff bypass) | Mock Google/Microsoft walkthrough | On |
| Database | Optional | None | Required |
| `/docs/[slug]` | Full room | Full sample room, no staff bypass | Session + variant |
| `/admin` | Full console | Sample analytics (invented firms) | Session + DB |
| Edit | `src/` | `src/` | `src/` |

Production without Supabase must **not** 404 document pages. That is the
public Acme walkthrough at `*.vercel.app/docs/pitch-deck`. Encoded in
`unconfiguredDataRoomAccess()` — do not restore "fail closed" there.

Production without Supabase must **not** 503 `/admin` or `/api/admin/*`.
That is the sample IR analytics walkthrough (invented firms,
`*.example` emails). Encoded in `isAdminBackendConfigured()` +
`src/lib/analytics/demo-data.ts` — do not restore "Database not
configured" there, and do not put real fund names in the demo rows.
Demo viewer emails must stay off `@acme.example` or `internal-notes`
leaks.

Production without Supabase must **not** dump “set the keys in
`.env.local`” on `/login`. That page is the public IR sign-in
walkthrough: same Google / Microsoft chrome, `MOCK_AUTH_DISCLAIMER`
from `src/lib/auth-demo.ts`, no OAuth call. Encoded there — do not
restore the empty developer state. The mock viewer is
`demo@example.com`, never `@acme.example`.

Copy deterrent: `ContentProtection` plus `user-select: none` on the
public site (investor-site contract — selection, copy/cut, context
menu, drag, Ctrl/Cmd C/X/A/S/P/U). `/admin` is exempt. Do not weaken
it on document pages.

If you change homepage / docs / admin layout, update `demo/` to match.
`demo/deck.html` must stay byte-identical to
`content/documents/sample-pitch-deck.html` (`src/__tests__/deck-theme.test.ts`).
Deck geometry and the ten-slide spine: [docs/guides/deck.md](docs/guides/deck.md).

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
| `demo/` | Local HTML snapshot (not published) |
| `content/documents/` | Files on disk |
| `.github/` | CI |
