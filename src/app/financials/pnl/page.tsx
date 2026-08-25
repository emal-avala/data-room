import { COMPANY } from "@/data/company";
import { QUARTERS } from "@/data/financials";
import { COST_CATEGORIES, FY_2025_MONTHS, H1_2026_MONTHS, MONTHLY_PNL, monthGrossMargin, monthOpex, rollupMonths } from "@/data/pnl";
import { FinancialsNav } from "@/components/FinancialsNav";
import { Section } from "@/components/Section";
import { usdCompact, usdExact } from "@/lib/format-money";

const fy = rollupMonths(FY_2025_MONTHS);
const h1 = rollupMonths(H1_2026_MONTHS);

export default function PnLPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Section eyebrow="Financials" title="Historical P&L">
        <FinancialsNav current="/financials/pnl" />
        <p className="max-w-2xl text-muted-foreground">
          Monthly recognized revenue and functional costs, {COMPANY.dataAsOf}. Quarters in the ledger are the sum of
          these months. {COST_CATEGORIES.map((c) => c.label).join(", ")}.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">FY 2025 recognized</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(fy.recognized)}</dd>
          </div>
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">FY 2025 net income</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(fy.netIncome)}</dd>
          </div>
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">H1 2026 recognized</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(h1.recognized)}</dd>
          </div>
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">H1 2026 net income</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(h1.netIncome)}</dd>
          </div>
        </dl>
      </Section>

      <Section eyebrow="Quarterly" title="Same ledger, with cost mix">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr>
                <th className="text-left">Period</th>
                <th>Recognized</th>
                <th>Gross margin</th>
                <th>Net income</th>
              </tr>
            </thead>
            <tbody>
              {QUARTERS.map((row) => (
                <tr key={row.quarter}>
                  <td>{row.label}</td>
                  <td>{usdExact(row.recognized)}</td>
                  <td>{Math.round(row.grossMargin * 100)}%</td>
                  <td>{usdExact(row.netIncome)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Monthly" title="Close by close">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr>
                <th className="text-left">Month</th>
                <th>Recognized</th>
                <th>GM</th>
                <th>S&amp;M</th>
                <th>Delivery</th>
                <th>R&amp;D</th>
                <th>G&amp;A</th>
                <th>OpEx</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {MONTHLY_PNL.map((row) => (
                <tr key={row.month}>
                  <td>{row.label}</td>
                  <td>{usdExact(row.recognized)}</td>
                  <td>{Math.round(monthGrossMargin(row) * 100)}%</td>
                  <td>{usdExact(row.salesMarketing)}</td>
                  <td>{usdExact(row.customerSuccess)}</td>
                  <td>{usdExact(row.research)}</td>
                  <td>{usdExact(row.gAndA)}</td>
                  <td>{usdExact(monthOpex(row))}</td>
                  <td>{usdExact(row.netIncome)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          June 2026 is preliminary. May 2026 is the first month with positive net income. G&amp;A steps up in April
          2026 with insurance renewals and the Dallas field lease — that is a calendar item, not a run-rate claim.
        </p>
      </Section>
    </div>
  );
}
