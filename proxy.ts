import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

/**
 * Optimistic guard for /admin/*: redirects to /admin/login if there is no
 * valid session cookie. This is a UX fast path only — it avoids a flash of
 * admin UI before redirecting — NOT the real authorization boundary.
 * Every protected layout/page/Server Action re-verifies via
 * requireAdmin() in lib/dal.ts, since Proxy is not a full auth solution
 * (it doesn't cover Server Function POSTs to other routes, and shouldn't
 * be trusted with anything beyond a redirect).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const cookie = request.cookies.get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.adminId) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
