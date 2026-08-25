import { describe, expect, it } from "vitest";
import {
  BUILTIN_DATAROOM_VARIANTS,
  CORE_DOCUMENTS,
  DEFAULT_DATAROOM_VARIANT_SLUG,
  DEFAULT_USE_OF_FUNDS,
  FULL_DATAROOM_VARIANT_SLUG,
  FULL_ONLY_DOCUMENTS,
  canAccessDataRoomDocument,
  formatVariantRaiseAmount,
  parseUseOfFunds,
} from "@/lib/dataroom-variants";
import { SELECTABLE_DOCUMENT_SLUGS } from "@/lib/documents";

describe("builtin rooms", () => {
  it("pins the sample document counts", () => {
    expect(BUILTIN_DATAROOM_VARIANTS[DEFAULT_DATAROOM_VARIANT_SLUG].documents.size).toBe(
      CORE_DOCUMENTS.length,
    );
    expect(BUILTIN_DATAROOM_VARIANTS[FULL_DATAROOM_VARIANT_SLUG].documents.size).toBe(
      CORE_DOCUMENTS.length + FULL_ONLY_DOCUMENTS.length,
    );
  });

  it("only lists slugs that exist in the registry", () => {
    for (const slug of [...CORE_DOCUMENTS, ...FULL_ONLY_DOCUMENTS]) {
      expect(SELECTABLE_DOCUMENT_SLUGS.has(slug)).toBe(true);
    }
  });
});

describe("parseUseOfFunds", () => {
  it("accepts the default allocation", () => {
    expect(parseUseOfFunds(DEFAULT_USE_OF_FUNDS)).not.toBeNull();
  });

  it("rejects a plan that does not sum to 100", () => {
    const broken = DEFAULT_USE_OF_FUNDS.map((row, index) =>
      index === 0 ? { ...row, percentage: row.percentage + 1 } : row,
    );
    expect(parseUseOfFunds(broken)).toBeNull();
  });
});

describe("canAccessDataRoomDocument", () => {
  const core = {
    variant: BUILTIN_DATAROOM_VARIANTS[DEFAULT_DATAROOM_VARIANT_SLUG],
    fundId: null,
    staffBypass: false,
    source: "builtin" as const,
  };

  it("allows core slugs and denies full-only slugs", () => {
    expect(canAccessDataRoomDocument(core, "pitch-deck")).toBe(true);
    expect(canAccessDataRoomDocument(core, "cap-table")).toBe(false);
  });

  it("staff bypass sees every slug", () => {
    expect(canAccessDataRoomDocument({ ...core, staffBypass: true }, "cap-table")).toBe(true);
  });
});

describe("formatVariantRaiseAmount", () => {
  it("renders sample plan sizes", () => {
    expect(formatVariantRaiseAmount(500_000_000)).toBe("$5M");
    expect(formatVariantRaiseAmount(1_000_000_000)).toBe("$10M");
  });
});
