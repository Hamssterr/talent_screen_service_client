import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Todo 00 Baseline Middleware.
 *
 * Checks presence of temporary access-token cookie to redirect authenticated users away from public auth pages.
 * Does NOT check roles/permissions (deferred to Todo 02).
 * Does NOT block candidate public routes (/interview/*).
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Public authentication routes
  const publicAuthRoutes = [
    "/auth/login",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/activate-account",
  ];

  // If user has an access token and visits login page, redirect to home
  if (token && publicAuthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|asset/).*)",
  ],
};
