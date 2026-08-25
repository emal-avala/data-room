import { NextResponse } from "next/server";
import { getAdminSupabase } from "../_shared";
import { DOCUMENTS } from "@/lib/documents";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { data } = await supabase.from("tracked_documents").select("*");
  return NextResponse.json({ documents: data ?? [] });
}

export async function POST() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
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
