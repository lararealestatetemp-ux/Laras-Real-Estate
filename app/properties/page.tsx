import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Properties for Sale",
  description: "View property listings from Laras Real Estate.",
  path: "/properties",
});

export default function PropertiesPage() {
  return (
    <section>
      <h1>Properties for Sale</h1>
      <p>Property listings will be available on this page.</p>
    </section>
  );
}
