import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { appendNextPath, sanitizeNextPath } from "@/lib/next-path";

function getRedirectBase(request: Request, origin: string): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (process.env.NODE_ENV === "development" || !forwardedHost) {
    return origin;
  }
  return `https://${forwardedHost}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = sanitizeNextPath(searchParams.get("next"));
  const next = nextPath ?? "/login";
  const redirectBase = getRedirectBase(request, origin);

  const errorRedirect = (errorParam: string) =>
    NextResponse.redirect(
      appendNextPath(`${redirectBase}/login?error=${errorParam}`, nextPath),
    );

  const oauthError = searchParams.get("error");
  if (oauthError) {
    const errorParam = oauthError === "access_denied" ? "access_denied" : "auth_failed";
    return errorRedirect(errorParam);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${redirectBase}${next}`);
      }
      const isExpired =
        error.message?.toLowerCase().includes("expired") ||
        error.message?.toLowerCase().includes("invalid") ||
        error.message?.toLowerCase().includes("already used") ||
        error.status === 403;
      return errorRedirect(isExpired ? "auth_expired" : "auth_failed");
    } catch {
      return errorRedirect("auth_failed");
    }
  }

  return errorRedirect("auth_failed");
}
