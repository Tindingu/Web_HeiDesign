import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { ADMIN_SESSION_COOKIE, getAdminSessionValue } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (sessionCookie !== getAdminSessionValue()) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const result = rateLimit(ip);

  if (!result.allowed) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin", "/admin/:path*"],
};
