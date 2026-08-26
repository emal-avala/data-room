import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CATEGORY_ORDER, DOCUMENTS, SELECTABLE_DOCUMENT_SLUGS, getDocumentBySlug } from "@/lib/documents";
import { FULL_ONLY_DOCUMENTS } from "@/lib/dataroom-variants";

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

  it("carves IP and security out of architecture and the cap table", () => {
    const ip = getDocumentBySlug("intellectual-property");
    const security = getDocumentBySlug("security-compliance");
    expect(ip?.category).toBe("Legal");
    expect(ip?.requireNda).toBe(true);
    expect(security?.category).toBe("Security");
    expect(security?.requireNda).toBe(false);
    expect(CATEGORY_ORDER).toContain("Security");
    expect(FULL_ONLY_DOCUMENTS).toContain("intellectual-property");
    expect(FULL_ONLY_DOCUMENTS).toContain("security-compliance");
    expect(FULL_ONLY_DOCUMENTS).not.toContain("internal-notes");

    const articles = readFileSync(resolve(process.cwd(), "src/content/ir/articles.tsx"), "utf8");
    const ipHtml = readFileSync(resolve(process.cwd(), "demo/ip.html"), "utf8");
    const securityHtml = readFileSync(resolve(process.cwd(), "demo/security.html"), "utf8");
    for (const blob of [articles, ipHtml, securityHtml]) {
      expect(blob).not.toMatch(/SOC 2 certified/i);
      expect(blob).not.toMatch(/\b\d{2}\/\d{3},\d{3}\b/);
      expect(blob).not.toContain("@acme.example");
    }
    expect(ipHtml).toContain("Intellectual property");
    expect(securityHtml).toContain("Security and compliance");
    expect(articles).toContain("Keep the carve-out");
    expect(articles).toContain("do not fold them into the cap table");
  });

  it("traces on-disk documents into the Vercel deck and file functions", () => {
    const config = readFileSync(resolve(process.cwd(), "next.config.ts"), "utf8");
    expect(config).toContain("outputFileTracingIncludes");
    expect(config).toContain("/api/docs/[slug]/deck");
    expect(config).toContain("./content/documents/**/*");
  });
});
