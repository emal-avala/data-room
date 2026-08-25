import { afterEach, describe, expect, it } from "vitest";
import { canViewAudience, isInternalViewer } from "@/lib/document-audience";

const originalDomain = process.env.NEXT_PUBLIC_COMPANY_DOMAIN;

afterEach(() => {
  if (originalDomain === undefined) delete process.env.NEXT_PUBLIC_COMPANY_DOMAIN;
  else process.env.NEXT_PUBLIC_COMPANY_DOMAIN = originalDomain;
});

describe("isInternalViewer", () => {
  it("fails closed on missing identity", () => {
    expect(isInternalViewer(null)).toBe(false);
    expect(isInternalViewer(undefined)).toBe(false);
    expect(isInternalViewer("")).toBe(false);
  });

  it("accepts the configured domain and rejects lookalikes", () => {
    expect(isInternalViewer("jordan@acme.example")).toBe(true);
    expect(isInternalViewer("jordan@acme.example.evil.com")).toBe(false);
    expect(isInternalViewer("jordan@notacme.example")).toBe(false);
    expect(isInternalViewer("attacker@evil.com?x=@acme.example")).toBe(false);
    expect(isInternalViewer('"foo@acme.example"@evil.com')).toBe(false);
  });
});

describe("canViewAudience", () => {
  it("lets any viewer see investor documents", () => {
    expect(canViewAudience(undefined, "partner@fund.example")).toBe(true);
    expect(canViewAudience("investor", "partner@fund.example")).toBe(true);
  });

  it("restricts internal documents to the company domain", () => {
    expect(canViewAudience("internal", "jordan@acme.example")).toBe(true);
    expect(canViewAudience("internal", "partner@fund.example")).toBe(false);
  });
});
