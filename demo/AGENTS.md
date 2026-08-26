# demo/

Static GitHub Pages preview of the Acme Corporation example. No live
API. `/login` is a mocked Google/Microsoft walkthrough
(`demo/login.html`) — same disclaimer string as `MOCK_AUTH_DISCLAIMER`.

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
| `login.html` | `/login` — mock sign-in; keep the disclaimer identical to `MOCK_AUTH_DISCLAIMER` |
| `memo.html` | `/docs/investment-memo` |
| `deck.html` | `/docs/pitch-deck` — must stay identical to `content/documents/sample-pitch-deck.html` |
| `financial-overview.html` | `/docs/financial-overview` |
| `admin.html` | `/admin` |
| `styles.css` | `src/app/globals.css` tokens |
| `package.json` / `vercel.json` | Static Vercel contract when the project builds `gh-pages` |

Use **relative** links. When you change homepage metrics, update `demo/` in the same commit.
`package.json` `vercel-build` must never invoke `next` — the Pages branch
has no App Router.
