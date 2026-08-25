import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("admin auth contract", () => {
  const shared = readFileSync(
    path.join(process.cwd(), "src/app/api/admin/_shared.ts"),
    "utf8",
  );

  it("requires a verified session before handing out the service-role client", () => {
    expect(shared).toContain("email_confirmed_at");
    expect(shared).toContain("isApprovedAdmin");
    expect(shared).toContain("createAdminClient");
  });

  it("bypasses only on localhost outside production", () => {
    expect(shared).toContain('process.env.NODE_ENV === "production"');
    expect(shared).toContain("localhost");
  });
});
