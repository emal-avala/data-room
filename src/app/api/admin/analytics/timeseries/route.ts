import { NextResponse } from "next/server";
import { getAdminSupabase } from "../../_shared";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("site_page_views")
    .select("created_at")
    .gte("created_at", since);

  const buckets = new Map<string, number>();
  for (const row of data ?? []) {
    const day = String(row.created_at).slice(0, 10);
    buckets.set(day, (buckets.get(day) ?? 0) + 1);
  }

  return NextResponse.json({
    points: [...buckets.entries()].map(([date, site_views]) => ({
      date,
      site_views,
      doc_views: 0,
    })),
  });
}
