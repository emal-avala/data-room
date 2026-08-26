/**
 * Server-only data-room variant resolution.
 *
 * Variant composition is an authorization decision, not client configuration.
 * Do not import this module from a client component: doing so would ship every
 * variant's document allowlist in a browser chunk.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { isInternalViewer } from "./document-audience";
import { SELECTABLE_DOCUMENT_SLUGS } from "./documents";
import { isSupabaseConfigured } from "@/utils/supabase/config";

export const DEFAULT_DATAROOM_VARIANT_SLUG = "core";
export const FULL_DATAROOM_VARIANT_SLUG = "full";

export type DataRoomAssetPolicy = "all" | "allowlist" | "none";

export type UseOfFundsAllocation = {
  category: string;
  percentage: number;
  description: string;
};

export type DataRoomVariantDocument = {
  slug: string;
  assetPolicy: DataRoomAssetPolicy;
  sortOrder: number;
  allowedAssets: ReadonlySet<string>;
};

export type DataRoomVariant = {
  id: string;
  slug: string;
  name: string;
  description: string;
  raiseAmountCents: number;
  showRaiseAmount: boolean;
  deckHeadline: string | null;
  useOfFunds: readonly UseOfFundsAllocation[];
  documents: ReadonlyMap<string, DataRoomVariantDocument>;
};

export type DataRoomVariantContext = {
  variant: DataRoomVariant;
  fundId: string | null;
  staffBypass: boolean;
  source: "database" | "builtin" | "locked" | "internal";
};

export type AuthenticatedDataRoomContext =
  | { status: "allowed"; email: string; context: DataRoomVariantContext }
  | { status: "unauthenticated" }
  | { status: "unavailable" };

/** Core room — the default for a first conversation. */
export const CORE_DOCUMENTS = [
  "pitch-deck",
  "investment-memo",
  "financial-overview",
] as const;

/** Extra slugs reserved for an active lead conversation. */
export const FULL_ONLY_DOCUMENTS = [
  "use-of-funds",
  "cap-table",
  "go-to-market",
  "competitive-landscape",
  "technical-architecture",
  "case-studies",
] as const;

/**
 * Sample plan sizes the use-of-funds page can model. These are placeholders.
 * Changing this list requires a code deploy BEFORE writing a new amount to
 * the database — `loadDatabaseVariant()` treats an unknown amount as missing
 * and locks that room.
 */
export const DATAROOM_RAISE_AMOUNTS_CENTS = [
  500_000_000, // $5M sample
  1_000_000_000, // $10M sample
] as const;

export const DEFAULT_USE_OF_FUNDS: readonly UseOfFundsAllocation[] = [
  {
    category: "Product",
    percentage: 40,
    description: "On-vehicle perception, multi-yard dispatch, snow mode, and the partner-tractor interface.",
  },
  {
    category: "Go-to-market",
    percentage: 25,
    description: "A second delivery pod, two enterprise AEs, and customer success for the live network.",
  },
  {
    category: "Operations",
    percentage: 15,
    description: "Field trucks, spare compute, insurance, and Chicago / Dallas leases.",
  },
  {
    category: "People",
    percentage: 15,
    description: "Perception, reliability, and implementation hiring gated on go-lives.",
  },
  {
    category: "Reserve",
    percentage: 5,
    description: "Working-capital buffer. Not a second product.",
  },
];

export const DATAROOM_PLAN_CATEGORIES: readonly string[] = DEFAULT_USE_OF_FUNDS.map(
  (allocation) => allocation.category,
);

export function isDataRoomRaiseAmount(
  value: unknown,
): value is (typeof DATAROOM_RAISE_AMOUNTS_CENTS)[number] {
  return (
    typeof value === "number" &&
    DATAROOM_RAISE_AMOUNTS_CENTS.some((amount) => amount === value)
  );
}

function documentMap(slugs: readonly string[]): ReadonlyMap<string, DataRoomVariantDocument> {
  return new Map(
    slugs.map((slug, index) => [
      slug,
      {
        slug,
        assetPolicy: "all" as const,
        sortOrder: (index + 1) * 10,
        allowedAssets: new Set<string>(),
      },
    ]),
  );
}

export const BUILTIN_DATAROOM_VARIANTS: Readonly<Record<string, DataRoomVariant>> = {
  [DEFAULT_DATAROOM_VARIANT_SLUG]: {
    id: "builtin-core",
    slug: DEFAULT_DATAROOM_VARIANT_SLUG,
    name: "Core room",
    description: "Minimum diligence set for a first conversation.",
    raiseAmountCents: 500_000_000,
    showRaiseAmount: false,
    deckHeadline: null,
    useOfFunds: DEFAULT_USE_OF_FUNDS,
    documents: documentMap(CORE_DOCUMENTS),
  },
  [FULL_DATAROOM_VARIANT_SLUG]: {
    id: "builtin-full",
    slug: FULL_DATAROOM_VARIANT_SLUG,
    name: "Full diligence",
    description: "Expanded room for an active lead conversation.",
    raiseAmountCents: 1_000_000_000,
    showRaiseAmount: false,
    deckHeadline: null,
    useOfFunds: DEFAULT_USE_OF_FUNDS,
    documents: documentMap([...CORE_DOCUMENTS, ...FULL_ONLY_DOCUMENTS]),
  },
};

const LOCKED_VARIANT: DataRoomVariant = {
  id: "locked",
  slug: "locked",
  name: "Unavailable",
  description: "The assigned data room is unavailable.",
  raiseAmountCents: 500_000_000,
  showRaiseAmount: false,
  deckHeadline: null,
  useOfFunds: DEFAULT_USE_OF_FUNDS,
  documents: new Map(),
};

type VariantRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  raise_amount_cents: number;
  show_raise_amount: boolean;
  deck_headline: string | null;
  use_of_funds: unknown;
};

type VariantDocumentRow = {
  document_slug: string;
  asset_policy: string;
  sort_order: number;
};

type VariantAssetRow = {
  document_slug: string;
  asset_path: string;
};

function isAllocation(value: unknown): value is UseOfFundsAllocation {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const allocation = value as Record<string, unknown>;
  return (
    typeof allocation.category === "string" &&
    allocation.category.trim().length > 0 &&
    typeof allocation.percentage === "number" &&
    Number.isFinite(allocation.percentage) &&
    allocation.percentage > 0 &&
    typeof allocation.description === "string" &&
    allocation.description.trim().length > 0
  );
}

export function parseUseOfFunds(value: unknown): readonly UseOfFundsAllocation[] | null {
  if (!Array.isArray(value) || value.length !== DATAROOM_PLAN_CATEGORIES.length) {
    return null;
  }
  if (
    !value.every(
      (allocation, index) =>
        isAllocation(allocation) && allocation.category === DATAROOM_PLAN_CATEGORIES[index],
    )
  ) {
    return null;
  }
  const total = value.reduce((sum, allocation) => sum + allocation.percentage, 0);
  return Math.abs(total - 100) < 0.0001 ? value : null;
}

function isAssetPolicy(value: string): value is DataRoomAssetPolicy {
  return value === "all" || value === "allowlist" || value === "none";
}

function validRelativeAssetPath(value: string): boolean {
  if (!value || value.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(value)) return false;
  return !value.split("/").includes("..");
}

function lockedContext(fundId: string | null): DataRoomVariantContext {
  return { variant: LOCKED_VARIANT, fundId, staffBypass: false, source: "locked" };
}

function internalContext(): DataRoomVariantContext {
  return {
    variant: BUILTIN_DATAROOM_VARIANTS[FULL_DATAROOM_VARIANT_SLUG],
    fundId: null,
    staffBypass: true,
    source: "internal",
  };
}

function builtinContext(fundId: string | null): DataRoomVariantContext {
  return {
    variant: BUILTIN_DATAROOM_VARIANTS[DEFAULT_DATAROOM_VARIANT_SLUG],
    fundId,
    staffBypass: false,
    source: "builtin",
  };
}

type DatabaseVariantResult =
  | { status: "found"; variant: DataRoomVariant }
  | { status: "missing" }
  | { status: "schema_missing" };

function isMissingVariantSchema(error: { code?: string } | null): boolean {
  return error?.code === "42P01" || error?.code === "42703";
}

async function loadDatabaseVariant(
  supabase: SupabaseClient,
  variantId: string | null,
): Promise<DatabaseVariantResult> {
  let query = supabase
    .from("dataroom_variants")
    .select(
      "id, slug, name, description, raise_amount_cents, show_raise_amount, deck_headline, use_of_funds",
    )
    .eq("status", "active");
  query = variantId ? query.eq("id", variantId) : query.eq("is_default", true);

  const { data: rawVariant, error: variantError } = await query.maybeSingle();
  if (variantError) {
    return isMissingVariantSchema(variantError) ? { status: "schema_missing" } : { status: "missing" };
  }
  if (!rawVariant) return { status: "missing" };
  const row = rawVariant as VariantRow;
  const allocations = parseUseOfFunds(row.use_of_funds);
  if (!allocations || !isDataRoomRaiseAmount(row.raise_amount_cents)) {
    return { status: "missing" };
  }

  const { data: rawDocuments, error: documentsError } = await supabase
    .from("dataroom_variant_documents")
    .select("document_slug, asset_policy, sort_order")
    .eq("variant_id", row.id)
    .order("sort_order")
    .order("document_slug");
  if (documentsError) {
    return isMissingVariantSchema(documentsError) ? { status: "schema_missing" } : { status: "missing" };
  }
  if (!rawDocuments) return { status: "missing" };

  const { data: rawAssets, error: assetsError } = await supabase
    .from("dataroom_variant_assets")
    .select("document_slug, asset_path")
    .eq("variant_id", row.id);
  if (assetsError) {
    return isMissingVariantSchema(assetsError) ? { status: "schema_missing" } : { status: "missing" };
  }
  if (!rawAssets) return { status: "missing" };

  const assetsByDocument = new Map<string, Set<string>>();
  for (const rawAsset of rawAssets as VariantAssetRow[]) {
    if (!validRelativeAssetPath(rawAsset.asset_path)) return { status: "missing" };
    const assets = assetsByDocument.get(rawAsset.document_slug) ?? new Set<string>();
    assets.add(rawAsset.asset_path);
    assetsByDocument.set(rawAsset.document_slug, assets);
  }

  const documents = new Map<string, DataRoomVariantDocument>();
  for (const rawDocument of rawDocuments as VariantDocumentRow[]) {
    if (
      !SELECTABLE_DOCUMENT_SLUGS.has(rawDocument.document_slug) ||
      !isAssetPolicy(rawDocument.asset_policy)
    ) {
      return { status: "missing" };
    }
    documents.set(rawDocument.document_slug, {
      slug: rawDocument.document_slug,
      assetPolicy: rawDocument.asset_policy,
      sortOrder: rawDocument.sort_order,
      allowedAssets: assetsByDocument.get(rawDocument.document_slug) ?? new Set(),
    });
  }

  return {
    status: "found",
    variant: {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description ?? "",
      raiseAmountCents: row.raise_amount_cents,
      showRaiseAmount: row.show_raise_amount,
      deckHeadline: row.deck_headline,
      useOfFunds: allocations,
      documents,
    },
  };
}

type ViewerFundResult = { status: "found"; fundId: string | null } | { status: "error" };

async function resolveOrCreateViewerFund(
  supabase: SupabaseClient,
  email: string,
): Promise<ViewerFundResult> {
  const lookup = async () =>
    supabase.from("viewers").select("fund_id").eq("email", email).maybeSingle();

  const { data: existing, error: lookupError } = await lookup();
  if (lookupError) return { status: "error" };
  if (existing) {
    return {
      status: "found",
      fundId: typeof existing.fund_id === "string" ? existing.fund_id : null,
    };
  }

  const { data: created, error: createError } = await supabase
    .from("viewers")
    .insert({ email, metadata: { source: "dataroom" } })
    .select("fund_id")
    .single();
  if (!createError && created) {
    return {
      status: "found",
      fundId: typeof created.fund_id === "string" ? created.fund_id : null,
    };
  }

  const { data: raced, error: raceError } = await lookup();
  if (raceError || !raced) return { status: "error" };
  return {
    status: "found",
    fundId: typeof raced.fund_id === "string" ? raced.fund_id : null,
  };
}

export async function resolveDataRoomVariantWithClient(
  supabase: SupabaseClient,
  email: string,
): Promise<DataRoomVariantContext> {
  if (isInternalViewer(email)) return internalContext();

  const viewer = await resolveOrCreateViewerFund(supabase, email);
  if (viewer.status === "error") return lockedContext(null);
  const fundId = viewer.fundId;
  let assignedVariantId: string | null = null;

  if (fundId) {
    const { data: fund, error: fundError } = await supabase
      .from("funds")
      .select("dataroom_variant_id")
      .eq("id", fundId)
      .maybeSingle();
    if (fundError) {
      return fundError.code === "42703" ? builtinContext(fundId) : lockedContext(fundId);
    }
    if (!fund) return lockedContext(fundId);
    assignedVariantId =
      typeof fund?.dataroom_variant_id === "string" ? fund.dataroom_variant_id : null;
  }

  const loaded = await loadDatabaseVariant(supabase, assignedVariantId);
  if (loaded.status === "schema_missing" && !assignedVariantId) {
    return builtinContext(fundId);
  }
  if (loaded.status !== "found") {
    return lockedContext(fundId);
  }
  return {
    variant: loaded.variant,
    fundId,
    staffBypass: false,
    source: "database",
  };
}

export async function resolveDataRoomVariantForEmail(
  email: string,
): Promise<DataRoomVariantContext> {
  try {
    const { createAdminClient } = await import("@/utils/supabase/server");
    return await resolveDataRoomVariantWithClient(createAdminClient(), email);
  } catch {
    return isInternalViewer(email) ? internalContext() : lockedContext(null);
  }
}

function developmentStaffContext(): AuthenticatedDataRoomContext {
  return {
    status: "allowed",
    email: "dev@example.com",
    context: internalContext(),
  };
}

/**
 * Public OSS demo email. Must not be on the company domain or
 * `internal-notes` would leak through `canViewAudience`.
 */
export const PUBLIC_DEMO_VIEWER_EMAIL = "demo@example.com";

export function publicDemoDataRoomContext(): AuthenticatedDataRoomContext {
  return {
    status: "allowed",
    email: PUBLIC_DEMO_VIEWER_EMAIL,
    context: {
      variant: BUILTIN_DATAROOM_VARIANTS[FULL_DATAROOM_VARIANT_SLUG],
      fundId: null,
      staffBypass: false,
      source: "builtin",
    },
  };
}

/**
 * No Supabase means there is no login. Local/preview keeps the staff
 * bypass so `/admin` is clickable. Production Vercel (this sample
 * deploy) serves the full builtin room instead of 404ing every
 * `/docs/[slug]` — that is the public Acme walkthrough.
 */
export function unconfiguredDataRoomAccess(
  nodeEnv: string | undefined,
): AuthenticatedDataRoomContext {
  return nodeEnv === "production" ? publicDemoDataRoomContext() : developmentStaffContext();
}

export async function resolveAuthenticatedDataRoomContext(): Promise<AuthenticatedDataRoomContext> {
  if (!isSupabaseConfigured()) {
    return unconfiguredDataRoomAccess(process.env.NODE_ENV);
  }

  try {
    const { createClient } = await import("@/utils/supabase/server");
    const authClient = await createClient();
    const {
      data: { user },
      error,
    } = await authClient.auth.getUser();
    if (error || !user?.email || !user.email_confirmed_at) {
      return { status: "unauthenticated" };
    }
    return {
      status: "allowed",
      email: user.email,
      context: await resolveDataRoomVariantForEmail(user.email),
    };
  } catch {
    return { status: "unavailable" };
  }
}

export function canAccessDataRoomDocument(
  context: DataRoomVariantContext,
  documentSlug: string,
): boolean {
  return context.staffBypass || context.variant.documents.has(documentSlug);
}

export function canAccessDataRoomAsset(
  context: DataRoomVariantContext,
  documentSlug: string,
  assetPath: string,
): boolean {
  if (context.staffBypass) return true;
  const document = context.variant.documents.get(documentSlug);
  if (!document || !validRelativeAssetPath(assetPath)) return false;
  if (document.assetPolicy === "all") return true;
  if (document.assetPolicy === "none") return false;
  return document.allowedAssets.has(assetPath);
}

export function formatVariantRaiseAmount(raiseAmountCents: number): string {
  const dollars = raiseAmountCents / 100;
  const millions = dollars / 1_000_000;
  return `$${Number.isInteger(millions) ? millions.toFixed(0) : millions.toFixed(1)}M`;
}
