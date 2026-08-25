import { NextResponse } from "next/server";
import { getAdminSupabase } from "../_shared";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;

  const [{ count: views }, { count: viewers }, { count: docs }] = await Promise.all([
    supabase.from("document_views").select("id", { count: "exact", head: true }),
    supabase.from("viewers").select("id", { count: "exact", head: true }),
    supabase.from("tracked_documents").select("id", { count: "exact", head: true }),
  ]);

  const { count: active } = await supabase
    .from("visitor_sessions")
    .select("id", { count: "exact", head: true })
    .is("ended_at", null);

  return NextResponse.json({
    total_views: views ?? 0,
    unique_viewers: viewers ?? 0,
    total_duration_seconds: 0,
    active_sessions: active ?? 0,
    documents_viewed: docs ?? 0,
  });
}
