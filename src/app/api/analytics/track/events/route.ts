import { NextResponse } from "next/server";
import { resolveAuthenticatedViewer } from "@/lib/analytics/authenticated-viewer";

export async function POST(request: Request) {
  const viewer = await resolveAuthenticatedViewer();
  if (!viewer.ok) {
    return NextResponse.json({ error: viewer.error }, { status: viewer.status });
  }

  const body = (await request.json().catch(() => ({}))) as {
    events?: Array<{ type?: string; path?: string; at?: string }>;
  };
  const events = body.events ?? [];
  if (events.length === 0) return NextResponse.json({ ok: true });

  await viewer.supabase.from("site_events").insert(
    events.map((event) => ({
      viewer_id: viewer.viewerId,
      type: event.type ?? "unknown",
      path: event.path ?? "/",
      created_at: event.at ?? new Date().toISOString(),
    })),
  );

  for (const event of events) {
    if (event.type === "page_view" && event.path) {
      await viewer.supabase.from("site_page_views").insert({
        viewer_id: viewer.viewerId,
        path: event.path,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
