import { NextResponse } from "next/server";
import { getAdminSupabase } from "../_shared";
import { getSuperadminEmail, normalizeAdminEmail } from "@/lib/admin-emails";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { data } = await supabase.from("admin_users").select("email");
  const emails = new Set((data ?? []).map((row) => row.email));
  emails.add(getSuperadminEmail());
  return NextResponse.json({ admins: [...emails] });
}

export async function POST(request: Request) {
  const { supabase, actorIsSuperadmin, error } = await getAdminSupabase();
  if (error) return error;
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
  const { supabase, actorIsSuperadmin, error } = await getAdminSupabase();
  if (error) return error;
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
