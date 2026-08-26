import { notFound } from "next/navigation";
import { NDASignatureGate } from "@/components/NDASignatureGate";
import {
  ArchitectureBody,
  CapTableBody,
  CaseStudiesBody,
  CompetitiveBody,
  FinancialsBody,
  GoToMarketBody,
  IntellectualPropertyBody,
  InternalNotesBody,
  MemoBody,
  SampleDeckEmbed,
  SecurityComplianceBody,
  UseOfFundsBody,
} from "@/content/ir/articles";
import { getDocumentBySlug } from "@/lib/documents";
import { getNdaText } from "@/lib/nda-agreement";
import { getDocumentNdaAccess } from "@/lib/nda-evidence";
import { formatVariantRaiseAmount } from "@/lib/dataroom-variants";
import { requireDataRoomDocument } from "@/lib/require-dataroom-document";
import { ArticlePage } from "@/components/ArticlePage";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const document = getDocumentBySlug(slug);
  if (!document) notFound();

  const context = await requireDataRoomDocument(slug);
  const nda = await getDocumentNdaAccess(document);
  const body = (() => {
    if (document.type === "deck" || document.type === "html") {
      return <SampleDeckEmbed slug={slug} />;
    }
    if (slug === "investment-memo") return <MemoBody />;
    if (slug === "financial-overview") return <FinancialsBody />;
    if (slug === "use-of-funds") {
      return (
        <UseOfFundsBody
          planAmount={formatVariantRaiseAmount(context.variant.raiseAmountCents)}
          allocations={context.variant.useOfFunds}
        />
      );
    }
    if (slug === "go-to-market") return <GoToMarketBody />;
    if (slug === "competitive-landscape") return <CompetitiveBody />;
    if (slug === "technical-architecture") return <ArchitectureBody />;
    if (slug === "case-studies") return <CaseStudiesBody />;
    if (slug === "cap-table") return <CapTableBody />;
    if (slug === "intellectual-property") return <IntellectualPropertyBody />;
    if (slug === "security-compliance") return <SecurityComplianceBody />;
    if (slug === "internal-notes") return <InternalNotesBody />;
    if (document.type === "pdf") {
      return (
        <div className="mx-auto max-w-3xl px-4 py-16">
          <p className="text-eyebrow">{document.category}</p>
          <h1 className="mt-2 text-3xl font-semibold">{document.name}</h1>
          <p className="mt-3 text-muted-foreground">{document.description}</p>
          <a className="mt-6 inline-flex text-sm text-primary hover:underline" href={`/api/docs/${slug}/file`}>
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
