import { createAdminClient, createClient } from "@/utils/supabase/server";
import type { Document } from "@/lib/documents";

export type DocumentNdaAccess = "not_required" | "signed" | "unsigned" | "unauthenticated";

export async function hasCanonicalNdaEvidence(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  email: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("nda_signature_evidence")
    .select("id")
    .eq("signer_email", email.toLowerCase())
    .limit(1);
  return !!data && data.length > 0;
}

export async function getDocumentNdaAccess(
  document: Document,
): Promise<DocumentNdaAccess> {
  if (!document.requireNda) return "not_required";

  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (!user?.email) return "unauthenticated";

    const admin = createAdminClient();
    const signed = await hasCanonicalNdaEvidence(admin, user.email);
    return signed ? "signed" : "unsigned";
  } catch {
    return "unauthenticated";
  }
}
