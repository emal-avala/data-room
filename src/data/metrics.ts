import { COMPANY } from "./company";
import {
  FIRST_PROFITABLE_MONTH,
  FY_2025_RECOGNIZED,
  H1_2026_RECOGNIZED,
  JUNE_2026,
  LATEST_QUARTER,
  QUARTERS,
  TTM_RECOGNIZED,
} from "./financials";
import { usdCompact } from "@/lib/format-money";

const q2_2025 = QUARTERS.find((row) => row.quarter === "2025-Q2");
if (!q2_2025) throw new Error("Q2 2025 missing from the ledger");

export const DATA_AS_OF = COMPANY.dataAsOf;

export const HEADCOUNT = 41;
export const PAYING_CUSTOMERS = 14;
export const LIVE_SITES = 31;
export const TRACTORS_SOFTWARE = 186;

export const ANNUALIZED_RUN_RATE = JUNE_2026.recognized * 12;
export const Q2_YOY = ((LATEST_QUARTER.recognized - q2_2025.recognized) / q2_2025.recognized) * 100;

export const HERO_METRICS = [
  {
    value: usdCompact(ANNUALIZED_RUN_RATE),
    label: "Annualized run-rate",
    detail: `${JUNE_2026.label} recognized × 12 · preliminary`,
  },
  {
    value: usdCompact(TTM_RECOGNIZED),
    label: "TTM recognized",
    detail: `${QUARTERS.slice(-4)[0].label} – ${LATEST_QUARTER.label} · GAAP`,
  },
  {
    value: `${PAYING_CUSTOMERS}`,
    label: "Paying customers",
    detail: `${LIVE_SITES} live yards · ${TRACTORS_SOFTWARE} vehicles on software`,
  },
  {
    value: usdCompact(FIRST_PROFITABLE_MONTH.netIncome),
    label: `Net income — ${FIRST_PROFITABLE_MONTH.label}`,
    detail: "First net-income-positive month",
  },
] as const;

export const SNAPSHOT = {
  fy2025: FY_2025_RECOGNIZED,
  h12026: H1_2026_RECOGNIZED,
  ttm: TTM_RECOGNIZED,
  latestQuarter: LATEST_QUARTER.recognized,
  latestQuarterMargin: LATEST_QUARTER.grossMargin,
  juneMargin: JUNE_2026.grossMargin,
  headcount: HEADCOUNT,
  payingCustomers: PAYING_CUSTOMERS,
  liveSites: LIVE_SITES,
} as const;
