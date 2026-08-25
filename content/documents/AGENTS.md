# content/documents/

HTML decks and PDFs live here, **not** in `public/`.

The app reads `fileUrl` from `src/lib/documents.ts` and serves bytes
through `/api/docs/[slug]/deck` or `/file`, stamped with the viewer
email.

| File | Slug |
|------|------|
| `sample-pitch-deck.html` | `pitch-deck` |
| `sample-cap-table.pdf` | `cap-table` (NDA) |

Replace the files. If you add a new slug, follow
[docs/guides/add-document.md](../../docs/guides/add-document.md) in the
same commit.
