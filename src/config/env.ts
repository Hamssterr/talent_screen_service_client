/**
 * Environment configuration and validation.
 *
 * Provides typed, validated access to environment variables.
 * In development, defaults strictly to NestJS local backend (http://localhost:3000/api/v1).
 */

const DEFAULT_DEV_API_URL = "http://localhost:3000/api/v1";

function resolveApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!envUrl) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[Config] NEXT_PUBLIC_API_URL is not set in production. Ensure environment is configured properly.",
      );
    }
    return DEFAULT_DEV_API_URL;
  }

  // Normalize URL - remove trailing slash
  const cleanUrl = envUrl.replace(/\/+$/, "");

  // Validation: Must start with http:// or https://
  if (!/^https?:\/\//i.test(cleanUrl)) {
    console.error(
      `[Config] Invalid NEXT_PUBLIC_API_URL: "${envUrl}". Falling back to default: ${DEFAULT_DEV_API_URL}`,
    );
    return DEFAULT_DEV_API_URL;
  }

  return cleanUrl;
}

export const env = {
  apiBaseUrl: resolveApiBaseUrl(),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;
