import { NextResponse } from "next/server";
import { getAdminSupabase } from "../../_shared";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { data } = await supabase
    .from("document_views")
    .select("document_id, tracked_documents(slug)");
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const tracked = row.tracked_documents as unknown as
      | { slug?: string }
      | { slug?: string }[]
      | null;
    const slug = Array.isArray(tracked) ? tracked[0]?.slug : tracked?.slug;
    if (!slug) continue;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return NextResponse.json({
    documents: [...counts.entries()].map(([slug, views]) => ({ slug, views })),
  });
}
