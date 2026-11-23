import { notFound } from "next/navigation";

import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Property Details",
  description: "View property details from Laras Real Estate.",
  path: "/properties",
});

export default function PropertyPage() {
  notFound();
}
