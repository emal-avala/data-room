import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { NDASignatureGate } from "@/components/NDASignatureGate";
import { getDocumentBySlug } from "@/lib/documents";
import { getNdaText } from "@/lib/nda-agreement";
import { getDocumentNdaAccess } from "@/lib/nda-evidence";
import { siteConfig } from "@/config/site";
import { DEFAULT_USE_OF_FUNDS, formatVariantRaiseAmount } from "@/lib/dataroom-variants";

function SampleDeckEmbed({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <iframe
        title="Sample pitch deck"
        src={`/api/docs/${slug}/deck`}
        className="aspect-video w-full rounded-xl border border-border bg-black"
      />
    </div>
  );
}

function MemoBody() {
  return (
    <ArticlePage
      eyebrow="Overview"
      title="Sample investment memo"
      subtitle="Replace this page with your thesis. No real figures belong here."
      date="2026-01-15"
    >
      <p>
        {siteConfig.companyName} is raising a {siteConfig.roundLabel}. This memo
        is a template. Delete every paragraph and write your own.
      </p>
      <h2>Problem</h2>
      <p>
        State the customer problem in two sentences. Avoid slogans. Name the
        buyer and the job they cannot finish today.
      </p>
      <h2>Product</h2>
      <p>
        Describe what you ship, not the category you hope to own. One paragraph
        on the current product, one on the next twelve months.
      </p>
      <h2>Traction</h2>
      <p>
        Put numbers in <code>src/data/</code> and interpolate them. Do not type
        a figure twice. The sample pages leave the cells blank.
      </p>
      <h2>The round</h2>
      <p>
        Keep the raise amount off general surfaces. The use-of-funds memo is
        the place that models a plan size.
      </p>
    </ArticlePage>
  );
}

function FinancialsBody() {
  return (
    <ArticlePage
      eyebrow="Financials"
      title="Sample financial overview"
      subtitle="Layout only. Replace the dashes with figures from your books."
    >
      <table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Revenue</th>
            <th>Gross margin</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Last fiscal year</td>
            <td>—</td>
            <td>—</td>
          </tr>
          <tr>
            <td>Current year to date</td>
            <td>—</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
      <p>
        The admin analytics dashboard tracks who opened this page. It does not
        invent numbers for you.
      </p>
    </ArticlePage>
  );
}

function UseOfFundsBody() {
  return (
    <ArticlePage
      eyebrow="Financials"
      title="Sample use of funds"
      subtitle={`Models the sample plan at ${formatVariantRaiseAmount(500_000_000)}. Change the amount in src/lib/dataroom-variants.ts.`}
    >
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>%</th>
            <th>What it buys</th>
          </tr>
        </thead>
        <tbody>
          {DEFAULT_USE_OF_FUNDS.map((row) => (
            <tr key={row.category}>
              <td>{row.category}</td>
              <td>{row.percentage}%</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ArticlePage>
  );
}

function InternalNotesBody() {
  return (
    <ArticlePage
      eyebrow="Internal"
      title="Working notes"
      subtitle="Staff-only. Investors who guess this URL get a 404."
    >
      <p>
        Use this page for drafts that must stay inside {siteConfig.domain}. The
        audience gate is enforced on the server, not by hiding the link.
      </p>
    </ArticlePage>
  );
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const document = getDocumentBySlug(slug);
  if (!document) notFound();

  const nda = await getDocumentNdaAccess(document);
  const body = (() => {
    if (document.type === "deck" || document.type === "html") {
      return <SampleDeckEmbed slug={slug} />;
    }
    if (slug === "investment-memo") return <MemoBody />;
    if (slug === "financial-overview") return <FinancialsBody />;
    if (slug === "use-of-funds") return <UseOfFundsBody />;
    if (slug === "internal-notes") return <InternalNotesBody />;
    if (document.type === "pdf") {
      return (
        <div className="mx-auto max-w-3xl px-4 py-16">
          <p className="text-eyebrow">{document.category}</p>
          <h1 className="mt-2 text-3xl font-semibold">{document.name}</h1>
          <p className="mt-3 text-muted-foreground">{document.description}</p>
          <a
            className="mt-6 inline-flex text-sm text-primary hover:underline"
            href={`/api/docs/${slug}/file`}
          >
            Open stamped PDF
          </a>
        </div>
      );
    }
    return (
      <ArticlePage eyebrow={document.category} title={document.name}>
        <p>{document.description}</p>
      </ArticlePage>
    );
  })();

  if (document.requireNda && nda !== "signed" && nda !== "not_required") {
    return <NDASignatureGate text={getNdaText()}>{body}</NDASignatureGate>;
  }

  return body;
}
