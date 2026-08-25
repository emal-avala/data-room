import { NextResponse } from "next/server";
import { resolveAuthenticatedViewer } from "@/lib/analytics/authenticated-viewer";

export async function POST(request: Request) {
  const viewer = await resolveAuthenticatedViewer();
  if (!viewer.ok) {
    return NextResponse.json({ error: viewer.error }, { status: viewer.status });
  }
  const body = (await request.json()) as { viewId?: string };
  if (!body.viewId) return NextResponse.json({ error: "viewId required" }, { status: 400 });
  await viewer.supabase
    .from("document_views")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", body.viewId)
    .eq("viewer_id", viewer.viewerId);
  return NextResponse.json({ ok: true });
}
