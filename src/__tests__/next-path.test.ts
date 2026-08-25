import { describe, expect, it } from "vitest";
import {
  appendNextPath,
  sanitizeNextPath,
  withInheritedHash,
  withNextPath,
} from "@/lib/next-path";

describe("sanitizeNextPath", () => {
  it("accepts a same-origin document path with query", () => {
    expect(sanitizeNextPath("/docs/pitch-deck?slide=4")).toBe("/docs/pitch-deck?slide=4");
  });

  it("rejects the homepage so a cold visit does not skip the login screen", () => {
    expect(sanitizeNextPath("/")).toBeNull();
  });

  it("rejects protocol-relative and scheme paths", () => {
    expect(sanitizeNextPath("//evil.example")).toBeNull();
    expect(sanitizeNextPath("/\\evil.example")).toBeNull();
    expect(sanitizeNextPath("/javascript:alert(1)")).toBeNull();
  });

  it("rejects gate and API destinations", () => {
    expect(sanitizeNextPath("/login")).toBeNull();
    expect(sanitizeNextPath("/api/access")).toBeNull();
  });

  it("collapses dot segments that would become protocol-relative", () => {
    expect(sanitizeNextPath("/foo/..//evil.example")).toBeNull();
  });
});

describe("withInheritedHash", () => {
  it("appends a client-only fragment", () => {
    expect(withInheritedHash("/docs/pitch-deck", "#slide-2")).toBe("/docs/pitch-deck#slide-2");
  });

  it("does not overwrite an existing fragment", () => {
    expect(withInheritedHash("/docs/pitch-deck#keep", "#other")).toBe("/docs/pitch-deck#keep");
  });
});

describe("withNextPath / appendNextPath", () => {
  it("sets and clears the next param", () => {
    const url = new URL("https://example.com/login");
    expect(withNextPath(url, "/docs/memo").searchParams.get("next")).toBe("/docs/memo");
    expect(withNextPath(url, null).searchParams.has("next")).toBe(false);
  });

  it("appends to a path string", () => {
    expect(appendNextPath("/auth/callback", "/docs/memo")).toBe(
      "/auth/callback?next=%2Fdocs%2Fmemo",
    );
  });
});
