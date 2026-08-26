import { NextResponse } from "next/server";
import { DEMO_DOCUMENTS } from "@/lib/analytics/demo-data";
import { getAdminSupabase, jsonDemo } from "../../_shared";

export async function GET() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) return jsonDemo({ documents: DEMO_DOCUMENTS });
  const { data } = await supabase
    .from("document_views")
    .select("document_id, tracked_documents(slug, title)");
  const counts = new Map<string, { slug: string; title: string; views: number }>();
  for (const row of data ?? []) {
    const tracked = row.tracked_documents as unknown as
      | { slug?: string; title?: string }
      | { slug?: string; title?: string }[]
      | null;
    const doc = Array.isArray(tracked) ? tracked[0] : tracked;
    const slug = doc?.slug;
    if (!slug) continue;
    const current = counts.get(slug) ?? { slug, title: doc?.title ?? slug, views: 0 };
    current.views += 1;
    counts.set(slug, current);
  }
  return NextResponse.json({
    documents: [...counts.values()].sort((a, b) => b.views - a.views),
  });
}
