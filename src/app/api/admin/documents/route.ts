import { NextResponse } from "next/server";
import { getDemoTrackedDocuments } from "@/lib/analytics/demo-data";
import { DOCUMENTS } from "@/lib/documents";
import { getAdminSupabase, jsonDemo } from "../_shared";

export async function GET() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) return jsonDemo({ documents: getDemoTrackedDocuments() });
  const { data } = await supabase.from("tracked_documents").select("*");
  return NextResponse.json({ documents: data ?? [] });
}

export async function POST() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) return jsonDemo({ ok: true, synced: DOCUMENTS.length });
  for (const doc of DOCUMENTS) {
    await supabase.from("tracked_documents").upsert(
      {
        slug: doc.slug,
        title: doc.name,
        type: doc.type === "article" || doc.type === "html" || doc.type === "webpage" ? "other" : doc.type,
        file_url: doc.fileUrl,
        settings: { require_nda: doc.requireNda, allow_download: true, require_email: true },
      },
      { onConflict: "slug" },
    );
  }
  return NextResponse.json({ ok: true, synced: DOCUMENTS.length });
}
