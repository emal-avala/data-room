# GitHub Pages demo

`demo/` is a static copy of the homepage, document list, memo, deck, and
admin overview. No auth. No API.

URL: `https://<owner>.github.io/data-room/`

## How it publishes

`.github/workflows/pages.yml` copies `demo/` onto the `gh-pages` branch
when `demo/` or the workflow file changes on `main` (or when you run the
workflow by hand).

GitHub Actions cannot create the Pages site. The site is served from
**Deploy from a branch** → `gh-pages` / `/`.

If the live URL 404s after a fork:

1. Run the **Pages** workflow so `gh-pages` exists.
2. Repo **Settings → Pages → Source: Deploy from a branch**.
3. Branch: **gh-pages** / **/** (root). Save.

## After a UI change

Update the matching file in `demo/` when you change homepage, docs, or
admin chrome. Use relative links (`./docs.html`).
