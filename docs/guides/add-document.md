# Add a document

Follow this list in one commit. A slug that exists in the admin composer
but not in the running bundle **locks every room** that selected it.

1. Write the page (`ArticlePage` or a deck/PDF file under `content/documents/`).
2. `layout.tsx`: `dynamic = "force-dynamic"` + `requireDataRoomDocument("<slug>")`.
3. Register in `src/lib/documents.ts`.
4. Add the slug to `CORE_DOCUMENTS` or `FULL_ONLY_DOCUMENTS`.
5. Update `src/__tests__/dataroom-variants.test.ts` counts.
6. After the deploy that knows the slug, add the `dataroom_variant_documents` rows in a **new** migration.

`fileUrl` for HTML and PDF must not live in `public/`. Delivery goes through
`/api/docs/<slug>/deck` or `/file`, which stamp the viewer.

Bump `version` when you edit content so returning readers see "Updated".

The template already carves out two full-room slots that Series A rooms
usually grow. Edit these pages instead of adding a third dump:

| Slug | Category | NDA | Put here |
|------|----------|-----|----------|
| `security-compliance` | Security | No | Controls, residency, attestation status. Not a certificate claim. Pen-test PDF stays on request. |
| `intellectual-property` | Legal | Yes | Patents, inbound licenses, OSS. Application numbers stay with counsel. |

Do not fold either into architecture or the cap table.
