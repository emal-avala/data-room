import { DOCUMENTS } from "@/lib/documents";

export default function AdminDocumentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The registry in <code>src/lib/documents.ts</code> is the source of
        truth. Sync it to <code>tracked_documents</code> after deploy via{" "}
        <code>POST /api/admin/documents</code>.
      </p>
      <div className="mt-8 divide-y divide-border container-box">
        {DOCUMENTS.map((doc) => (
          <div key={doc.slug} className="p-4 text-sm">
            <p className="font-medium">{doc.name}</p>
            <p className="text-muted-foreground">
              {doc.slug} · {doc.distribution} · v{doc.version}
              {doc.requireNda ? " · NDA" : ""}
              {doc.audience === "internal" ? " · internal" : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
