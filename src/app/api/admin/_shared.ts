import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSuperadminEmail,
  isApprovedAdmin,
  isSuperadmin,
  normalizeAdminEmail,
} from "@/lib/admin-emails";

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function isLocalhost(): Promise<boolean> {
  if (process.env.NODE_ENV === "production") return false;
  const host = (await headers()).get("host") || "";
  return host.includes("localhost") || host.includes("127.0.0.1");
}

/**
 * Admin API auth contract.
 *
 * Browser → Supabase session cookie
 * Route → getUser() → isApprovedAdmin(email)
 * Data → service-role client (bypasses RLS)
 * Actor identity is returned separately because service-role JWTs do not
 * carry the browser session.
 */
export async function getAdminSupabase(): Promise<{
  supabase: SupabaseClient;
  actorEmail: string | null;
  actorIsSuperadmin: boolean;
  error: NextResponse | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      supabase: null as never,
      actorEmail: null,
      actorIsSuperadmin: false,
      error: NextResponse.json({ error: "Database not configured" }, { status: 503 }),
    };
  }

  if (await isLocalhost()) {
    const { createAdminClient } = await import("@/utils/supabase/server");
    return {
      supabase: createAdminClient(),
      actorEmail: getSuperadminEmail(),
      actorIsSuperadmin: true,
      error: null,
    };
  }

  const { createClient } = await import("@/utils/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const actorEmail = normalizeAdminEmail(user?.email);
  if (!actorEmail || !user?.email_confirmed_at) {
    return {
      supabase: null as never,
      actorEmail: null,
      actorIsSuperadmin: false,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!(await isApprovedAdmin(actorEmail, supabase))) {
    return {
      supabase: null as never,
      actorEmail: null,
      actorIsSuperadmin: false,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { createAdminClient } = await import("@/utils/supabase/server");
  return {
    supabase: createAdminClient(),
    actorEmail,
    actorIsSuperadmin: isSuperadmin(actorEmail),
    error: null,
  };
}
