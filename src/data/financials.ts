/**
 * Acme quarterly ledger (recognized revenue, USD).
 * As-of: June 2026 preliminary close. Q2 2026 includes that month.
 */

export type QuarterRow = {
  quarter: string;
  label: string;
  recognized: number;
  grossMargin: number;
  netIncome: number;
  /** QoQ on recognized. Null when the prior quarter is a different basis or missing. */
  qoqPct: number | null;
};

export const QUARTERS: readonly QuarterRow[] = [
  { quarter: "2025-Q1", label: "Q1 2025", recognized: 680_000, grossMargin: 0.44, netIncome: -410_000, qoqPct: null },
  { quarter: "2025-Q2", label: "Q2 2025", recognized: 840_000, grossMargin: 0.47, netIncome: -360_000, qoqPct: 23.5 },
  { quarter: "2025-Q3", label: "Q3 2025", recognized: 1_120_000, grossMargin: 0.5, netIncome: -210_000, qoqPct: 33.3 },
  { quarter: "2025-Q4", label: "Q4 2025", recognized: 1_540_000, grossMargin: 0.53, netIncome: -80_000, qoqPct: 37.5 },
  { quarter: "2026-Q1", label: "Q1 2026", recognized: 1_820_000, grossMargin: 0.56, netIncome: 20_000, qoqPct: 18.2 },
  { quarter: "2026-Q2", label: "Q2 2026", recognized: 2_240_000, grossMargin: 0.6, netIncome: 95_000, qoqPct: 23.1 },
];

export const FY_2025_RECOGNIZED = QUARTERS.filter((row) => row.quarter.startsWith("2025")).reduce(
  (sum, row) => sum + row.recognized,
  0,
);

export const H1_2026_RECOGNIZED = QUARTERS.filter((row) => row.quarter === "2026-Q1" || row.quarter === "2026-Q2").reduce(
  (sum, row) => sum + row.recognized,
  0,
);

export const TTM_RECOGNIZED = QUARTERS.slice(-4).reduce((sum, row) => sum + row.recognized, 0);

export const LATEST_QUARTER = QUARTERS[QUARTERS.length - 1];

export const JUNE_2026 = {
  month: "2026-06",
  label: "June 2026",
  recognized: 810_000,
  grossMargin: 0.64,
  netIncome: 68_000,
} as const;

export const FIRST_PROFITABLE_MONTH = {
  month: "2026-05",
  label: "May 2026",
  netIncome: 42_000,
} as const;
