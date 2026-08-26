import { afterEach, describe, expect, it } from "vitest";
import { getDocumentNdaAccess } from "@/lib/nda-evidence";
import { getDocumentBySlug } from "@/lib/documents";

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

afterEach(() => {
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  if (originalKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
});

describe("getDocumentNdaAccess", () => {
  it("does not invent an NDA wall when there is no auth backend", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const capTable = getDocumentBySlug("cap-table");
    const ip = getDocumentBySlug("intellectual-property");
    const deck = getDocumentBySlug("pitch-deck");
    expect(capTable).toBeDefined();
    expect(ip).toBeDefined();
    expect(deck).toBeDefined();
    expect(await getDocumentNdaAccess(capTable!)).toBe("not_required");
    expect(await getDocumentNdaAccess(ip!)).toBe("not_required");
    expect(await getDocumentNdaAccess(deck!)).toBe("not_required");
  });
});
