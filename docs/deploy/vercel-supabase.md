# Deploy on Vercel + Supabase

Fifteen minutes if you already have both accounts. After this, investors
sign in with Google or Microsoft and you approve them in `/admin`.

Skipping Supabase is valid for the public sample: Vercel still builds
the Next.js app, and `/docs/[slug]` serves the full builtin room. Set
the keys below only when you want a gated room.

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → paste `supabase/migrations/001_schema.sql` → run.
3. Paste `supabase/seed.sql` → run.
4. Authentication → Providers → enable **Google** and/or **Azure**.
   - Google: create an OAuth client in Google Cloud (Web application).
     Authorized redirect: `https://<project-ref>.supabase.co/auth/v1/callback`.
   - Azure: register an app in Entra ID. Same Supabase callback URL.
5. Authentication → URL configuration:
   - Site URL: `https://<your-app>.vercel.app`
   - Redirect URLs: `https://<your-app>.vercel.app/auth/callback`
6. Project Settings → API: copy URL, `anon` key, `service_role` key. Never
   put the service role in `NEXT_PUBLIC_*`.

CLI alternative:

```bash
supabase link --project-ref <ref>
supabase db push
psql "$DATABASE_URL" -f supabase/seed.sql
```

## 2. Vercel

Use the Deploy button on the README (`emal-avala/data-room`), or:

```bash
npx vercel
```

Set every variable from [environment-variables.md](environment-variables.md).
Required to boot:

- `NEXT_PUBLIC_COMPANY_NAME`
- `NEXT_PUBLIC_COMPANY_DOMAIN`
- `SUPERADMIN_EMAIL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` (long random string)

`SUPERADMIN_EMAIL` must be an address you can complete OAuth with. It is
not a database row and cannot be deleted from `/admin/admins`.

## 3. First login

1. Open the deployment.
2. Sign in with the superadmin address.
3. You land in the room (internal-domain auto-approve **or** the superadmin invariant).
4. Visit `/admin`. Sync documents with the button on `/admin/documents` (or `POST /api/admin/documents`).
5. Invite a colleague: they sign in, hit the waitlist, you approve them on `/admin/access`.

## 4. Custom domain

Point `ir.yourcompany.com` at the Vercel project. Add the new origin to
Supabase redirect URLs and set `NEXT_PUBLIC_SITE_URL`.

## Cron

`vercel.json` hits `GET /api/analytics/digest` every Monday at 14:00 UTC.
Vercel sends `Authorization: Bearer $CRON_SECRET` automatically.
