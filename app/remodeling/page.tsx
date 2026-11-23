import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Remodeling",
  description: "Find remodeling information from Laras Real Estate.",
  path: "/remodeling",
});

export default function RemodelingPage() {
  return (
    <section>
      <h1>Remodeling</h1>
      <p>Remodeling information will be available on this page.</p>
    </section>
  );
}
