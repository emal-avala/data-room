# Environment variables

| Name | Public? | Required | Purpose |
|------|---------|----------|---------|
| `NEXT_PUBLIC_COMPANY_NAME` | yes | yes | Header, titles, emails |
| `NEXT_PUBLIC_COMPANY_LEGAL_NAME` | yes | no | NDA and footer |
| `NEXT_PUBLIC_COMPANY_DOMAIN` | yes | yes | Internal-staff hostname (equality, not suffix) |
| `NEXT_PUBLIC_COMPANY_TAGLINE` | yes | no | Homepage subtitle |
| `NEXT_PUBLIC_ROUND_LABEL` | yes | no | e.g. `Series A`, `Seed` |
| `NEXT_PUBLIC_SITE_URL` | yes | yes in prod | Absolute links in email |
| `NEXT_PUBLIC_ACCENT` | yes | no | Primary button color |
| `SUPERADMIN_EMAIL` | no | yes | Immutable owner account |
| `APPROVED_INVESTOR_EMAILS` | no | no | Comma-separated waitlist bypass |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | yes | Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | yes | Browser + middleware client |
| `SUPABASE_SERVICE_ROLE_KEY` | no | yes | Admin APIs, analytics writes |
| `RESEND_API_KEY` | no | no | Access-request + digest email |
| `IR_FROM_EMAIL` | no | no | Resend From |
| `IR_ADMIN_INBOX` | no | no | Where request alerts go |
| `CRON_SECRET` | no | yes in prod | Bearer token for digest / hot-lead routes |

`NEXT_PUBLIC_*` values ship to the browser. They must not contain a
fundraising figure or a customer name.
