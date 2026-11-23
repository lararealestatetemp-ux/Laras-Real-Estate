import { BUSINESS_PHONE } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Contact Laras Real Estate.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section>
      <h1>Contact Laras Real Estate</h1>
      <p>Call {BUSINESS_PHONE} or use the form on this page.</p>
    </section>
  );
}
