import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { canAccessDataRoomDocument, resolveAuthenticatedDataRoomContext } from "@/lib/dataroom-variants";
import { canViewAudience } from "@/lib/document-audience";
import { getDocumentBySlug } from "@/lib/documents";
import { getDocumentNdaAccess } from "@/lib/nda-evidence";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const document = getDocumentBySlug(slug);
  if (!document || document.type !== "pdf" || !document.fileUrl) {
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

  const filePath = path.join(process.cwd(), document.fileUrl);
  const bytes = await readFile(filePath);
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const label = `${access.email} · ${new Date().toISOString()}`;
  for (const page of pdf.getPages()) {
    page.drawText(label, {
      x: 36,
      y: 24,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }
  const stamped = await pdf.save();
  return new NextResponse(Buffer.from(stamped), {
    headers: {
      "Content-Type": "application/pdf",
      "Cache-Control": "private, no-store",
      "Content-Disposition": `inline; filename="${slug}.pdf"`,
    },
  });
}
