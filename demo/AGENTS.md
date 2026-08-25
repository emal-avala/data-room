# demo/

Static GitHub Pages preview. No auth, no API, no Supabase.

Published at `https://emal-avala.github.io/data-room/` by
`.github/workflows/pages.yml`.

| File | Mirrors |
|------|---------|
| `index.html` | `/` |
| `docs.html` | `/docs` |
| `memo.html` | `/docs/investment-memo` |
| `deck.html` | `/docs/pitch-deck` |
| `admin.html` | `/admin` |
| `styles.css` | `src/app/globals.css` tokens |

Use **relative** links (`./docs.html`). The site is served under `/data-room/`.

When you change homepage, document cards, or admin chrome in `src/`, update
the matching HTML here in the same PR.
