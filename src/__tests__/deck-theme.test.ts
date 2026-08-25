import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CANONICAL = resolve(process.cwd(), "content/documents/sample-pitch-deck.html");
const DEMO = resolve(process.cwd(), "demo/deck.html");

const CHAPTER_STARTS = [
  { target: "2", chapter: "The job" },
  { target: "3", chapter: "Why now" },
  { target: "4", chapter: "Product" },
  { target: "5", chapter: "Proof" },
  { target: "7", chapter: "Why we win" },
  { target: "9", chapter: "The round" },
] as const;

function slideSections(html: string): string[] {
  return [...html.matchAll(/<section\b[^>]*\bdata-slide\b[^>]*>/g)].map((match) => match[0]);
}

describe("Series A deck theme", () => {
  const canonical = readFileSync(CANONICAL, "utf8");
  const demo = readFileSync(DEMO, "utf8");

  it("keeps the Pages preview identical to the stamped artifact", () => {
    expect(demo).toBe(canonical);
  });

  it("is a ten-slide spine with the published chapter map", () => {
    const slides = slideSections(canonical);
    expect(slides).toHaveLength(10);
    expect(slides.map((slide) => /data-label="([^"]+)"/.exec(slide)?.[1])).toEqual([
      "Title",
      "The job",
      "Why now",
      "Product",
      "Traction",
      "Network",
      "Competition",
      "Founders",
      "The round",
      "Close",
    ]);
    expect(slides.map((slide) => /data-chapter="([^"]+)"/.exec(slide)?.[1])).toEqual([
      "Series A",
      "The job",
      "Why now",
      "Product",
      "Proof",
      "Proof",
      "Why we win",
      "Why we win",
      "The round",
      "The round",
    ]);
  });

  it("uses the site accent and does not carry the retired orange", () => {
    expect(canonical).toContain("var ACCENT='#1D4ED8'");
    expect(canonical).toContain("--accent:#1D4ED8");
    expect(canonical.toLowerCase()).not.toContain(["#ff", "5c00"].join(""));
    expect(canonical).toContain('source: \'data-room-deck\'');
  });

  it("keeps the cover story-map pointed at chapter starts", () => {
    for (const { target, chapter } of CHAPTER_STARTS) {
      expect(canonical).toContain(`data-story-target="${target}"`);
      expect(canonical).toMatch(new RegExp(`data-story-target="${target}"[\\s\\S]{0,280}${chapter}`));
    }
    expect([...canonical.matchAll(/data-story-target="/g)]).toHaveLength(6);
  });

  it("does not put a raise amount on the general slides", () => {
    const round = canonical.slice(canonical.indexOf('data-label="The round"'));
    expect(round).not.toMatch(/\$5\s*M|\$10\s*M|\$8\s*M/i);
    expect(canonical).toContain("use-of-funds");
  });
});
