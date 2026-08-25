import { updateSession } from "@/utils/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

const PAGE_ROUTES_ALLOWING_POST = ["/login", "/pending-approval"];

export async function middleware(request: NextRequest) {
  if (request.method === "POST") {
    const pathname = request.nextUrl.pathname;
    if (
      PAGE_ROUTES_ALLOWING_POST.some(
        (route) => pathname === route || pathname === route + "/",
      )
    ) {
      const url = request.nextUrl.clone();
      url.search = "";
      return NextResponse.redirect(url, 303);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/_next/static/chunks/:path*.js",
    "/((?!_next/static|_next/image|favicon.ico|api/og|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)",
  ],
};
