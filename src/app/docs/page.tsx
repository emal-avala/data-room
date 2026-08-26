import Link from "next/link";
import { getDocumentCategories } from "@/lib/documents";
import { isInternalViewer } from "@/lib/document-audience";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  let email: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  } catch {
    email = null;
  }

  const categories = getDocumentCategories(isInternalViewer(email));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-eyebrow">Data room</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Documents</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Core room: deck, memo, financials. Full room adds use of funds, go-to-market, architecture, site notes,
        security and compliance, and the NDA-gated cap table and IP schedule.
      </p>
      <div className="mt-12 space-y-12">
        {categories.map((category) => (
          <section key={category.title}>
            <h2 className="mb-4 text-lg font-semibold">{category.title}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {category.documents.map((doc) => (
                <Link key={doc.slug} href={`/docs/${doc.slug}`} className="container-box p-6">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {doc.type}
                    {doc.requireNda ? " · NDA" : ""}
                  </p>
                  <h3 className="mt-2 font-semibold">{doc.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{doc.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
