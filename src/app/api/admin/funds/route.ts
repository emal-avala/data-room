import { NextResponse } from "next/server";
import { getDemoFunds, getDemoPipeline } from "@/lib/analytics/demo-data";
import { getAdminSupabase, jsonDemo } from "../_shared";

export async function GET() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) {
    return jsonDemo({
      funds: getDemoFunds(),
      pipeline: getDemoPipeline(),
    });
  }
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
      domain: fund.domain,
    })),
  });
}

export async function POST(request: Request) {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  const body = (await request.json()) as { name?: string; domain?: string };
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  if (demo) return jsonDemo({ id: "demo-fund" });
  const { data } = await supabase
    .from("funds")
    .insert({ name: body.name, domain: body.domain ?? null, stage: "lead" })
    .select("id")
    .single();
  return NextResponse.json({ id: data?.id });
}
