import { getCookie, setCookie, deleteCookie } from "cookies-next";

const ACCESS_TOKEN_COOKIE_NAME = "accessToken";

/**
 * Isolated access token storage boundary.
 *
 * NOTE: For Todo 00, access token is temporarily stored in a JS-readable cookie so Next.js middleware
 * can perform basic routing checks. Role/permission is NEVER stored in cookie.
 * Refresh tokens are strictly handled by NestJS HttpOnly cookies and NEVER accessed via JavaScript.
 * This boundary will be evaluated and migrated in Todo 02 (in-memory session / server session strategy).
 */
export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    const token = getCookie(ACCESS_TOKEN_COOKIE_NAME);
    return typeof token === "string" && token.length > 0 ? token : null;
  },

  setAccessToken(token: string): void {
    if (typeof window === "undefined") return;
    setCookie(ACCESS_TOKEN_COOKIE_NAME, token, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });
  },

  clearAccessToken(): void {
    if (typeof window === "undefined") return;
    deleteCookie(ACCESS_TOKEN_COOKIE_NAME, {
      path: "/",
    });
  },
};
