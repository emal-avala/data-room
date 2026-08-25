import { NextResponse } from "next/server";
import { resolveAuthenticatedViewer } from "@/lib/analytics/authenticated-viewer";

export async function POST(request: Request) {
  const viewer = await resolveAuthenticatedViewer();
  if (!viewer.ok) {
    return NextResponse.json({ error: viewer.error }, { status: viewer.status });
  }
  const body = (await request.json().catch(() => ({}))) as {
    action?: "start" | "end";
    path?: string;
    token?: string;
  };
  if (body.action === "end" && body.token) {
    await viewer.supabase
      .from("visitor_sessions")
      .update({ ended_at: new Date().toISOString() })
      .eq("session_token", body.token);
    return NextResponse.json({ ok: true });
  }
  const token = crypto.randomUUID();
  await viewer.supabase.from("visitor_sessions").insert({
    viewer_id: viewer.viewerId,
    session_token: token,
    current_path: body.path ?? "/",
  });
  return NextResponse.json({ token });
}
