import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("site-wide copy deterrent", () => {
  const protection = readFileSync(
    path.join(process.cwd(), "src/components/ContentProtection.tsx"),
    "utf8",
  );
  const layout = readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf8");
  const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
  const demoCss = readFileSync(path.join(process.cwd(), "demo/styles.css"), "utf8");
  const demoJs = readFileSync(path.join(process.cwd(), "demo/protect.js"), "utf8");

  it("is mounted on the public site and skipped on /admin", () => {
    expect(layout).toContain("ContentProtection");
    expect(protection).toContain('pathname?.startsWith("/admin")');
    expect(protection).toContain("isEditableTarget");
  });

  it("blocks copy, cut, selection, context menu, and drag", () => {
    for (const token of ["copy", "cut", "selectstart", "contextmenu", "dragstart", "userSelect"]) {
      expect(protection).toContain(token);
    }
    expect(protection).toContain('"c"');
    expect(protection).toContain('"a"');
    expect(css).toContain("user-select: none");
    expect(css).toContain("[data-allow-copy]");
    expect(demoCss).toContain("user-select: none");
    expect(demoJs).toContain("copy");
    expect(demoJs).toContain("selectstart");
  });
});
