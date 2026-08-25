import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { canAccessDataRoomDocument, resolveDataRoomVariantForEmail } from "@/lib/dataroom-variants";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const slugs = new URL(request.url).searchParams.get("slugs")?.split(",") ?? [];
  const context = await resolveDataRoomVariantForEmail(user.email);
  const admin = createAdminClient();
  const { data: grants } = await admin
    .from("document_grants")
    .select("document_slug")
    .eq("email", user.email.toLowerCase());
  const granted = new Set((grants ?? []).map((row) => row.document_slug));

  const result: Record<string, boolean> = {};
  for (const slug of slugs) {
    result[slug] = canAccessDataRoomDocument(context, slug) && granted.has(slug);
  }
  return NextResponse.json({ grants: result });
}
