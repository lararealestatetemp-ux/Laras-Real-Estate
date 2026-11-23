import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Sell Your Property",
  description:
    "Request a cash-purchase evaluation for a house, land, or commercial building with Laras Real Estate.",
  path: "/sell",
});

export default function SellPage() {
  return (
    <section>
      <h1>Sell Your Property for Cash</h1>
      <p>
        We evaluate houses, land, and commercial buildings. Use the form on
        this page to request information.
      </p>
    </section>
  );
}
