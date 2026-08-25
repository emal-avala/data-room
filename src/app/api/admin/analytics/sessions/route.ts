import { NextResponse } from "next/server";
import { getAdminSupabase } from "../../_shared";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { data } = await supabase
    .from("visitor_sessions")
    .select("id, current_path, viewer_id, viewers(email)")
    .order("created_at", { ascending: false })
    .limit(50);
  return NextResponse.json({
    sessions: (data ?? []).map((row) => {
      const joined = row.viewers as { email?: string } | { email?: string }[] | null;
      const email = Array.isArray(joined) ? joined[0]?.email : joined?.email;
      return { id: row.id, path: row.current_path ?? "/", email: email ?? "unknown" };
    }),
  });
}
