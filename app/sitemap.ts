import type { MetadataRoute } from "next";

import { getAvailableProperties } from "@/lib/properties/queries";
import { absoluteUrl } from "@/lib/site";

const ROUTES = [
  "",
  "/sell",
  "/properties",
  "/remodeling",
  "/financing",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const propertyPaths = getAvailableProperties().map(
    (property) => `/properties/${property.slug}`,
  );

  return [...ROUTES, ...propertyPaths].map((path) => ({
    url: absoluteUrl(path),
  }));
}
