# Contributing

## In

Auth, document gating, room variants, admin, analytics, deploy docs, and
tests that pin those contracts.

## Out

A CRM. A 3D product demo. Someone's live cap table or customer list.

If a screen needs a number to look finished, leave `—` and point at the
file the founder should edit.

## Setup

```bash
cp .env.example .env.local
bun install
bun test
bun run lint
```

## Pull requests

1. One concern per PR.
2. Conventional Commits: `feat(docs): …`, `fix(auth): …`.
3. New document slugs follow [AGENTS.md](AGENTS.md) in the **same commit**.
4. Do not edit a merged SQL migration. Add a new file.
5. `bun test` and `bun run build` before you push.
6. If you change homepage / docs / admin layout, update `demo/`.

[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
