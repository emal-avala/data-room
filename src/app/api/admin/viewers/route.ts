import { NextResponse } from "next/server";
import { getAdminSupabase } from "../_shared";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { data } = await supabase
    .from("viewers")
    .select("id, email, firm, last_seen_at")
    .order("last_seen_at", { ascending: false })
    .limit(200);
  return NextResponse.json({ viewers: data ?? [] });
}
