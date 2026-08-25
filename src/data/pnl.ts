/**
 * Monthly P&L for the Acme example. Rolls up to `financials.ts` quarters.
 * Amounts are USD dollars. Gross profit / recognized = that month's margin.
 */

export type MonthlyPnL = {
  month: string;
  label: string;
  recognized: number;
  grossProfit: number;
  salesMarketing: number;
  customerSuccess: number;
  research: number;
  gAndA: number;
  netIncome: number;
};

export const MONTHLY_PNL: readonly MonthlyPnL[] = [
  { month: "2025-01", label: "Jan 2025", recognized: 200_000, grossProfit: 84_000, salesMarketing: 92_000, customerSuccess: 38_000, research: 72_000, gAndA: 32_000, netIncome: -150_000 },
  { month: "2025-02", label: "Feb 2025", recognized: 220_000, grossProfit: 96_800, salesMarketing: 90_000, customerSuccess: 40_000, research: 74_000, gAndA: 32_800, netIncome: -140_000 },
  { month: "2025-03", label: "Mar 2025", recognized: 260_000, grossProfit: 118_400, salesMarketing: 88_000, customerSuccess: 42_000, research: 76_000, gAndA: 32_400, netIncome: -120_000 },
  { month: "2025-04", label: "Apr 2025", recognized: 260_000, grossProfit: 117_000, salesMarketing: 86_000, customerSuccess: 44_000, research: 78_000, gAndA: 39_000, netIncome: -130_000 },
  { month: "2025-05", label: "May 2025", recognized: 280_000, grossProfit: 131_600, salesMarketing: 84_000, customerSuccess: 46_000, research: 80_000, gAndA: 41_600, netIncome: -120_000 },
  { month: "2025-06", label: "Jun 2025", recognized: 300_000, grossProfit: 146_200, salesMarketing: 82_000, customerSuccess: 48_000, research: 82_000, gAndA: 44_200, netIncome: -110_000 },
  { month: "2025-07", label: "Jul 2025", recognized: 340_000, grossProfit: 170_000, salesMarketing: 80_000, customerSuccess: 50_000, research: 80_000, gAndA: 40_000, netIncome: -80_000 },
  { month: "2025-08", label: "Aug 2025", recognized: 370_000, grossProfit: 185_000, salesMarketing: 78_000, customerSuccess: 52_000, research: 80_000, gAndA: 45_000, netIncome: -70_000 },
  { month: "2025-09", label: "Sep 2025", recognized: 410_000, grossProfit: 205_000, salesMarketing: 76_000, customerSuccess: 54_000, research: 82_000, gAndA: 53_000, netIncome: -60_000 },
  { month: "2025-10", label: "Oct 2025", recognized: 460_000, grossProfit: 243_800, salesMarketing: 78_000, customerSuccess: 56_000, research: 84_000, gAndA: 60_800, netIncome: -35_000 },
  { month: "2025-11", label: "Nov 2025", recognized: 510_000, grossProfit: 270_300, salesMarketing: 80_000, customerSuccess: 58_000, research: 86_000, gAndA: 74_300, netIncome: -28_000 },
  { month: "2025-12", label: "Dec 2025", recognized: 570_000, grossProfit: 302_100, salesMarketing: 82_000, customerSuccess: 60_000, research: 88_000, gAndA: 89_100, netIncome: -17_000 },
  { month: "2026-01", label: "Jan 2026", recognized: 560_000, grossProfit: 313_600, salesMarketing: 84_000, customerSuccess: 62_000, research: 90_000, gAndA: 85_600, netIncome: -8_000 },
  { month: "2026-02", label: "Feb 2026", recognized: 600_000, grossProfit: 336_000, salesMarketing: 86_000, customerSuccess: 64_000, research: 92_000, gAndA: 88_000, netIncome: 6_000 },
  { month: "2026-03", label: "Mar 2026", recognized: 660_000, grossProfit: 369_600, salesMarketing: 88_000, customerSuccess: 66_000, research: 94_000, gAndA: 99_600, netIncome: 22_000 },
  { month: "2026-04", label: "Apr 2026", recognized: 680_000, grossProfit: 380_800, salesMarketing: 90_000, customerSuccess: 68_000, research: 96_000, gAndA: 141_800, netIncome: -15_000 },
  { month: "2026-05", label: "May 2026", recognized: 750_000, grossProfit: 444_800, salesMarketing: 92_000, customerSuccess: 70_000, research: 98_000, gAndA: 142_800, netIncome: 42_000 },
  { month: "2026-06", label: "Jun 2026", recognized: 810_000, grossProfit: 518_400, salesMarketing: 94_000, customerSuccess: 72_000, research: 100_000, gAndA: 184_400, netIncome: 68_000 },
];

export const COST_CATEGORIES = [
  { key: "salesMarketing", label: "Sales & marketing" },
  { key: "customerSuccess", label: "Customer delivery" },
  { key: "research", label: "R&D" },
  { key: "gAndA", label: "G&A" },
] as const;

export function monthOpex(row: MonthlyPnL): number {
  return row.salesMarketing + row.customerSuccess + row.research + row.gAndA;
}

export function monthGrossMargin(row: MonthlyPnL): number {
  return row.recognized === 0 ? 0 : row.grossProfit / row.recognized;
}

export function rollupMonths(rows: readonly MonthlyPnL[]): {
  recognized: number;
  grossProfit: number;
  netIncome: number;
  salesMarketing: number;
  customerSuccess: number;
  research: number;
  gAndA: number;
} {
  return rows.reduce(
    (acc, row) => ({
      recognized: acc.recognized + row.recognized,
      grossProfit: acc.grossProfit + row.grossProfit,
      netIncome: acc.netIncome + row.netIncome,
      salesMarketing: acc.salesMarketing + row.salesMarketing,
      customerSuccess: acc.customerSuccess + row.customerSuccess,
      research: acc.research + row.research,
      gAndA: acc.gAndA + row.gAndA,
    }),
    {
      recognized: 0,
      grossProfit: 0,
      netIncome: 0,
      salesMarketing: 0,
      customerSuccess: 0,
      research: 0,
      gAndA: 0,
    },
  );
}

export const H1_2026_MONTHS = MONTHLY_PNL.filter((row) => row.month.startsWith("2026"));
export const FY_2025_MONTHS = MONTHLY_PNL.filter((row) => row.month.startsWith("2025"));
