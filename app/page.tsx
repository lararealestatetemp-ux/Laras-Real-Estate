import { BUSINESS_NAME, TAGLINE } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Home",
  description: TAGLINE,
  path: "/",
});

export default function Home() {
  return (
    <section>
      <h1>{BUSINESS_NAME}</h1>
      <p>{TAGLINE}</p>
    </section>
  );
}
