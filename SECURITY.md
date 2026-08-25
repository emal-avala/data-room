# Security

## Report a vulnerability

Email **security@avala.ai**. Do not open a public issue for a leak of gated
documents, an auth bypass, or an open redirect.

## Invariants

- Admin APIs authenticate the browser session, then use the service-role
  key. The service-role JWT is not the actor.
- `email_confirmed_at` is required before any auto-approve.
- Internal-domain checks compare the parsed hostname, not a string suffix.
- `next` is same-origin only (`src/lib/next-path.ts`).
- NDA evidence is append-only. Access decisions do not read a mutable NDA row.
- HTML decks and PDFs are not in `public/`. Byte routes stamp the viewer.
- Public JS chunks must not contain gated sentinels
  (`scripts/check-public-chunks.ts`).
- RLS is on. `anon` / `authenticated` are revoked on investor tables.

## Secrets

Never commit `.env.local`. Rotate `SUPABASE_SERVICE_ROLE_KEY` and
`CRON_SECRET` if they appear in a log or a screenshot.
