# Sample documents

Replace these files with your materials.

| File | Used by | Notes |
|------|---------|-------|
| `sample-pitch-deck.html` | `/docs/pitch-deck` via `/api/docs/pitch-deck/deck` | Served stamped. Do not move into `public/`. |
| `sample-cap-table.pdf` | `/docs/cap-table` via `/api/docs/cap-table/file` | Generated placeholder. NDA-gated. |

HTML and PDF sources live **outside** `public/` so there is no URL that serves an unstamped copy. Every delivery goes through the authenticated byte routes.

After you add a real file, update `fileUrl` in `src/lib/documents.ts` and bump `version`.
