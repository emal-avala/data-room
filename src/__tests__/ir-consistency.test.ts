import { describe, expect, it } from "vitest";
import { COMPANY } from "@/data/company";
import { ACCOUNTS } from "@/data/customers";
import {
  FY_2025_RECOGNIZED,
  H1_2026_RECOGNIZED,
  JUNE_2026,
  QUARTERS,
  TTM_RECOGNIZED,
} from "@/data/financials";
import { ANNUALIZED_RUN_RATE, LIVE_SITES, PAYING_CUSTOMERS } from "@/data/metrics";
import { FORECAST } from "@/data/forecast";
import { FY_2025_MONTHS, H1_2026_MONTHS, MONTHLY_PNL, monthOpex, rollupMonths } from "@/data/pnl";
import { PIPELINE, PIPELINE_UNWEIGHTED, PIPELINE_WEIGHTED } from "@/data/pipeline";

describe("Acme example ledger", () => {
  it("keeps the company identity fictional and self-named", () => {
    expect(COMPANY.name).toBe("Acme Corporation");
    expect(COMPANY.domain).toBe("acme.example");
  });

  it("sums the quarterly ledger without hand-typed totals", () => {
    expect(FY_2025_RECOGNIZED).toBe(680_000 + 840_000 + 1_120_000 + 1_540_000);
    expect(H1_2026_RECOGNIZED).toBe(1_820_000 + 2_240_000);
    expect(TTM_RECOGNIZED).toBe(1_120_000 + 1_540_000 + 1_820_000 + 2_240_000);
    expect(ANNUALIZED_RUN_RATE).toBe(JUNE_2026.recognized * 12);
    expect(QUARTERS).toHaveLength(6);
  });

  it("matches contracted accounts to the headline network counts", () => {
    expect(ACCOUNTS).toHaveLength(PAYING_CUSTOMERS);
    expect(ACCOUNTS.reduce((sum, account) => sum + account.sites, 0)).toBe(LIVE_SITES);
  });

  it("rolls monthly P&L up to the quarterly ledger", () => {
    for (const quarter of QUARTERS) {
      const [year, q] = quarter.quarter.split("-Q");
      const startMonth = (Number(q) - 1) * 3 + 1;
      const months = MONTHLY_PNL.filter((row) => {
        const [rowYear, rowMonth] = row.month.split("-");
        const monthNum = Number(rowMonth);
        return rowYear === year && monthNum >= startMonth && monthNum < startMonth + 3;
      });
      const rolled = rollupMonths(months);
      expect(rolled.recognized, quarter.quarter).toBe(quarter.recognized);
      expect(rolled.netIncome, quarter.quarter).toBe(quarter.netIncome);
      expect(Math.round((rolled.grossProfit / rolled.recognized) * 100) / 100, quarter.quarter).toBe(
        quarter.grossMargin,
      );
    }
    expect(rollupMonths(FY_2025_MONTHS).recognized).toBe(FY_2025_RECOGNIZED);
    expect(rollupMonths(H1_2026_MONTHS).recognized).toBe(H1_2026_RECOGNIZED);
  });

  it("keeps each month's P&L identity: GP − OpEx = NI", () => {
    for (const row of MONTHLY_PNL) {
      expect(row.grossProfit - monthOpex(row), row.month).toBe(row.netIncome);
    }
  });

  it("allocates H1 recognized across contracted accounts only", () => {
    const allocated = ACCOUNTS.reduce((sum, account) => sum + account.h1Recognized, 0);
    expect(allocated).toBe(H1_2026_RECOGNIZED);
    const topTwo = [...ACCOUNTS].sort((a, b) => b.h1Recognized - a.h1Recognized).slice(0, 2);
    expect(topTwo[0].h1Recognized + topTwo[1].h1Recognized).toBe(1_542_000);
  });

  it("does not invent forecast history", () => {
    const actuals = FORECAST.filter((row) => row.kind === "actual");
    expect(actuals).toHaveLength(3);
    expect(actuals[0].base).toBe(1_520_000);
    expect(actuals[1].base).toBe(2_660_000);
    expect(actuals[2].base).toBe(H1_2026_RECOGNIZED);
    for (const row of actuals) {
      expect(row.conservative).toBe(row.base);
      expect(row.optimistic).toBe(row.base);
    }
  });

  it("keeps pipeline out of the run-rate math", () => {
    expect(PIPELINE_UNWEIGHTED).toBe(PIPELINE.reduce((sum, deal) => sum + deal.unweighted, 0));
    expect(PIPELINE_WEIGHTED).toBe(
      PIPELINE.reduce((sum, deal) => sum + deal.unweighted * deal.weight, 0),
    );
    expect(PIPELINE_UNWEIGHTED).not.toBe(ANNUALIZED_RUN_RATE);
  });
});
