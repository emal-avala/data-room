# .github/

| Workflow | What it does |
|----------|----------------|
| `workflows/ci.yml` | `bun test`, lint, production build |
| `workflows/pages.yml` | Copies `demo/` onto `gh-pages` |

Pages is served from the `gh-pages` branch (root). Enable once on a
fork: Settings → Pages → Deploy from a branch → `gh-pages` / `/`.
See [docs/deploy/github-pages.md](../docs/deploy/github-pages.md).

PR template asks for a "Knowledge encoded" line — what should a later
agent not have to rediscover.
