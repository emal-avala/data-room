# demo/

Static GitHub Pages preview of the Acme Corporation example. No auth, no API.

Published at `https://emal-avala.github.io/data-room/` by
`.github/workflows/pages.yml`.

| File | Mirrors |
|------|---------|
| `index.html` | `/` |
| `roadmap.html` | `/roadmap` |
| `financials.html` | `/financials` |
| `docs.html` | `/docs` |
| `company.html` | `/company` |
| `contact.html` | `/contact` |
| `memo.html` | `/docs/investment-memo` |
| `deck.html` | `/docs/pitch-deck` — must stay identical to `content/documents/sample-pitch-deck.html` |
| `financial-overview.html` | `/docs/financial-overview` |
| `admin.html` | `/admin` |
| `styles.css` | `src/app/globals.css` tokens |
| `package.json` / `vercel.json` | Static Vercel contract when the project builds `gh-pages` |

Use **relative** links. When you change homepage metrics, update `demo/` in the same commit.
`package.json` `vercel-build` must never invoke `next` — the Pages branch
has no App Router.
