import { NextResponse } from "next/server";
import { DEMO_SESSIONS } from "@/lib/analytics/demo-data";
import { getAdminSupabase, jsonDemo } from "../../_shared";

export async function GET() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) {
    return jsonDemo({
      sessions: DEMO_SESSIONS.filter((row) => row.ended_at === null).map((row) => ({
        id: row.id,
        current_path: row.path,
        viewer_id: row.viewer_id,
        email: row.email,
        firm: row.firm,
      })),
    });
  }
  const { data } = await supabase
    .from("visitor_sessions")
    .select("id, current_path, viewer_id, viewers(email, firm)")
    .is("ended_at", null)
    .limit(20);
  return NextResponse.json({
    sessions: (data ?? []).map((row) => {
      const joined = row.viewers as
        | { email?: string; firm?: string }
        | { email?: string; firm?: string }[]
        | null;
      const viewer = Array.isArray(joined) ? joined[0] : joined;
      return {
        id: row.id,
        current_path: row.current_path,
        viewer_id: row.viewer_id,
        email: viewer?.email ?? null,
        firm: viewer?.firm ?? null,
      };
    }),
  });
}
