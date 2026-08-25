# Architecture

Data Room is a Next.js App Router application with Supabase Auth and Postgres.
There is no application server besides the Vercel functions that host the
route handlers.

## Authorization spine

```
GET /docs/pitch-deck?slide=4
        │
        ▼
middleware (src/utils/supabase/middleware.ts)
        │  no session          → /login?next=/docs/pitch-deck?slide=4
        │  unverified email    → /pending-approval?next=…
        │  verified + approved → continue
        ▼
requireDataRoomDocument("pitch-deck")
        │  resolve viewer → fund → variant
        │  slug missing from variant → notFound()
        ▼
page / byte route
        │  NDA required and unsigned → 403
        │  else stamp email into HTML/PDF
```

Four approval tiers, in order:

1. Verified email on the internal domain (`NEXT_PUBLIC_COMPANY_DOMAIN`)
2. `APPROVED_INVESTOR_EMAILS` env allowlist
3. Row in `admin_users`, or the immutable `SUPERADMIN_EMAIL`
4. `access_requests.status = 'approved'`

An unverified self-signup that happens to match the internal domain is **not**
approved. `email_confirmed_at` is required on every path.

## Room variants

`src/lib/dataroom-variants.ts` is server-only. Importing it from a client
component would ship every room's allowlist in a browser chunk.

Resolution:

| Viewer | Result |
|--------|--------|
| Internal domain | Full built-in room, `staffBypass: true` |
| Fund with `dataroom_variant_id` | That database variant, or **locked** if invalid |
| Fund with no assignment | Active default variant |
| Lookup error | Locked (zero documents) |

A locked room is not a redirect to the default room. Fail closed.

Changing `DATAROOM_RAISE_AMOUNTS_CENTS` or adding a document slug must land
in a deploy **before** the matching database row. The loader treats an
unknown slug or amount as `missing` and locks every fund on that variant.

## Analytics identity

`resolveAuthenticatedViewer()` reads the Supabase session and upserts
`viewers` by that email. Track routes ignore `email` and `viewer_id` on the
request body. A client cannot identify as someone else.

Engagement score (view `viewer_engagement`):

```
min(100, duration_minutes * 2 + views * 5 + unique_docs * 10)
```

The weekly digest (`/api/analytics/digest`) is a Vercel Cron. It and
`/api/analytics/check-hot-leads` require `Authorization: Bearer $CRON_SECRET`.

## Admin API

`getAdminSupabase()` in `src/app/api/admin/_shared.ts`:

1. Localhost + non-production → service role as the superadmin (dev only)
2. Production → verified session + `isApprovedAdmin` → service role
3. Actor email is returned separately; the service-role JWT is not the user

## Chunk gating

`next.config.ts` forces:

- `src/data/*` (except announcements) → `gated-data-*`
- first-party modules outside the login shell → `app-gated-*`

Middleware serves those chunks only with a session.
`scripts/check-public-chunks.ts` fails the build if a public chunk contains a
sample raise amount or other sentinel.

## Email

Resend is optional. Without `RESEND_API_KEY` the access-request and digest
routes still write rows; they just skip the send.
