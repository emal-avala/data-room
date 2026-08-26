import { NextResponse } from "next/server";
import { getDemoViewerTimeline } from "@/lib/analytics/demo-data";
import { getAdminSupabase, jsonDemo } from "../../../_shared";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  const { id } = await params;
  if (demo) return jsonDemo({ events: getDemoViewerTimeline(id) });
  const { data } = await supabase
    .from("site_events")
    .select("id, type, path, created_at")
    .eq("viewer_id", id)
    .order("created_at", { ascending: false })
    .limit(100);
  return NextResponse.json({
    events: (data ?? []).map((row) => ({
      id: row.id,
      type: row.type,
      at: row.created_at,
      path: row.path,
    })),
  });
}
