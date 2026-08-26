import { NextResponse } from "next/server";
import { getDemoViewer } from "@/lib/analytics/demo-data";
import { getAdminSupabase, jsonDemo } from "../../_shared";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  const { id } = await params;
  if (demo) {
    const viewer = getDemoViewer(id);
    if (!viewer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return jsonDemo(viewer);
  }
  const { data } = await supabase.from("viewers").select("*").eq("id", id).maybeSingle();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}
