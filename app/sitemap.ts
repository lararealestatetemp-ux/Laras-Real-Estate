import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const ROUTES = [
  "",
  "/sell",
  "/properties",
  "/remodeling",
  "/financing",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
