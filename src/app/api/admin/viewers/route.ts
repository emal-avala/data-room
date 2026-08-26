import { NextResponse } from "next/server";
import { DEMO_VIEWERS } from "@/lib/analytics/demo-data";
import { getAdminSupabase, jsonDemo } from "../_shared";

export async function GET() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) {
    return jsonDemo({
      viewers: DEMO_VIEWERS.map((row) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        firm: row.firm,
        last_seen_at: row.last_seen_at,
        engagement_score: row.engagement_score,
        total_views: row.total_views,
      })),
    });
  }
  const { data } = await supabase
    .from("viewers")
    .select("id, email, name, firm, last_seen_at")
    .order("last_seen_at", { ascending: false })
    .limit(200);
  return NextResponse.json({ viewers: data ?? [] });
}
