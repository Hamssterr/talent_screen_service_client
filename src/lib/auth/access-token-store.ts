/**
 * In-Memory Access Token Storage Boundary.
 *
 * Security & Session Strategy (Todo 02):
 * - Access tokens are kept strictly in memory runtime.
 * - NEVER persisted to localStorage or JS-readable cookies (mitigating persistent XSS exfiltration).
 * - Refresh tokens are strictly managed by NestJS backend via HttpOnly cookies.
 * - Upon page reload, SessionProvider executes single-flight silent refresh via POST /auth/refresh.
 */

let inMemoryAccessToken: string | null = null;

export const accessTokenStore = {
  getAccessToken(): string | null {
    return inMemoryAccessToken;
  },

  setAccessToken(token: string): void {
    inMemoryAccessToken = token;
  },

  clearAccessToken(): void {
    inMemoryAccessToken = null;
  },
};

export default accessTokenStore;
