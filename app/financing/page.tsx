import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Financing",
  description: "Find financing information from Laras Real Estate.",
  path: "/financing",
});

export default function FinancingPage() {
  return (
    <section>
      <h1>Financing</h1>
      <p>Financing information will be available on this page.</p>
    </section>
  );
}
