import { FinancingInquiryForm } from "@/components/forms/FinancingInquiryForm";
import { PageHero } from "@/components/ui/PageHero";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/page-sections.module.css";

export const metadata = buildPageMetadata({
  title: "Financing",
  description:
    "Ask Laras Real Estate about financing that may be available on selected properties and projects.",
  path: "/financing",
});

export default function FinancingPage() {
  return (
    <>
      <PageHero
        title="Financing"
        description="Ask about financing that may be available for a property or project you are considering."
      />
      <section
        className={`${styles.section} ${styles.twoColumn}`}
        aria-labelledby="financing-details-title"
      >
        <div className={styles.copy}>
          <h2 id="financing-details-title">Availability varies</h2>
          <p>
            Financing may be available on selected properties and projects.
          </p>
          <p>Owner financing may be available on select listings.</p>
          <p>
            Send an inquiry with the property or project you are considering.
          </p>
        </div>
        <div className={styles.formPanel} id="financing-inquiry">
          <h2>Ask about financing</h2>
          <FinancingInquiryForm />
        </div>
      </section>
    </>
  );
}
