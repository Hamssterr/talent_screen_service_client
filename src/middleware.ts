import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware (Todo 02 Strategy).
 *
 * Security & Architecture Strategy:
 * 1. Access tokens are stored strictly in memory (access-token-store.ts), eliminating persistent XSS exfiltration risks.
 * 2. Refresh tokens are stored in NestJS backend HttpOnly cookies across origins.
 * 3. Next.js Edge Middleware cannot and MUST NOT inspect in-memory runtime session tokens.
 * 4. Internal Workspace protection is strictly enforced by SessionProvider + AuthGate in the (workspace) layout.
 * 5. Candidate public interview routes (/interview/*) and public auth routes are never blocked.
 * 6. NestJS backend JWTAuthGuard + PermissionsGuard enforce definitive access control on every API request.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Forward request with standard security headers
  response.headers.set("x-pathname", request.nextUrl.pathname);

  return response;
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
