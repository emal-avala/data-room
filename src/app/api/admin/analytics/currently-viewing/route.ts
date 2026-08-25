import { NextResponse } from "next/server";
import { getAdminSupabase } from "../../_shared";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { data } = await supabase
    .from("visitor_sessions")
    .select("id, current_path, viewer_id, viewers(email)")
    .is("ended_at", null)
    .limit(20);
  return NextResponse.json({ sessions: data ?? [] });
}
