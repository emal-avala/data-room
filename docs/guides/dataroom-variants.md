# Room variants

Two built-in rooms ship:

| Slug | Who sees it | Documents |
|------|-------------|-----------|
| `core` | Default first conversation | pitch-deck, investment-memo, financial-overview |
| `full` | Assigned lead, or staff | core + use-of-funds, cap-table |

Staff (internal email domain) always see the full room and bypass the
allowlist (`staffBypass`).

A fund's `dataroom_variant_id` wins. If that row is missing, the raise
amount is not in `DATAROOM_RAISE_AMOUNTS_CENTS`, or a document slug is
unknown to the running bundle, resolution returns the **locked** room:
zero documents, `notFound()` on every slug.

Deploy code that knows a new slug **before** you insert the database row.
