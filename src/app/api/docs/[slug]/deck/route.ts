import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { canAccessDataRoomDocument, resolveAuthenticatedDataRoomContext } from "@/lib/dataroom-variants";
import { canViewAudience } from "@/lib/document-audience";
import { getDocumentBySlug } from "@/lib/documents";
import { getDocumentNdaAccess } from "@/lib/nda-evidence";
import { escapeHtml } from "@/lib/escape-html";

function stampMarkup(email: string): string {
  const label = escapeHtml(email);
  return `<div aria-hidden="true" style="pointer-events:none;position:fixed;inset:0;z-index:2147483646;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(10,1fr);opacity:0.06;font:12px ui-sans-serif,system-ui;color:#000;transform:rotate(-18deg);">${Array.from({ length: 60 }, () => `<span>${label}</span>`).join("")}</div><!-- served-to:${label} -->`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const document = getDocumentBySlug(slug);
  if (!document || (document.type !== "deck" && document.type !== "html")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const access = await resolveAuthenticatedDataRoomContext();
  if (access.status !== "allowed" || !canAccessDataRoomDocument(access.context, slug)) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!canViewAudience(document.audience, access.email)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const nda = await getDocumentNdaAccess(document);
  if (nda === "unsigned" || nda === "unauthenticated") {
    return new NextResponse("NDA required", { status: 403 });
  }

  if (!document.fileUrl || document.fileUrl.startsWith("http") || document.fileUrl.startsWith("/")) {
    return new NextResponse("No file", { status: 404 });
  }

  const filePath = path.join(process.cwd(), document.fileUrl);
  const html = await readFile(filePath, "utf8");
  const stamped = html.replace("</body>", `${stampMarkup(access.email)}</body>`);
  return new NextResponse(stamped, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
