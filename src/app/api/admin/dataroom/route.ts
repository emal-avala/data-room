import { NextResponse } from "next/server";
import { BUILTIN_DATAROOM_VARIANTS } from "@/lib/dataroom-variants";
import { getAdminSupabase, jsonDemo } from "../_shared";

export async function GET() {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  if (demo) {
    return jsonDemo({
      variants: Object.values(BUILTIN_DATAROOM_VARIANTS).map((room) => ({
        slug: room.slug,
        name: room.name,
        description: room.description,
        document_count: room.documents.size,
      })),
    });
  }
  const { data } = await supabase.from("dataroom_variants").select("*");
  return NextResponse.json({
    variants: data ?? Object.values(BUILTIN_DATAROOM_VARIANTS),
  });
}
