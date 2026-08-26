import { NextResponse } from "next/server";
import { BUILTIN_DATAROOM_VARIANTS } from "@/lib/dataroom-variants";
import { getAdminSupabase, jsonDemo } from "../../_shared";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, demo, error } = await getAdminSupabase();
  if (error) return error;
  const { id } = await params;
  if (demo) {
    const room = BUILTIN_DATAROOM_VARIANTS[id];
    if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return jsonDemo({
      slug: room.slug,
      name: room.name,
      description: room.description,
      documents: [...room.documents.values()].map((doc) => doc.slug),
    });
  }
  const { data } = await supabase
    .from("dataroom_variants")
    .select("*")
    .or(`id.eq.${id},slug.eq.${id}`)
    .maybeSingle();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}
