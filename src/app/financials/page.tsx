import Link from "next/link";
import { COMPANY } from "@/data/company";
import { FY_2025_RECOGNIZED, H1_2026_RECOGNIZED, JUNE_2026, TTM_RECOGNIZED } from "@/data/financials";
import { FIRST_PROFITABLE_MONTH } from "@/data/financials";
import { SNAPSHOT } from "@/data/metrics";
import { PIPELINE_NOTE, PIPELINE_UNWEIGHTED } from "@/data/pipeline";
import { FinancialsNav } from "@/components/FinancialsNav";
import { RevenueChart } from "@/components/RevenueChart";
import { Section } from "@/components/Section";
import { usdCompact } from "@/lib/format-money";

const VIEWS = [
  {
    href: "/financials/pnl",
    title: "Historical P&L",
    description: "Monthly recognized revenue, functional costs, and the path to a first profitable month.",
    highlight: "Jan 2025 – Jun 2026",
  },
  {
    href: "/financials/forecast",
    title: "Forecast",
    description: "Three scenarios through 2027. History is actuals. Nothing after Q2 2026 is recognized.",
    highlight: "Conservative · Base · Optimistic",
  },
  {
    href: "/financials/pipeline",
    title: "Sales pipeline",
    description: "Qualified deals with weights. Contingent. Not in the run-rate.",
    highlight: `${usdCompact(PIPELINE_UNWEIGHTED)} unweighted`,
  },
  {
    href: "/financials/revenue-by-customer",
    title: "Revenue by customer",
    description: "H1 2026 recognized by contracted account. Concentration is a named risk.",
    highlight: `${usdCompact(H1_2026_RECOGNIZED)} H1`,
  },
] as const;

export default function FinancialsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Section eyebrow="Financials" title="The books">
        <FinancialsNav current="/financials" />
        <p className="max-w-2xl text-muted-foreground">
          Recognized revenue, GAAP, as of {COMPANY.dataAsOf}. Interactive views for diligence. Pipeline is listed
          separately and is not in the run-rate.
        </p>
        <div className="mt-8 border-l-2 border-foreground pl-5">
          <p className="max-w-3xl text-sm text-muted-foreground">
            <span className="text-foreground">Acme sells a yard operating system.</span> Vehicles are optional and
            are not on the balance sheet. Gross margin is software-weighted. {Math.round(JUNE_2026.grossMargin * 100)}%
            in {JUNE_2026.label}; the eighteen-month plan holds that mix. {PIPELINE_NOTE}
          </p>
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">FY 2025 recognized</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(FY_2025_RECOGNIZED)}</dd>
          </div>
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">H1 2026 recognized</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(H1_2026_RECOGNIZED)}</dd>
          </div>
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">TTM recognized</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(TTM_RECOGNIZED)}</dd>
          </div>
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">First profitable month</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(FIRST_PROFITABLE_MONTH.netIncome)}</dd>
            <p className="mt-2 text-xs text-muted-foreground">{FIRST_PROFITABLE_MONTH.label}</p>
          </div>
        </dl>
      </Section>

      <Section eyebrow="Views" title="Diligence surfaces">
        <div className="grid gap-4 md:grid-cols-2">
          {VIEWS.map((view) => (
            <Link key={view.href} href={view.href} className="container-box p-6">
              <p className="text-eyebrow">{view.highlight}</p>
              <h3 className="mt-2 font-semibold">{view.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{view.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="History" title="Quarterly recognized">
        <RevenueChart />
        <p className="mt-4 text-xs text-muted-foreground">
          Latest quarter {usdCompact(SNAPSHOT.latestQuarter)} at {Math.round(SNAPSHOT.latestQuarterMargin * 100)}%
          gross margin. {JUNE_2026.label} {usdCompact(JUNE_2026.recognized)} at{" "}
          {Math.round(JUNE_2026.grossMargin * 100)}%.
        </p>
      </Section>
    </div>
  );
}
