import { NextResponse } from "next/server";
import { getAdminSupabase } from "../_shared";
import { BUILTIN_DATAROOM_VARIANTS } from "@/lib/dataroom-variants";

export async function GET() {
  const { supabase, error } = await getAdminSupabase();
  if (error) return error;
  const { data } = await supabase.from("dataroom_variants").select("*");
  return NextResponse.json({
    variants: data ?? Object.values(BUILTIN_DATAROOM_VARIANTS),
  });
}
