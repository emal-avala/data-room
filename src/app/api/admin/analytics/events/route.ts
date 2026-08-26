import { NextResponse } from "next/server";
import { DEMO_EVENTS } from "@/lib/analytics/demo-data";
import { getAdminSupabase, jsonDemo } from "../../_shared";

export async function GET() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) return jsonDemo({ events: DEMO_EVENTS });
  const { data } = await supabase
    .from("site_events")
    .select("id, type, path, created_at, viewers(email, firm)")
    .order("created_at", { ascending: false })
    .limit(100);
  return NextResponse.json({
    events: (data ?? []).map((row) => {
      const joined = row.viewers as
        | { email?: string; firm?: string }
        | { email?: string; firm?: string }[]
        | null;
      const viewer = Array.isArray(joined) ? joined[0] : joined;
      return {
        id: row.id,
        type: row.type,
        path: row.path,
        email: viewer?.email ?? null,
        firm: viewer?.firm ?? null,
        created_at: row.created_at,
      };
    }),
  });
}
