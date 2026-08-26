import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isAdminBackendConfigured } from "@/lib/admin-backend";
import { DEMO_ADMIN_EMAIL } from "@/lib/analytics/demo-data";
import {
  getSuperadminEmail,
  isApprovedAdmin,
  isSuperadmin,
  normalizeAdminEmail,
} from "@/lib/admin-emails";

export function isSupabaseConfigured(): boolean {
  return isAdminBackendConfigured();
}

export async function isLocalhost(): Promise<boolean> {
  if (process.env.NODE_ENV === "production") return false;
  const host = (await headers()).get("host") || "";
  return host.includes("localhost") || host.includes("127.0.0.1");
}

export type AdminSession =
  | {
      demo: true;
      supabase: null;
      actorEmail: string;
      actorIsSuperadmin: boolean;
      error: null;
    }
  | {
      demo: false;
      supabase: SupabaseClient;
      actorEmail: string | null;
      actorIsSuperadmin: boolean;
      error: null;
    }
  | {
      demo: false;
      supabase: null;
      actorEmail: null;
      actorIsSuperadmin: false;
      error: NextResponse;
    };

/**
 * Admin API auth contract.
 *
 * Unconfigured backend → sample analytics (public Vercel walkthrough).
 * Browser → Supabase session cookie
 * Route → getUser() → isApprovedAdmin(email)
 * Data → service-role client (bypasses RLS)
 * Actor identity is returned separately because service-role JWTs do not
 * carry the browser session.
 */
export async function getAdminSupabase(): Promise<AdminSession> {
  if (!isAdminBackendConfigured()) {
    return {
      demo: true,
      supabase: null,
      actorEmail: DEMO_ADMIN_EMAIL,
      actorIsSuperadmin: false,
      error: null,
    };
  }

  if (await isLocalhost()) {
    const { createAdminClient } = await import("@/utils/supabase/server");
    return {
      demo: false,
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
      demo: false,
      supabase: null,
      actorEmail: null,
      actorIsSuperadmin: false,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!(await isApprovedAdmin(actorEmail, supabase))) {
    return {
      demo: false,
      supabase: null,
      actorEmail: null,
      actorIsSuperadmin: false,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { createAdminClient } = await import("@/utils/supabase/server");
  return {
    demo: false,
    supabase: createAdminClient(),
    actorEmail,
    actorIsSuperadmin: isSuperadmin(actorEmail),
    error: null,
  };
}

export function jsonDemo<T extends Record<string, unknown>>(body: T) {
  return NextResponse.json({ ...body, demo: true });
}
