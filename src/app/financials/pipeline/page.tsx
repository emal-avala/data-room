import { PIPELINE, PIPELINE_NOTE, PIPELINE_UNWEIGHTED, PIPELINE_WEIGHTED } from "@/data/pipeline";
import { FinancialsNav } from "@/components/FinancialsNav";
import { Section } from "@/components/Section";
import { usdCompact, usdExact } from "@/lib/format-money";

const stages = ["pilot", "commercial", "legal"] as const;

export default function PipelinePage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Section eyebrow="Financials" title="Qualified pipeline">
        <FinancialsNav current="/financials/pipeline" />
        <p className="max-w-2xl text-muted-foreground">{PIPELINE_NOTE}</p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">Unweighted</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(PIPELINE_UNWEIGHTED)}</dd>
          </div>
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">Weighted</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(PIPELINE_WEIGHTED)}</dd>
          </div>
        </dl>
      </Section>

      <Section eyebrow="By stage" title="Where the deals sit">
        <div className="grid gap-4 md:grid-cols-3">
          {stages.map((stage) => {
            const deals = PIPELINE.filter((deal) => deal.stage === stage);
            const unweighted = deals.reduce((sum, deal) => sum + deal.unweighted, 0);
            return (
              <div key={stage} className="container-box p-6">
                <p className="text-eyebrow capitalize">{stage}</p>
                <p className="mt-2 text-2xl font-semibold">{usdCompact(unweighted)}</p>
                <p className="mt-2 text-xs text-muted-foreground">{deals.length} deals</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Deals" title="Management-qualified">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr>
                <th className="text-left">Account</th>
                <th>Stage</th>
                <th>Unweighted</th>
                <th>Weight</th>
                <th>Weighted</th>
              </tr>
            </thead>
            <tbody>
              {PIPELINE.map((deal) => (
                <tr key={deal.account}>
                  <td>{deal.account}</td>
                  <td className="capitalize">{deal.stage}</td>
                  <td>{usdExact(deal.unweighted)}</td>
                  <td>{Math.round(deal.weight * 100)}%</td>
                  <td>{usdExact(deal.unweighted * deal.weight)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
