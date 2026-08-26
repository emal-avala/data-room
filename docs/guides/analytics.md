# Analytics

Viewers are resolved from the Supabase session. Track routes ignore
client-supplied emails.

| Route | Writes |
|-------|--------|
| `POST /api/analytics/track/events` | `site_events`, `site_page_views` |
| `POST /api/analytics/track/view` | `document_views` start |
| `POST /api/analytics/track/page` | `page_views` enter/exit |
| `POST /api/analytics/track/end` | `document_views` end |
| `POST /api/analytics/session` | `visitor_sessions` |
| `GET /api/analytics/digest` | Weekly email (cron) |
| `POST /api/analytics/check-hot-leads` | Email when score ≥ 70 |

Admin charts read the same tables through `getAdminSupabase()`.

When Supabase is not configured (the public sample deploy), those routes
return the in-memory dataset in `src/lib/analytics/demo-data.ts` instead
of 503. The rows are invented firms (`maya@redwoodharbor.example`).
Do not put real fund names in that file. Mutations no-op.
