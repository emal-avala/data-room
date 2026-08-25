import { NextResponse } from "next/server";
import { getAdminSupabase } from "../_shared";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { data } = await supabase
    .from("funds")
    .select("id, name, stage, domain")
    .order("name");
  return NextResponse.json({
    funds: (data ?? []).map((fund) => ({
      id: fund.id,
      name: fund.name,
      stage: fund.stage,
      viewer_count: 0,
      engagement_score: 0,
    })),
  });
}

export async function POST(request: Request) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const body = (await request.json()) as { name?: string; domain?: string };
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const { data } = await supabase
    .from("funds")
    .insert({ name: body.name, domain: body.domain ?? null, stage: "lead" })
    .select("id")
    .single();
  return NextResponse.json({ id: data?.id });
}
