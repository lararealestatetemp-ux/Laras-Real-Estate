const DEVELOPMENT_SITE_URL = "http://localhost:3000";

/**
 * Canonical origin for metadata, sitemap, and robots. Set
 * NEXT_PUBLIC_SITE_URL in production; the localhost fallback is for local dev.
 */
export function normalizeSiteUrl(value: string | undefined): string {
  const trimmed = value?.trim().replace(/\/+$/, "");

  return trimmed ? trimmed : DEVELOPMENT_SITE_URL;
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function absoluteUrl(path: string): string {
  if (path === "" || path === "/") {
    return SITE_URL;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
