import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { THEME_BOOTSTRAP_SCRIPT, THEME_STORAGE_KEY } from "@/lib/theme";

describe("light and dark theme", () => {
  it("bootstraps from one storage key before paint", () => {
    expect(THEME_STORAGE_KEY).toBe("data-room-theme");
    expect(THEME_BOOTSTRAP_SCRIPT).toContain(THEME_STORAGE_KEY);
    expect(THEME_BOOTSTRAP_SCRIPT).toContain("prefers-color-scheme");
    expect(THEME_BOOTSTRAP_SCRIPT).toContain("data-theme");
  });

  it("keeps the same accent and wires a toggle in public chrome", () => {
    const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toContain('[data-theme="dark"]');
    expect(css.match(/--primary:\s*#1d4ed8/g)?.length).toBeGreaterThanOrEqual(2);
    const layout = readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf8");
    expect(layout).toContain("THEME_BOOTSTRAP_SCRIPT");
    expect(layout).toContain("dangerouslySetInnerHTML");
    expect(layout).not.toMatch(/from ["']next\/script["']/);
    expect(readFileSync(path.join(process.cwd(), "src/components/ThemeProvider.tsx"), "utf8")).toContain(
      "localStorage.getItem(THEME_STORAGE_KEY)",
    );
    expect(readFileSync(path.join(process.cwd(), "src/components/Header.tsx"), "utf8")).toContain(
      "ThemeToggle",
    );
    expect(readFileSync(path.join(process.cwd(), "src/components/Footer.tsx"), "utf8")).toContain(
      "ThemeToggle",
    );
    const design = readFileSync(path.join(process.cwd(), "DESIGN.md"), "utf8");
    expect(design).not.toContain("Light only. No dark mode.");
    expect(design).toContain("data-room-theme");
  });
});
