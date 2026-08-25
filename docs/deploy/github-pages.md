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

A GitHub App token cannot flip that Settings switch. Someone with
admin on the repo does it once.

## After a UI change

Update the matching file in `demo/` when you change homepage, docs, or
admin chrome. Use relative links (`./docs.html`).
