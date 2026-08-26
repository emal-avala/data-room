import { NextResponse } from "next/server";
import { getDemoAdmins } from "@/lib/analytics/demo-data";
import { getSuperadminEmail, normalizeAdminEmail } from "@/lib/admin-emails";
import { getAdminSupabase, jsonDemo } from "../_shared";

export async function GET() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) return jsonDemo({ admins: getDemoAdmins() });
  const { data } = await supabase.from("admin_users").select("email");
  const emails = new Set((data ?? []).map((row) => row.email));
  emails.add(getSuperadminEmail());
  return NextResponse.json({ admins: [...emails] });
}

export async function POST(request: Request) {
  const { supabase, actorIsSuperadmin, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) return jsonDemo({ ok: true });
  if (!actorIsSuperadmin) {
    return NextResponse.json({ error: "Only the owner can add admins" }, { status: 403 });
  }
  const body = (await request.json()) as { email?: string };
  const email = normalizeAdminEmail(body.email);
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  await supabase.from("admin_users").upsert({ email });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { supabase, actorIsSuperadmin, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) return jsonDemo({ ok: true });
  if (!actorIsSuperadmin) {
    return NextResponse.json({ error: "Only the owner can remove admins" }, { status: 403 });
  }
  const body = (await request.json()) as { email?: string };
  const email = normalizeAdminEmail(body.email);
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  if (email === getSuperadminEmail()) {
    return NextResponse.json({ error: "Cannot remove the owner" }, { status: 400 });
  }
  await supabase.from("admin_users").delete().eq("email", email);
  return NextResponse.json({ ok: true });
}
