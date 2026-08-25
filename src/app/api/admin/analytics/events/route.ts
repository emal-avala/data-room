import { NextResponse } from "next/server";
import { getAdminSupabase } from "../../_shared";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { data } = await supabase
    .from("site_events")
    .select("id, type, path")
    .order("created_at", { ascending: false })
    .limit(100);
  return NextResponse.json({ events: data ?? [] });
}
