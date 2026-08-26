# Document registry

`src/lib/documents.ts` is the source of truth.

```ts
type Document = {
  name: string;
  slug: string;                 // access-control key — renaming breaks grants
  type: "pdf" | "excel" | "deck" | "article" | "webpage" | "html";
  description: string;
  category: string;
  fileUrl: string | null;
  requireNda: boolean;
  version: number;
  distribution: "primary" | "on-request" | "retired";
  audience?: "investor" | "internal";
};
```

`internal` is enforced on the server (`canViewAudience`). Hiding a link is
not the control.

`primary` documents appear on `/docs`. `on-request` stay reachable by
direct URL after a grant. `retired` stay in the registry so old grants do
not 404, but they are not listed.

Security and IP are their own slugs (`security-compliance`,
`intellectual-property`). Do not bury them inside architecture or the
cap table.
