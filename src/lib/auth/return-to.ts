/**
 * Validates and sanitizes a returnTo redirect URL to prevent Open Redirect vulnerabilities.
 * Only relative paths within the same application are accepted.
 *
 * Valid examples:
 * - "/dashboard"
 * - "/jobs/123"
 * - "/applications?status=shortlisted"
 *
 * Invalid examples (rejected and redirected to fallback):
 * - "https://evil.com"
 * - "//evil.com"
 * - "/\\evil.com"
 * - "javascript:alert(1)"
 */
export function getSafeReturnTo(
  target?: string | null,
  fallback = "/dashboard",
): string {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  const trimmed = target.trim();

  // Must start with a single slash
  if (!trimmed.startsWith("/")) {
    return fallback;
  }

  // Reject protocol-relative URLs (e.g. //evil.com) or backslash evasion (/\evil.com)
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return fallback;
  }

  // Reject schemes embedded before query or path segments (e.g., /http: or javascript:)
  if (trimmed.includes(":") && !trimmed.includes("?")) {
    return fallback;
  }

  return trimmed;
}

export default getSafeReturnTo;
