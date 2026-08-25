# Database

One migration: `supabase/migrations/001_schema.sql`.

| Table | Role |
|-------|------|
| `viewers` | One row per authenticated email |
| `tracked_documents` | Analytics catalog (synced from `documents.ts`) |
| `document_views`, `page_views`, `document_downloads` | DocSend-style engagement |
| `visitor_sessions`, `site_page_views`, `site_events` | Site analytics |
| `access_requests` | Waitlist |
| `document_requests`, `document_grants` | Per-document access |
| `admin_users` | Roster (owner is env, not a row) |
| `nda_signature_evidence` | Append-only signed NDA snapshots |
| `dataroom_variants` + `*_documents` + `*_assets` | Room composition |
| `funds`, `fund_stage_history`, `viewer_notes` | Firm assignment |

`viewer_engagement` is a view. RLS is enabled. `anon` and `authenticated`
are revoked on investor tables. Application code uses the service role
after checking a verified session.
