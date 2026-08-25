/**
 * Document registry for the data room.
 *
 * Edit this file to add or update documents. Every entry ships in a client
 * bundle delivered to approved viewers — keep descriptions free of figures
 * you would not want a screenshot to capture. Internal-only documents set
 * `audience: "internal"` and are enforced server-side.
 *
 * Checklist when adding a document: docs/guides/add-document.md
 */

import type { DocumentAudience } from "./document-audience";

export type DocumentType = "pdf" | "excel" | "deck" | "article" | "webpage" | "html";
export type DocumentDistribution = "primary" | "on-request" | "retired";

export type Document = {
  name: string;
  slug: string;
  type: DocumentType;
  description: string;
  category: string;
  fileUrl: string | null;
  requireNda: boolean;
  /** Bump when content changes — drives the per-reader "Updated" badge. */
  version: number;
  distribution: DocumentDistribution;
  audience?: DocumentAudience;
};

export type DocumentCategory = {
  title: string;
  documents: Document[];
  note?: string;
};

export const CATEGORY_ORDER = [
  "Overview",
  "Financials",
  "Product",
  "Legal",
] as const;

/**
 * Sample diligence set. Replace titles, descriptions, and fileUrl values
 * with your materials. Slugs are access-control keys — renaming one after
 * investors have grants requires a migration of `document_grants` and
 * `dataroom_variant_documents`.
 */
export const DOCUMENTS: Document[] = [
  {
    name: "Sample Pitch Deck",
    slug: "pitch-deck",
    type: "deck",
    description: "Five-slide placeholder deck. Replace the HTML in content/documents/.",
    category: "Overview",
    fileUrl: "content/documents/sample-pitch-deck.html",
    requireNda: false,
    version: 1,
    distribution: "primary",
  },
  {
    name: "Sample Investment Memo",
    slug: "investment-memo",
    type: "article",
    description: "One-page memo template. Replace the copy on /docs/investment-memo.",
    category: "Overview",
    fileUrl: "/docs/investment-memo",
    requireNda: false,
    version: 1,
    distribution: "primary",
  },
  {
    name: "Sample Financial Overview",
    slug: "financial-overview",
    type: "article",
    description: "Metrics page template. Fill the dashes from your books.",
    category: "Financials",
    fileUrl: "/docs/financial-overview",
    requireNda: false,
    version: 1,
    distribution: "primary",
  },
  {
    name: "Sample Use of Funds",
    slug: "use-of-funds",
    type: "article",
    description: "Allocation memo for the full-diligence room only.",
    category: "Financials",
    fileUrl: "/docs/use-of-funds",
    requireNda: false,
    version: 1,
    distribution: "primary",
  },
  {
    name: "Sample Cap Table",
    slug: "cap-table",
    type: "pdf",
    description: "NDA-gated placeholder. Upload your PDF and point fileUrl at it.",
    category: "Legal",
    fileUrl: "content/documents/sample-cap-table.pdf",
    requireNda: true,
    version: 1,
    distribution: "on-request",
  },
  {
    name: "Internal Working Notes",
    slug: "internal-notes",
    type: "article",
    description: "Staff-only scratch page. Investors cannot open this slug.",
    category: "Overview",
    fileUrl: "/docs/internal-notes",
    requireNda: false,
    version: 1,
    distribution: "primary",
    audience: "internal",
  },
];

export const SELECTABLE_DOCUMENT_SLUGS: ReadonlySet<string> = new Set(
  DOCUMENTS.map((doc) => doc.slug),
);

export function getDocumentBySlug(slug: string): Document | undefined {
  return DOCUMENTS.find((doc) => doc.slug === slug);
}

export function visibleDocuments(isInternal: boolean): Document[] {
  return DOCUMENTS.filter((doc) => isInternal || doc.audience !== "internal");
}

export function getDocumentCategories(isInternal: boolean): DocumentCategory[] {
  const docs = visibleDocuments(isInternal).filter((doc) => doc.distribution === "primary");
  return CATEGORY_ORDER.map((title) => ({
    title,
    documents: docs.filter((doc) => doc.category === title),
  })).filter((category) => category.documents.length > 0);
}
