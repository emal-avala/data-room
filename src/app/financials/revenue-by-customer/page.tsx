import { CONTRACTED } from "@/data/customers";
import { H1_2026_RECOGNIZED } from "@/data/financials";
import { FinancialsNav } from "@/components/FinancialsNav";
import { Section } from "@/components/Section";
import { usdCompact, usdExact } from "@/lib/format-money";

const ranked = [...CONTRACTED].sort((a, b) => b.h1Recognized - a.h1Recognized);
const topTwo = ranked[0].h1Recognized + ranked[1].h1Recognized;
const concentration = topTwo / H1_2026_RECOGNIZED;

export default function RevenueByCustomerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Section eyebrow="Financials" title="Revenue by customer">
        <FinancialsNav current="/financials/revenue-by-customer" />
        <p className="max-w-2xl text-muted-foreground">
          H1 2026 recognized, GAAP, by contracted account. The two largest names are {usdCompact(topTwo)} (
          {Math.round(concentration * 100)}% of the half). That concentration is a named risk on the company page.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">H1 2026 recognized</dt>
            <dd className="mt-2 text-2xl font-semibold">{usdCompact(H1_2026_RECOGNIZED)}</dd>
          </div>
          <div className="container-box p-6">
            <dt className="text-sm text-muted-foreground">Top two accounts</dt>
            <dd className="mt-2 text-2xl font-semibold">{Math.round(concentration * 100)}%</dd>
            <p className="mt-2 text-xs text-muted-foreground">
              {ranked[0].name} and {ranked[1].name}
            </p>
          </div>
        </dl>
      </Section>

      <Section eyebrow="Accounts" title="Contracted, ranked">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr>
                <th className="text-left">Account</th>
                <th>Segment</th>
                <th>Sites</th>
                <th>H1 recognized</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((account) => (
                <tr key={account.name}>
                  <td className="font-medium">{account.name}</td>
                  <td>{account.segment}</td>
                  <td>{account.sites}</td>
                  <td>{usdExact(account.h1Recognized)}</td>
                  <td>{Math.round((account.h1Recognized / H1_2026_RECOGNIZED) * 1000) / 10}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Names are the worked example. Replace this table before inviting a real fund.
        </p>
      </Section>
    </div>
  );
}
