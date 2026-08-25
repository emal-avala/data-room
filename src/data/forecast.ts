/**
 * Three-scenario forward look. History is actuals from `financials.ts`.
 * Nothing after Q2 2026 is recognized.
 */

export type ScenarioId = "conservative" | "base" | "optimistic";

export type ForecastPeriod = {
  period: string;
  label: string;
  kind: "actual" | "forecast";
  conservative: number;
  base: number;
  optimistic: number;
};

export const FORECAST: readonly ForecastPeriod[] = [
  { period: "2025-H1", label: "H1 2025", kind: "actual", conservative: 1_520_000, base: 1_520_000, optimistic: 1_520_000 },
  { period: "2025-H2", label: "H2 2025", kind: "actual", conservative: 2_660_000, base: 2_660_000, optimistic: 2_660_000 },
  { period: "2026-H1", label: "H1 2026", kind: "actual", conservative: 4_060_000, base: 4_060_000, optimistic: 4_060_000 },
  { period: "2026-H2", label: "H2 2026", kind: "forecast", conservative: 4_400_000, base: 5_600_000, optimistic: 7_200_000 },
  { period: "2027-H1", label: "H1 2027", kind: "forecast", conservative: 5_200_000, base: 7_400_000, optimistic: 10_000_000 },
  { period: "2027-H2", label: "H2 2027", kind: "forecast", conservative: 6_000_000, base: 9_200_000, optimistic: 13_200_000 },
];

export const SCENARIO_NOTES: Record<ScenarioId, string> = {
  conservative:
    "No new logos after the current legal-stage deals. One delayed go-live per half. Software-only mix stays high.",
  base:
    "Second delivery pod online in Q4 2026. Convert two of three pilots. Ports stay a 2027 motion.",
  optimistic:
    "Harborline playbook lands two more ports in H1 2027. Multi-yard dispatch unlocks Northstar's remaining network.",
};

export const SCENARIO_LABELS: Record<ScenarioId, string> = {
  conservative: "Conservative",
  base: "Base",
  optimistic: "Optimistic",
};
