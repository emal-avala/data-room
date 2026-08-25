import { describe, expect, it } from "vitest";
import { isPublicChunk } from "@/lib/chunk-gate";

describe("isPublicChunk", () => {
  it("treats login and layout chunks as public", () => {
    expect(isPublicChunk("/_next/static/chunks/app/login/page-abc.js")).toBe(true);
    expect(isPublicChunk("/_next/static/chunks/app/layout-abc.js")).toBe(true);
    expect(isPublicChunk("/_next/static/chunks/framework-abc.js")).toBe(true);
  });

  it("gates concentrated first-party chunks", () => {
    expect(isPublicChunk("/_next/static/chunks/gated-data-abc.js")).toBe(false);
    expect(isPublicChunk("/_next/static/chunks/app-gated-abc.js")).toBe(false);
    expect(isPublicChunk("/_next/static/chunks/app/docs/page-abc.js")).toBe(false);
  });

  it("fails closed on encoded names", () => {
    expect(isPublicChunk("/_next/static/chunks/%67ated-data-abc.js")).toBe(false);
    expect(isPublicChunk("/_next/static/chunks/%2567ated-data-abc.js")).toBe(false);
  });
});
