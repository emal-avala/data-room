import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DEMO = resolve(process.cwd(), "demo");

describe("gh-pages Vercel static contract", () => {
  const pkg = JSON.parse(readFileSync(resolve(DEMO, "package.json"), "utf8")) as {
    scripts?: Record<string, string>;
  };
  const vercel = JSON.parse(readFileSync(resolve(DEMO, "vercel.json"), "utf8")) as {
    framework: null;
    outputDirectory: string;
    rewrites?: Array<{ source: string; destination: string }>;
  };

  it("does not invoke next build on the static branch", () => {
    expect(pkg.scripts?.["vercel-build"] ?? "").not.toMatch(/next/);
    expect(vercel.framework).toBeNull();
    expect(vercel.outputDirectory).toBe(".");
  });

  it("maps the Next.js document slugs onto the drafted HTML", () => {
    const bySource = Object.fromEntries((vercel.rewrites ?? []).map((row) => [row.source, row.destination]));
    expect(bySource["/docs"]).toBe("/docs.html");
    expect(bySource["/docs/pitch-deck"]).toBe("/deck.html");
    expect(bySource["/docs/investment-memo"]).toBe("/memo.html");
    expect(bySource["/docs/financial-overview"]).toBe("/financial-overview.html");
    expect(bySource["/docs/use-of-funds"]).toBe("/funds.html");
    expect(bySource["/docs/go-to-market"]).toBe("/gtm.html");
    expect(bySource["/docs/competitive-landscape"]).toBe("/competitive.html");
    expect(bySource["/docs/technical-architecture"]).toBe("/architecture.html");
    expect(bySource["/docs/case-studies"]).toBe("/sites.html");
    expect(bySource["/docs/cap-table"]).toBe("/captable.html");
    expect(bySource["/docs/security-compliance"]).toBe("/security.html");
    expect(bySource["/docs/intellectual-property"]).toBe("/ip.html");
    expect(bySource["/login"]).toBe("/login.html");
  });
});
