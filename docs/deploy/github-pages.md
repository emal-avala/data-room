# GitHub Pages demo

`demo/` is a static copy of the homepage, document list, memo, deck, and
admin overview. No auth. No API.

URL after the first successful deploy:
`https://<owner>.github.io/data-room/`

## Enable once

1. Repo **Settings → Pages**.
2. Build and deployment → Source: **GitHub Actions**.
3. Actions → **Pages** → Run workflow (or push to `main`).

The workflow is `.github/workflows/pages.yml`. It uploads the `demo/`
folder.

If a Vercel project is pointed at the `gh-pages` branch (this demo’s
existing deploy), `demo/package.json` + `demo/vercel.json` make that
branch a **static** site. Do not let Vercel run `next build` there —
`gh-pages` has no `src/app`. The Next.js app lives on `main`.

A GitHub App token cannot flip that Settings switch. Someone with
admin on the repo does it once.

## After a UI change

Update the matching file in `demo/` when you change homepage, docs, or
admin chrome. Use relative links (`./docs.html`).
