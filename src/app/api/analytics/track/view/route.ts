import { NextResponse } from "next/server";
import { resolveAuthenticatedViewer } from "@/lib/analytics/authenticated-viewer";

export async function POST(request: Request) {
  const viewer = await resolveAuthenticatedViewer();
  if (!viewer.ok) {
    return NextResponse.json({ error: viewer.error }, { status: viewer.status });
  }
  const body = (await request.json()) as { slug?: string };
  if (!body.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const { data: document } = await viewer.supabase
    .from("tracked_documents")
    .select("id")
    .eq("slug", body.slug)
    .maybeSingle();
  if (!document) return NextResponse.json({ error: "Unknown document" }, { status: 404 });

  const { data } = await viewer.supabase
    .from("document_views")
    .insert({ viewer_id: viewer.viewerId, document_id: document.id })
    .select("id")
    .single();
  return NextResponse.json({ viewId: data?.id });
}
