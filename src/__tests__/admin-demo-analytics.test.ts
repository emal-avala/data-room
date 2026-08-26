import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PUBLIC_DEMO_VIEWER_EMAIL } from "@/lib/dataroom-variants";
import { isInternalViewer } from "@/lib/document-audience";
import {
  DEMO_ACCESS_REQUESTS,
  DEMO_ADMIN_EMAIL,
  DEMO_DOCUMENTS,
  DEMO_EVENTS,
  DEMO_FUNDS,
  DEMO_PAGES,
  DEMO_SESSIONS,
  DEMO_VIEWERS,
  WELL_KNOWN_DEMO_FUND_NAMES,
  getDemoAnalyticsSummary,
  getDemoPipeline,
  getDemoTimeseries,
  getDemoViewer,
  isDemoAnalyticsEmail,
} from "@/lib/analytics/demo-data";

describe("admin demo analytics dataset", () => {
  it("includes well-known funds across the raise pipeline", () => {
    const names = DEMO_FUNDS.map((fund) => fund.name);
    for (const name of WELL_KNOWN_DEMO_FUND_NAMES) {
      expect(names).toContain(name);
    }
    const stages = new Set(DEMO_FUNDS.map((fund) => fund.stage));
    expect(stages.has("lead")).toBe(true);
    expect(stages.has("intro")).toBe(true);
    expect(stages.has("diligence")).toBe(true);
    expect(stages.has("term_sheet")).toBe(true);
    expect(stages.has("passed")).toBe(true);
  });

  it("uses fictional .example emails that are not staff", () => {
    expect(DEMO_ADMIN_EMAIL).toBe(PUBLIC_DEMO_VIEWER_EMAIL);
    expect(isInternalViewer(DEMO_ADMIN_EMAIL)).toBe(false);
    const emails = [
      ...DEMO_VIEWERS.map((row) => row.email),
      ...DEMO_ACCESS_REQUESTS.map((row) => row.email),
      ...DEMO_EVENTS.map((row) => row.email),
    ];
    expect(emails.length).toBeGreaterThan(10);
    for (const email of emails) {
      expect(isDemoAnalyticsEmail(email)).toBe(true);
      expect(isInternalViewer(email)).toBe(false);
      expect(email).not.toMatch(/@acme\.example$/i);
    }
  });

  it("keeps overview totals consistent with the rows", () => {
    const summary = getDemoAnalyticsSummary();
    expect(summary.unique_viewers).toBe(DEMO_VIEWERS.length);
    expect(summary.documents_viewed).toBe(DEMO_DOCUMENTS.length);
    expect(summary.total_views).toBe(DEMO_DOCUMENTS.reduce((sum, row) => sum + row.views, 0));
    expect(summary.active_sessions).toBe(DEMO_SESSIONS.filter((row) => row.ended_at === null).length);
    expect(summary.active_sessions).toBeGreaterThan(0);
    expect(getDemoTimeseries().length).toBe(30);
    expect(getDemoPipeline().stages.reduce((sum, row) => sum + row.count, 0)).toBe(DEMO_FUNDS.length);
    expect(DEMO_PAGES.length).toBeGreaterThan(5);
    expect(getDemoViewer("viewer-maya")?.firm).toBe("Sequoia Capital");
  });
});

describe("unconfigured admin contract", () => {
  const shared = readFileSync(path.join(process.cwd(), "src/app/api/admin/_shared.ts"), "utf8");
  const layout = readFileSync(path.join(process.cwd(), "src/app/admin/layout.tsx"), "utf8");

  it("serves the sample dataset instead of 503 when Supabase is missing", () => {
    expect(shared).not.toContain("Database not configured");
    expect(shared).toContain("demo: true");
    expect(shared).toContain("DEMO_ADMIN_EMAIL");
    expect(shared).toContain("email_confirmed_at");
    expect(shared).toContain("isApprovedAdmin");
  });

  it("opens /admin on the public deploy without a session", () => {
    expect(layout).toContain("isAdminBackendConfigured");
    expect(layout).toContain("sample");
  });
});

describe("static admin walkthrough", () => {
  const html = readFileSync(path.join(process.cwd(), "demo/admin.html"), "utf8");

  it("mirrors the well-known fund table", () => {
    expect(html).toContain("Sample IR analytics");
    for (const name of WELL_KNOWN_DEMO_FUND_NAMES) {
      expect(html).toContain(name);
    }
    expect(html).toContain("maya@sequoia.example");
    expect(html).not.toContain("@acme.example");
  });
});
