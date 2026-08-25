import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isEmailApproved, isInternalEmail } from "@/lib/approved-emails";
import { isApprovedAdmin } from "@/lib/admin-emails";
import { isInternalApiPath } from "@/lib/internal-auth";
import { isPublicChunk } from "@/lib/chunk-gate";
import { capturedNextPath, sanitizeNextPath, withNextPath } from "@/lib/next-path";
import { isSupabaseConfigured } from "./config";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  const host = request.headers.get("host") || "";
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return NextResponse.next({ request });
  }

  if (request.nextUrl.pathname.startsWith("/_next/static/chunks/")) {
    if (isPublicChunk(request.nextUrl.pathname)) {
      return NextResponse.next({ request });
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }>,
        ) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requestedNext = capturedNextPath(request);

  if (pathname === "/login" && request.method === "POST") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url, 303);
  }

  if (isInternalApiPath(pathname)) {
    return supabaseResponse;
  }

  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/auth/") ||
    pathname === "/api/access";

  if (isPublicRoute) {
    return supabaseResponse;
  }

  if (pathname === "/pending-approval") {
    if (!user) {
      return supabaseResponse;
    }

    const heldNext = sanitizeNextPath(request.nextUrl.searchParams.get("next"));
    const approvedDestination = () => {
      const url = request.nextUrl.clone();
      url.search = "";
      if (heldNext) {
        const target = new URL(heldNext, request.nextUrl.origin);
        url.pathname = target.pathname;
        url.search = target.search;
        url.hash = target.hash;
      } else {
        url.pathname = "/";
      }
      return NextResponse.redirect(url);
    };

    const email = user.email;
    const emailVerified = !!user.email_confirmed_at;
    if (
      email &&
      emailVerified &&
      (isInternalEmail(email) ||
        isEmailApproved(email) ||
        (await isApprovedAdmin(email, supabase)))
    ) {
      return approvedDestination();
    }

    if (email && emailVerified) {
      const { data: accessRequest } = await supabase
        .from("access_requests")
        .select("status")
        .eq("email", email.toLowerCase())
        .single();

      if (accessRequest?.status === "approved") {
        return approvedDestination();
      }
    }

    return supabaseResponse;
  }

  const loginRedirect = () => {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(withNextPath(url, requestedNext));
  };

  if (!user) {
    return loginRedirect();
  }

  const email = user.email;
  if (!email) {
    return loginRedirect();
  }

  // Require a verified email before honoring any auto-approve. Email/password
  // signup can mint an unverified address that matches the internal domain.
  const emailVerified = !!user.email_confirmed_at;

  if (emailVerified && isInternalEmail(email)) {
    return supabaseResponse;
  }

  if (emailVerified && isEmailApproved(email)) {
    return supabaseResponse;
  }

  if (emailVerified && (await isApprovedAdmin(email, supabase))) {
    return supabaseResponse;
  }

  const { data: accessRequest } = await supabase
    .from("access_requests")
    .select("status")
    .eq("email", email.toLowerCase())
    .single();

  if (emailVerified && accessRequest?.status === "approved") {
    return supabaseResponse;
  }

  const url = request.nextUrl.clone();
  url.pathname = "/pending-approval";
  url.search = "";
  url.searchParams.set("email", email);
  return NextResponse.redirect(withNextPath(url, requestedNext));
}
