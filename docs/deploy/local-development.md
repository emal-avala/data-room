# Local development

```bash
cp .env.example .env.local
bun install
bun dev
```

`http://localhost:3000` and `127.0.0.1` **bypass the auth gate**. That is
deliberate: you can click every page without standing up OAuth. The bypass
is disabled when `NODE_ENV === "production"`.

## With local Supabase

```bash
supabase start
supabase db reset    # migrations + seed.sql
```

Put the local URL and keys into `.env.local`. Stop using the bypass by
opening the site as `http://<your-lan-ip>:3000` or by deploying a preview.

## Useful commands

```bash
bun test
bun run lint
bun run build
bun run typecheck
```
