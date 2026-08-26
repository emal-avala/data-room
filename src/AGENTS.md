# src/

Next.js App Router. Tailwind v4. Bun.

| Path | Role |
|------|------|
| `app/` | Pages + route handlers |
| `app/admin/` | Console. Unconfigured production serves sample analytics |
| `app/api/admin/` | Session then service-role, or demo-data when unconfigured |
| `lib/analytics/demo-data.ts` | Invented-firm walkthrough rows (`*.example` emails) |
| `components/ContentProtection.tsx` | Public-site copy deterrent; skip `/admin` |
| `components/GitHubLink.tsx` | Header/footer octocat → `siteConfig.repoUrl` |
| `app/api/analytics/` | Identity from session, not the body |
| `app/api/docs/` | Stamped HTML/PDF |
| `config/site.ts` | Company name / domain / accent |
| `lib/documents.ts` | Registry. Security and IP are their own slugs — do not fold them into architecture or the cap table |
| `lib/dataroom-variants.ts` | **Server-only** room allowlists |
| `lib/next-path.ts` | Same-origin `next=` |
| `lib/auth-demo.ts` | Mock `/login` copy + `demo@example.com` when Supabase is missing |
| `middleware.ts` | Session + approval |
| `utils/supabase/` | SSR clients. Placeholders in `.env.example` are not a live project |

Tests live in `src/__tests__/`. If you add a document slug, update
`dataroom-variants.test.ts` in the same commit.
