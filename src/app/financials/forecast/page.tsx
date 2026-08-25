import { FORECAST, SCENARIO_LABELS, SCENARIO_NOTES } from "@/data/forecast";
import { FinancialsNav } from "@/components/FinancialsNav";
import { Section } from "@/components/Section";
import { usdCompact, usdExact } from "@/lib/format-money";

const FY_2026 = {
  conservative: 4_060_000 + 4_400_000,
  base: 4_060_000 + 5_600_000,
  optimistic: 4_060_000 + 7_200_000,
} as const;

const FY_2027 = {
  conservative: 5_200_000 + 6_000_000,
  base: 7_400_000 + 9_200_000,
  optimistic: 10_000_000 + 13_200_000,
} as const;

export default function ForecastPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Section eyebrow="Financials" title="Three-scenario forecast">
        <FinancialsNav current="/financials/forecast" />
        <p className="max-w-2xl text-muted-foreground">
          H1 2025 through H1 2026 are actuals. Everything after Q2 2026 is a plan, not a close. The base case funds
          a second delivery pod. The optimistic case needs ports to convert.
        </p>
        <dl className="mt-8 grid gap-4 md:grid-cols-3">
          {(["conservative", "base", "optimistic"] as const).map((id) => (
            <div key={id} className="container-box p-6">
              <dt className="text-eyebrow">{SCENARIO_LABELS[id]}</dt>
              <dd className="mt-2 text-2xl font-semibold">{usdCompact(FY_2026[id])}</dd>
              <p className="mt-1 text-xs text-muted-foreground">FY 2026 · {usdCompact(FY_2027[id])} FY 2027</p>
              <p className="mt-4 text-sm text-muted-foreground">{SCENARIO_NOTES[id]}</p>
            </div>
          ))}
        </dl>
      </Section>

      <Section eyebrow="Build" title="Half-year recognized">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr>
                <th className="text-left">Period</th>
                <th>Kind</th>
                <th>Conservative</th>
                <th>Base</th>
                <th>Optimistic</th>
              </tr>
            </thead>
            <tbody>
              {FORECAST.map((row) => (
                <tr key={row.period}>
                  <td>{row.label}</td>
                  <td className="capitalize">{row.kind}</td>
                  <td>{usdExact(row.conservative)}</td>
                  <td>{usdExact(row.base)}</td>
                  <td>{usdExact(row.optimistic)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Do not annualize H2 2026 and call it 2027. The forecast is the only page that looks past the close.
        </p>
      </Section>
    </div>
  );
}
