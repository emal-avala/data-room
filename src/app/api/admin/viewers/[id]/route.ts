import { NextResponse } from "next/server";
import { getAdminSupabase } from "../../_shared";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { id } = await params;
  const { data } = await supabase.from("viewers").select("*").eq("id", id).maybeSingle();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}
