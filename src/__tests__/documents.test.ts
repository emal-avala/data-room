import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

  it("traces on-disk documents into the Vercel deck and file functions", () => {
    const config = readFileSync(resolve(process.cwd(), "next.config.ts"), "utf8");
    expect(config).toContain("outputFileTracingIncludes");
    expect(config).toContain("/api/docs/[slug]/deck");
    expect(config).toContain("./content/documents/**/*");
  });
});
