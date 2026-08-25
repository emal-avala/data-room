import { NextResponse } from "next/server";
import { resolveAuthenticatedViewer } from "@/lib/analytics/authenticated-viewer";

export async function POST(request: Request) {
  const viewer = await resolveAuthenticatedViewer();
  if (!viewer.ok) {
    return NextResponse.json({ error: viewer.error }, { status: viewer.status });
  }
  const body = (await request.json()) as {
    viewId?: string;
    page?: number;
    action?: "enter" | "exit";
  };
  if (!body.viewId || !body.page) {
    return NextResponse.json({ error: "viewId and page required" }, { status: 400 });
  }
  if (body.action === "exit") {
    await viewer.supabase
      .from("page_views")
      .update({ exited_at: new Date().toISOString() })
      .eq("view_id", body.viewId)
      .eq("page_number", body.page)
      .is("exited_at", null);
  } else {
    await viewer.supabase.from("page_views").insert({
      view_id: body.viewId,
      page_number: body.page,
    });
  }
  return NextResponse.json({ ok: true });
}
