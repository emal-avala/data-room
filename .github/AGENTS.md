# .github/

| Workflow | What it does |
|----------|----------------|
| `workflows/ci.yml` | `bun test`, lint, production build |
| `workflows/pages.yml` | Publishes `demo/` to GitHub Pages |

Pages needs a one-time human step: Settings → Pages → Source: GitHub
Actions. See [docs/deploy/github-pages.md](../docs/deploy/github-pages.md).

PR template asks for a "Knowledge encoded" line — what should a later
agent not have to rediscover.
