import { describe, expect, it } from "vitest";
import { DOCUMENTS, SELECTABLE_DOCUMENT_SLUGS, getDocumentBySlug } from "@/lib/documents";

describe("document registry", () => {
  it("has unique slugs", () => {
    const slugs = DOCUMENTS.map((doc) => doc.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps HTML and PDF sources out of public/", () => {
    for (const doc of DOCUMENTS) {
      if (doc.type === "deck" || doc.type === "html" || doc.type === "pdf") {
        expect(doc.fileUrl).toBeTruthy();
        expect(doc.fileUrl?.startsWith("public/")).toBe(false);
        expect(doc.fileUrl?.startsWith("/")).toBe(false);
      }
    }
  });

  it("exposes every registered slug as selectable", () => {
    for (const doc of DOCUMENTS) {
      expect(SELECTABLE_DOCUMENT_SLUGS.has(doc.slug)).toBe(true);
      expect(getDocumentBySlug(doc.slug)?.name).toBe(doc.name);
    }
  });
});
