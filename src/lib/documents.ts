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
  "Go-to-market",
  "Security",
  "Legal",
] as const;

/**
 * Acme diligence set. Slugs are access-control keys — renaming one after
 * investors have grants requires a migration of `document_grants` and
 * `dataroom_variant_documents`.
 */
export const DOCUMENTS: Document[] = [
  {
    name: "Series A deck",
    slug: "pitch-deck",
    type: "deck",
    description: "Ten-slide story: the yard, the product, the ledger, the round.",
    category: "Overview",
    fileUrl: "content/documents/sample-pitch-deck.html",
    requireNda: false,
    version: 3,
    distribution: "primary",
  },
  {
    name: "Investment memo",
    slug: "investment-memo",
    type: "article",
    description: "Thesis, buyer, traction, risks, and how we spend the plan.",
    category: "Overview",
    fileUrl: "/docs/investment-memo",
    requireNda: false,
    version: 2,
    distribution: "primary",
  },
  {
    name: "Financial overview",
    slug: "financial-overview",
    type: "article",
    description: "Quarterly recognized revenue, margins, and the June 2026 close.",
    category: "Financials",
    fileUrl: "/docs/financial-overview",
    requireNda: false,
    version: 2,
    distribution: "primary",
  },
  {
    name: "Use of funds",
    slug: "use-of-funds",
    type: "article",
    description: "Eighteen-month allocation for the full-diligence plan.",
    category: "Financials",
    fileUrl: "/docs/use-of-funds",
    requireNda: false,
    version: 2,
    distribution: "primary",
  },
  {
    name: "Go-to-market",
    slug: "go-to-market",
    type: "article",
    description: "Buyer, motion, implementation, and what we refuse to sell.",
    category: "Go-to-market",
    fileUrl: "/docs/go-to-market",
    requireNda: false,
    version: 1,
    distribution: "primary",
  },
  {
    name: "Competitive landscape",
    slug: "competitive-landscape",
    type: "article",
    description: "OEMs, WMS incumbents, robotaxi stacks, and the in-house yard.",
    category: "Product",
    fileUrl: "/docs/competitive-landscape",
    requireNda: false,
    version: 1,
    distribution: "primary",
  },
  {
    name: "Technical architecture",
    slug: "technical-architecture",
    type: "article",
    description: "On-vehicle stack, yard graph, and what stays on-prem.",
    category: "Product",
    fileUrl: "/docs/technical-architecture",
    requireNda: false,
    version: 1,
    distribution: "primary",
  },
  {
    name: "Site notes",
    slug: "case-studies",
    type: "article",
    description: "Four contracted yards and what they measure.",
    category: "Go-to-market",
    fileUrl: "/docs/case-studies",
    requireNda: false,
    version: 1,
    distribution: "primary",
  },
  {
    name: "Security and compliance",
    slug: "security-compliance",
    type: "article",
    description: "Data residency, access, attestation status, and what is still on request.",
    category: "Security",
    fileUrl: "/docs/security-compliance",
    requireNda: false,
    version: 1,
    distribution: "primary",
  },
  {
    name: "Cap table",
    slug: "cap-table",
    type: "article",
    description: "Fully diluted capitalization. NDA required.",
    category: "Legal",
    fileUrl: "/docs/cap-table",
    requireNda: true,
    version: 2,
    distribution: "primary",
  },
  {
    name: "Intellectual property",
    slug: "intellectual-property",
    type: "article",
    description: "Patents, inbound licenses, and open source. NDA required. No application numbers on this page.",
    category: "Legal",
    fileUrl: "/docs/intellectual-property",
    requireNda: true,
    version: 1,
    distribution: "primary",
  },
  {
    name: "Internal working notes",
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
