import { NextResponse } from "next/server";
import { DEMO_ACCESS_REQUESTS } from "@/lib/analytics/demo-data";
import { getAdminSupabase, jsonDemo } from "../_shared";

export async function GET() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) return jsonDemo({ requests: DEMO_ACCESS_REQUESTS });
  const { data } = await supabase
    .from("access_requests")
    .select("id, email, status, requested_at, requested_path")
    .order("requested_at", { ascending: false });
  return NextResponse.json({ requests: data ?? [] });
}

export async function PATCH(request: Request) {
  const { supabase, actorEmail, demo, error } = await getAdminSupabase();
  if (error) return error;
  const body = (await request.json()) as { id?: string; status?: string };
  if (!body.id || (body.status !== "approved" && body.status !== "rejected")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (demo) return jsonDemo({ ok: true });
  await supabase
    .from("access_requests")
    .update({
      status: body.status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: actorEmail,
    })
    .eq("id", body.id);
  return NextResponse.json({ ok: true });
}
