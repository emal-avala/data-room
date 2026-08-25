import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";

/**
 * Public forks should not ship another company's customers or brand color.
 * Needles are assembled so this file does not match itself.
 */
const BANNED = [
  ["ava", "la.ai"].join(""),
  ["em", "al@"].join(""),
  ["lucid", " motors"].join(""),
  ["serve", " robotics"].join(""),
  ["zero", "matter"].join(""),
  ["bur", "ro.ai"].join(""),
  ["#ff", "5c00"].join(""),
];

const ROOTS = ["src", "content", "supabase", "scripts"];

describe("sanitization", () => {
  it("does not contain upstream proprietary markers", () => {
    const hits: string[] = [];
    for (const needle of BANNED) {
      try {
        const output = execSync(
          `rg -i -n --glob '!node_modules/**' --glob '!.next/**' --glob '!**/sanitization.test.ts' ${JSON.stringify(needle)} ${ROOTS.join(" ")}`,
          { encoding: "utf8" },
        );
        if (output.trim()) hits.push(`${needle}\n${output}`);
      } catch (error) {
        const result = error as { status?: number; stdout?: string };
        if (result.status !== 1 && result.stdout) hits.push(`${needle}\n${result.stdout}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
