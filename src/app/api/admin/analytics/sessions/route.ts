import { NextResponse } from "next/server";
import { DEMO_SESSIONS } from "@/lib/analytics/demo-data";
import { getAdminSupabase, jsonDemo } from "../../_shared";

export async function GET() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) {
    return jsonDemo({
      sessions: DEMO_SESSIONS.map((row) => ({
        id: row.id,
        path: row.path,
        email: row.email,
        firm: row.firm,
        started_at: row.started_at,
        ended_at: row.ended_at,
        viewer_id: row.viewer_id,
      })),
    });
  }
  const { data } = await supabase
    .from("visitor_sessions")
    .select("id, current_path, viewer_id, created_at, ended_at, viewers(email, firm)")
    .order("created_at", { ascending: false })
    .limit(50);
  return NextResponse.json({
    sessions: (data ?? []).map((row) => {
      const joined = row.viewers as
        | { email?: string; firm?: string }
        | { email?: string; firm?: string }[]
        | null;
      const viewer = Array.isArray(joined) ? joined[0] : joined;
      return {
        id: row.id,
        path: row.current_path ?? "/",
        email: viewer?.email ?? "unknown",
        firm: viewer?.firm ?? null,
        started_at: row.created_at,
        ended_at: row.ended_at,
        viewer_id: row.viewer_id,
      };
    }),
  });
}
