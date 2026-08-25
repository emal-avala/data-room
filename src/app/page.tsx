import Link from "next/link";
import { siteConfig } from "@/config/site";
import { COMPANY } from "@/data/company";
import { CONTRACTED } from "@/data/customers";
import { HERO_METRICS, LIVE_SITES, PAYING_CUSTOMERS } from "@/data/metrics";
import { LATEST_QUARTER, TTM_RECOGNIZED } from "@/data/financials";
import { PIPELINE_NOTE, PIPELINE_UNWEIGHTED, PIPELINE_WEIGHTED } from "@/data/pipeline";
import { Section } from "@/components/Section";
import { RevenueChart } from "@/components/RevenueChart";
import { usdCompact } from "@/lib/format-money";

const WHY_NOW = [
  {
    title: "The yard is still analog",
    detail:
      "Inside the building, a WMS knows every tote. Outside, a lead spotter works from a radio and a whiteboard. Trailer dwell is the hidden tax on every outbound wave.",
  },
  {
    title: "The geometry repeats",
    detail:
      "A yard is painted lines, the same fifty trailers, and a night shift that turns over. That is a closed world. Learned autonomy holds here long before it holds on a public street.",
  },
  {
    title: "Software can attach to the fleet they already own",
    detail:
      "Most buyers will not replace a working spotter truck. Acme sells the operating system first. The electric tractor is optional and is not on our balance sheet.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-4 py-24">
          <p className="text-eyebrow">{siteConfig.roundLabel}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-light tracking-tight md:text-6xl">{COMPANY.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{COMPANY.oneLiner}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Open the data room
            </Link>
            <Link
              href="/docs/pitch-deck"
              className="inline-flex h-11 items-center rounded-md border border-border px-6 text-sm"
            >
              View the deck
            </Link>
          </div>
        </div>
      </section>

      <dl className="mx-auto grid max-w-5xl gap-px border-b border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {HERO_METRICS.map((metric) => (
          <div key={metric.label} className="bg-background px-4 py-8">
            <dt className="text-sm text-muted-foreground">{metric.label}</dt>
            <dd className="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</dd>
            <p className="mt-2 text-xs text-muted-foreground">{metric.detail}</p>
          </div>
        ))}
      </dl>

      <div className="mx-auto max-w-5xl px-4">
        <Section eyebrow="Why now" title="The bottleneck moved outside the building">
          <div className="grid gap-4 md:grid-cols-3">
            {WHY_NOW.map((item) => (
              <div key={item.title} className="container-box p-6">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Traction" title="Recognized revenue">
          <p className="mb-6 text-sm text-muted-foreground">
            Trailing twelve months {usdCompact(TTM_RECOGNIZED)}. {LATEST_QUARTER.label}{" "}
            {usdCompact(LATEST_QUARTER.recognized)} recognized, {Math.round(LATEST_QUARTER.grossMargin * 100)}%
            gross margin. Pipeline ({usdCompact(PIPELINE_UNWEIGHTED)} unweighted /{" "}
            {usdCompact(PIPELINE_WEIGHTED)} weighted) is not in this chart. {PIPELINE_NOTE}
          </p>
          <RevenueChart />
        </Section>

        <Section eyebrow="Network" title={`${PAYING_CUSTOMERS} contracted customers · ${LIVE_SITES} live yards`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr>
                  <th className="text-left">Account</th>
                  <th>Segment</th>
                  <th>Sites</th>
                  <th>Since</th>
                </tr>
              </thead>
              <tbody>
                {CONTRACTED.map((account) => (
                  <tr key={account.name}>
                    <td className="font-medium">{account.name}</td>
                    <td>{account.segment}</td>
                    <td>{account.sites}</td>
                    <td>{account.since}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Names are the worked example. A public fork should replace this table before inviting a real fund.
          </p>
        </Section>

        <Section eyebrow="Diligence" title="Start here">
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/docs/pitch-deck" className="container-box p-6">
              <p className="text-eyebrow">Overview</p>
              <h3 className="mt-2 font-semibold">Series A deck</h3>
              <p className="mt-2 text-sm text-muted-foreground">The story in ten slides.</p>
            </Link>
            <Link href="/docs/investment-memo" className="container-box p-6">
              <p className="text-eyebrow">Overview</p>
              <h3 className="mt-2 font-semibold">Investment memo</h3>
              <p className="mt-2 text-sm text-muted-foreground">Thesis, buyer, ledger, risks.</p>
            </Link>
            <Link href="/financials" className="container-box p-6">
              <p className="text-eyebrow">Financials</p>
              <h3 className="mt-2 font-semibold">Books</h3>
              <p className="mt-2 text-sm text-muted-foreground">P&amp;L, forecast, pipeline, and revenue by customer.</p>
            </Link>
            <Link href="/docs/use-of-funds" className="container-box p-6">
              <p className="text-eyebrow">Full room</p>
              <h3 className="mt-2 font-semibold">Use of funds</h3>
              <p className="mt-2 text-sm text-muted-foreground">The plan size lives here, not on the homepage.</p>
            </Link>
          </div>
        </Section>
      </div>
    </>
  );
}
