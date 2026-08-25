# supabase/

One schema, one seed. That is the whole database story for a new fork.

```bash
# Cloud project
# SQL Editor → 001_schema.sql → seed.sql

# Local
supabase start
supabase db reset
```

| File | Role |
|------|------|
| `migrations/001_schema.sql` | Tables, RLS, revoked Data API on investor tables |
| `seed.sql` | Sample funds, rooms, document rows matching `src/lib/documents.ts` |
| `config.toml` | Local CLI |

Do not edit `001_schema.sql` after someone has applied it. Add
`002_….sql`. Deploy app code that knows a new slug **before** a migration
that inserts that slug — unknown slugs lock the room.
