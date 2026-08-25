# Auth flow

See [ARCHITECTURE.md](../../ARCHITECTURE.md) for the spine.

Deep links survive every hop:

```
/docs/pitch-deck?slide=4
  → /login?next=%2Fdocs%2Fpitch-deck%3Fslide%3D4
  → /auth/callback?next=…
  → /docs/pitch-deck?slide=4          (approved)
  → /pending-approval?next=…          (not yet)
```

`sanitizeNextPath` rejects `//host`, `/\\host`, `/javascript:…`, gate
routes, and the homepage (so a cold visit does not skip the login screen).
Fragments never reach the server; `withInheritedHash` reattaches them on
the client.
