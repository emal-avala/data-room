import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const LIVE = "https://data-room-coral.vercel.app";

describe("public demo host", () => {
  it("points sitewide links at the Vercel app, not GitHub Pages", () => {
    const readme = readFileSync(path.join(process.cwd(), "README.md"), "utf8");
    expect(readme).toContain(LIVE);
    expect(readme).not.toContain("emal-avala.github.io");
    expect(existsSync(path.join(process.cwd(), ".github/workflows/pages.yml"))).toBe(false);
    const retired = readFileSync(path.join(process.cwd(), "docs/deploy/github-pages.md"), "utf8");
    expect(retired).toContain("retired");
    expect(retired).toContain(LIVE);
    expect(retired).toContain("Do not re-enable");
  });
});
