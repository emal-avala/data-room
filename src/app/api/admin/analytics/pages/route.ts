import { NextResponse } from "next/server";
import { getAdminSupabase } from "../../_shared";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { data } = await supabase.from("site_page_views").select("path");
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.path, (counts.get(row.path) ?? 0) + 1);
  }
  return NextResponse.json({
    pages: [...counts.entries()].map(([path, views]) => ({ path, views })),
  });
}
