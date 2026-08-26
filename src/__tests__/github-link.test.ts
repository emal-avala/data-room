import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { siteConfig } from "@/config/site";

describe("public GitHub link", () => {
  it("defaults to the template repository", () => {
    expect(siteConfig.repoUrl).toBe("https://github.com/emal-avala/data-room");
  });

  it("is wired into public chrome and admin", () => {
    const files = [
      "src/components/Header.tsx",
      "src/components/Footer.tsx",
      "src/app/admin/layout.tsx",
      "src/components/GitHubLink.tsx",
    ];
    for (const file of files) {
      const source = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source, file).toContain("GitHubLink");
    }
    const link = readFileSync(path.join(process.cwd(), "src/components/GitHubLink.tsx"), "utf8");
    expect(link).toContain("siteConfig.repoUrl");
    expect(link).toContain("GitHub repository");
  });

  it("mirrors the same repo on the static demo", () => {
    const index = readFileSync(path.join(process.cwd(), "demo/index.html"), "utf8");
    expect(index).toContain("https://github.com/emal-avala/data-room");
    expect(index).toContain('aria-label="GitHub repository"');
    expect(readFileSync(path.join(process.cwd(), "demo/login.html"), "utf8")).toContain(
      "https://github.com/emal-avala/data-room",
    );
  });
});
