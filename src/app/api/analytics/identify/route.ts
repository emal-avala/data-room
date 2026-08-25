import { NextResponse } from "next/server";
import { resolveAuthenticatedViewer } from "@/lib/analytics/authenticated-viewer";

/** Identity is resolved from the session. Client-supplied emails are ignored. */
export async function POST() {
  const viewer = await resolveAuthenticatedViewer();
  if (!viewer.ok) {
    return NextResponse.json({ error: viewer.error }, { status: viewer.status });
  }
  return NextResponse.json({ viewerId: viewer.viewerId, email: viewer.email });
}
