import { SellerForm } from "@/components/forms/SellerForm";
import { BUSINESS_PHONE, BUSINESS_PHONE_TEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/page-sections.module.css";

export const metadata = buildPageMetadata({
  title: "Sell Your Property",
  description:
    "Request a cash-purchase evaluation for a house, land, or commercial building with Laras Real Estate.",
  path: "/sell",
});

export default function SellPage() {
  return (
    <section className={`${styles.section} ${styles.twoColumn}`}>
      <div className={styles.copy}>
        <h1>Sell Your Property for Cash</h1>
        <p>
          We evaluate houses, land, and commercial buildings. Tell us about
          your property and we will follow up with next steps.
        </p>
        <h2>How it works</h2>
        <ol>
          <li>Submit the form with your property details.</li>
          <li>We review the information and contact you to discuss it.</li>
          <li>If it is a fit, we talk through the next steps together.</li>
        </ol>
        <p>
          Prefer to talk first? Call{" "}
          <a className={styles.phoneLink} href={BUSINESS_PHONE_TEL}>
            {BUSINESS_PHONE}
          </a>
          .
        </p>
      </div>
      <div className={styles.formPanel} id="sell-form">
        <h2>Request information</h2>
        <SellerForm />
      </div>
    </section>
  );
}
