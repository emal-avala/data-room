import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { viewerEmailForLookup } from "@/lib/watermark";

export type AuthenticatedViewerResult =
  | {
      ok: true;
      supabase: SupabaseClient;
      viewerId: string;
      email: string;
    }
  | {
      ok: false;
      status: 401 | 500;
      error: string;
    };

/**
 * Resolve the service-role viewer record from the authenticated Supabase user.
 * Callers must never accept an email or viewer ID from the request body.
 */
export async function resolveAuthenticatedViewer(): Promise<AuthenticatedViewerResult> {
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();
  if (authError || !user?.email) {
    return { ok: false, status: 401, error: "Authentication required" };
  }

  const supabase = createAdminClient();
  const email = viewerEmailForLookup(user.email);
  const { data: existing, error: lookupError } = await supabase
    .from("viewers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    return { ok: false, status: 500, error: "Failed to resolve viewer" };
  }

  if (existing) {
    await supabase
      .from("viewers")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", existing.id);
    return { ok: true, supabase, viewerId: existing.id, email };
  }

  const name =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;
  const { data: created, error: createError } = await supabase
    .from("viewers")
    .insert({ email, name, metadata: { source: "auth" } })
    .select("id")
    .single();

  if (createError || !created) {
    const { data: racedViewer } = await supabase
      .from("viewers")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (racedViewer) {
      return { ok: true, supabase, viewerId: racedViewer.id, email };
    }
    return { ok: false, status: 500, error: "Failed to resolve viewer" };
  }

  return { ok: true, supabase, viewerId: created.id, email };
}
