import { ArticlePage } from "@/components/ArticlePage";
import { CompetitiveMatrix } from "@/components/CompetitiveMatrix";
import { COMPANY, FOUNDER, RISKS } from "@/data/company";
import { ACCOUNTS } from "@/data/customers";
import {
  FIRST_PROFITABLE_MONTH,
  FY_2025_RECOGNIZED,
  H1_2026_RECOGNIZED,
  JUNE_2026,
  QUARTERS,
  TTM_RECOGNIZED,
} from "@/data/financials";
import { ANNUALIZED_RUN_RATE, HEADCOUNT, LIVE_SITES, PAYING_CUSTOMERS, Q2_YOY } from "@/data/metrics";
import { PIPELINE_NOTE, PIPELINE_UNWEIGHTED, PIPELINE_WEIGHTED } from "@/data/pipeline";
import { formatVariantRaiseAmount, type UseOfFundsAllocation } from "@/lib/dataroom-variants";
import { signedPct, usdCompact, usdExact } from "@/lib/format-money";

export function MemoBody() {
  return (
    <ArticlePage
      eyebrow="Overview"
      title="Investment memo"
      subtitle={`${COMPANY.name} · ${COMPANY.roundLabel} · as of ${COMPANY.dataAsOf}`}
      date="2026-06-30"
    >
      <p>
        {COMPANY.name} sells a yard operating system and, when a site is ready, driver-out moves on electric
        tractors that we do not manufacture. The buyer is the VP of transportation and the DC general manager. The
        job is docks-per-hour on the night shift.
      </p>
      <h2>Problem</h2>
      <p>
        Inside the building a WMS knows every tote. Outside, a lead spotter works a radio and a whiteboard. Trailers
        wait. Outbound waves slip. The night shift turns over. The analog yard is now the constraint on an otherwise
        automated DC.
      </p>
      <h2>Product</h2>
      <p>{COMPANY.wedge}</p>
      <p>
        Three pieces ship today: a live yard graph, dispatch that assigns a tractor to a door that will actually be
        free, and on-vehicle perception for gate-to-dock moves that stay inside the fence. Public-road hops stay
        human. Snow, standing water, and unmarked construction still fall back to a driver.
      </p>
      <h2>Traction</h2>
      <p>
        {PAYING_CUSTOMERS} paying customers, {LIVE_SITES} live yards, {HEADCOUNT} people. FY 2025 recognized{" "}
        {usdCompact(FY_2025_RECOGNIZED)}. H1 2026 {usdCompact(H1_2026_RECOGNIZED)}. TTM {usdCompact(TTM_RECOGNIZED)}.
        June 2026 annualized run-rate {usdCompact(ANNUALIZED_RUN_RATE)}. First profitable month{" "}
        {FIRST_PROFITABLE_MONTH.label} at {usdCompact(FIRST_PROFITABLE_MONTH.netIncome)} net income. Q2 recognized
        grew {signedPct(Q2_YOY)} year over year.
      </p>
      <p>
        The two largest accounts were 38% of H1 2026 recognized. That is disclosed on the company page and funded
        as a second delivery pod in the use-of-funds memo. Pipeline is {usdCompact(PIPELINE_UNWEIGHTED)} unweighted /{" "}
        {usdCompact(PIPELINE_WEIGHTED)} weighted. {PIPELINE_NOTE}
      </p>
      <h2>Unit</h2>
      <p>
        A site license is annual, recognized ratably, plus optional tractor hours billed by the manufacturing
        partner. We do not take vehicle inventory and we do not quote a vehicle gross margin as if it were ours.
        June gross margin was {Math.round(JUNE_2026.grossMargin * 100)}% because the mix is software.
      </p>
      <h2>Why {FOUNDER.name}</h2>
      <p>{FOUNDER.origin}</p>
      <h2>Risks</h2>
      <ul>
        {RISKS.map((risk) => (
          <li key={risk.title}>
            <strong>{risk.title}.</strong> {risk.body}
          </li>
        ))}
      </ul>
      <h2>The round</h2>
      <p>
        General surfaces say {COMPANY.roundLabel} and stop. The use-of-funds memo is the only page that models a
        plan size, because every allocation needs a denominator.
      </p>
    </ArticlePage>
  );
}

export function FinancialsBody() {
  return (
    <ArticlePage
      eyebrow="Financials"
      title="Financial overview"
      subtitle={`Recognized revenue, GAAP. ${COMPANY.dataAsOf}.`}
    >
      <table>
        <thead>
          <tr>
            <th>Period</th>
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
          <tr>
            <td>FY 2025</td>
            <td>{usdExact(FY_2025_RECOGNIZED)}</td>
            <td>—</td>
            <td>—</td>
          </tr>
          <tr>
            <td>H1 2026</td>
            <td>{usdExact(H1_2026_RECOGNIZED)}</td>
            <td>—</td>
            <td>—</td>
          </tr>
          <tr>
            <td>TTM</td>
            <td>{usdExact(TTM_RECOGNIZED)}</td>
            <td>—</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
      <p>
        {JUNE_2026.label} recognized {usdExact(JUNE_2026.recognized)} at {Math.round(JUNE_2026.grossMargin * 100)}%
        gross margin. Annualized {usdCompact(ANNUALIZED_RUN_RATE)} on that month. Do not annualize a quarter and
        call it a run-rate.
      </p>
      <p>{PIPELINE_NOTE}</p>
    </ArticlePage>
  );
}

export function UseOfFundsBody({
  planAmount,
  allocations,
}: {
  planAmount: string;
  allocations: readonly UseOfFundsAllocation[];
}) {
  return (
    <ArticlePage
      eyebrow="Financials"
      title="Use of funds"
      subtitle={`The full-diligence plan at ${planAmount} over eighteen months.`}
      date="2026-06-30"
    >
      <p>
        {COMPANY.name} turns an analog yard into a scheduled system. This memo models the{" "}
        <strong>{planAmount} deployment case</strong>. General pitch materials omit a round amount; the number
        appears here because every line needs a denominator.
      </p>
      <p>
        The plan is staged. A second delivery pod unlocks after two more contracted go-lives. Perception hiring
        unlocks after snow-mode v2 clears QA. We will not spend the reserve on a second product.
      </p>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>%</th>
            <th>What it buys</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((row) => (
            <tr key={row.category}>
              <td>{row.category}</td>
              <td>{row.percentage}%</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Current position: {usdCompact(ANNUALIZED_RUN_RATE)} annualized run-rate, {PAYING_CUSTOMERS} paying
        customers, {HEADCOUNT} people. The plan funds repeatability, not a reboot.
      </p>
    </ArticlePage>
  );
}

export function GoToMarketBody() {
  return (
    <ArticlePage eyebrow="Go-to-market" title="How we sell" subtitle="One motion. One buyer. One refusal.">
      <h2>Buyer</h2>
      <p>
        VP of transportation owns the budget. The DC general manager owns the night shift. If either says no, we
        leave. We do not sell to a chief digital officer shopping a robotics tour.
      </p>
      <h2>Motion</h2>
      <p>
        Paid 60- to 90-day pilot on the customer&apos;s existing spotter trucks. Success is docks-per-hour and
        trailer dwell, written down before we unload a kit. Conversion is a site license plus optional tractors
        from the manufacturing partner.
      </p>
      <h2>Implementation</h2>
      <p>
        A delivery pod lives on site for the first four weeks. Safety review with the local committee is on the
        critical path. We will miss a quarter before we skip that meeting.
      </p>
      <h2>What we refuse</h2>
      <p>
        We will not take vehicle inventory. We will not quote a public-road robotaxi. We will not start a pilot
        whose only KPI is a demo day.
      </p>
      <h2>Economics of a site</h2>
      <p>
        Software attaches first. A typical grocery DC pays an annual site license that we recognize ratably. If they
        later take partner tractors, the hardware invoice is the OEM&apos;s. Our attach is a software increment and
        a support retainer. That is why June margin is {Math.round(JUNE_2026.grossMargin * 100)}% and why we will
        not fund a vehicle company by accident.
      </p>
      <h2>Who we do not hire for</h2>
      <p>
        We do not staff a city operations team. We do not hire a consumer growth lead. The next ten people are
        perception, reliability, and implementation — gated on go-lives, not on a slide.
      </p>
    </ArticlePage>
  );
}

export function CompetitiveBody() {
  return (
    <ArticlePage
      eyebrow="Product"
      title="Competitive landscape"
      subtitle="The yard is not a down-market robotaxi problem."
    >
      <CompetitiveMatrix />
      <p>
        Vehicle OEMs want to sell a driverless tractor. WMS vendors already have the door schedule and will not
        learn perception. Robotaxi stacks treat the yard as a demo. The in-house team has radios. Acme is the
        operating system that those four options are not.
      </p>
    </ArticlePage>
  );
}

export function ArchitectureBody() {
  return (
    <ArticlePage
      eyebrow="Product"
      title="Technical architecture"
      subtitle="On-vehicle stack, yard graph, and what never leaves the site."
    >
      <h2>On the tractor</h2>
      <p>
        Two lidars, a forward camera, RTK GPS, and a safety PLC that can cut motion without asking the compute
        stack. Perception runs on an industrial GPU. The motion planner will not issue a command the PLC has not
        pre-cleared.
      </p>
      <h2>Yard graph</h2>
      <p>
        A surveyed map plus live occupancy. Dispatch assigns a tractor to a door only if the graph says the alley
        is clear and the WMS says the door will be free. The night-shift lead can override any assignment. Overrides
        are training data.
      </p>
      <h2>What stays on-prem</h2>
      <p>
        Raw sensor recordings do not leave a pharma or port site. We train on-site or on a customer-approved
        region. Model weights can leave; the bags do not. That is in the contract, not the pitch.
      </p>
      <h2>Integrations</h2>
      <p>
        Door events from the WMS. Gate appointments from the YMS if one exists. Trailer IDs from the yard camera
        when the WMS is silent. We will not replace a working WMS. We sit beside it.
      </p>
      <h2>What we will not build this year</h2>
      <p>Public-road autonomy. A consumer app. A second vehicle SKU under our own brand. A second continent.</p>
    </ArticlePage>
  );
}

export function CaseStudiesBody() {
  const featured = ACCOUNTS.slice(0, 4);
  return (
    <ArticlePage
      eyebrow="Go-to-market"
      title="Site notes"
      subtitle="Four contracted yards. The KPI is written before the kit lands."
    >
      {featured.map((account) => (
        <section key={account.name}>
          <h2>{account.name}</h2>
          <p>
            {account.segment} · {account.sites} site{account.sites === 1 ? "" : "s"} · contracted {account.since}.{" "}
            {account.note}
          </p>
        </section>
      ))}
      <p>These counterparties are the worked example. They are not a customer list you can reference in a real raise.</p>
    </ArticlePage>
  );
}

export function CapTableBody() {
  return (
    <ArticlePage
      eyebrow="Legal"
      title="Capitalization"
      subtitle="Fully diluted, illustrative. NDA-gated. Not a term sheet."
      date="2026-06-30"
    >
      <table>
        <thead>
          <tr>
            <th>Holder</th>
            <th>Shares</th>
            <th>% FD</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Founders (common)</td>
            <td>8,400,000</td>
            <td>70.0%</td>
            <td>{FOUNDER.name} and {COMPANY.shortName} co-founder</td>
          </tr>
          <tr>
            <td>Option pool (unissued)</td>
            <td>1,800,000</td>
            <td>15.0%</td>
            <td>Refreshed at seed close</td>
          </tr>
          <tr>
            <td>Seed preferred</td>
            <td>1,800,000</td>
            <td>15.0%</td>
            <td>$3.2M invested · $18M post</td>
          </tr>
          <tr>
            <td>Total fully diluted</td>
            <td>12,000,000</td>
            <td>100%</td>
            <td>Before the {COMPANY.roundLabel}</td>
          </tr>
        </tbody>
      </table>
      <p>
        Harbor Peak led the seed. Redwood Seed and Northline Capital followed. This table is the worked example so
        a fork has a complete legal page. Replace it with counsel&apos;s cap table before a real close.
      </p>
    </ArticlePage>
  );
}

export function InternalNotesBody() {
  return (
    <ArticlePage
      eyebrow="Internal"
      title="Working notes"
      subtitle={`Staff-only. Investors who guess this URL get a 404.`}
    >
      <p>
        Use this page for drafts that must stay inside {COMPANY.domain}. Current scratch: Q3 safety reviews at
        Silvercurrent and the partner-tractor CAN contract. Do not paste either into a public memo.
      </p>
    </ArticlePage>
  );
}

export function SampleDeckEmbed({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <iframe
        title={`${COMPANY.name} pitch deck`}
        src={`/api/docs/${slug}/deck`}
        className="aspect-video w-full rounded-xl border border-border bg-black"
      />
    </div>
  );
}

export function formatPlanAmount(cents: number): string {
  return formatVariantRaiseAmount(cents);
}
