import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const body = (await request.json()) as { slug?: string };
  if (!body.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const admin = createAdminClient();
  await admin.from("document_requests").insert({
    email: user.email.toLowerCase(),
    document_slug: body.slug,
    status: "pending",
  });
  return NextResponse.json({ status: "pending" });
}
