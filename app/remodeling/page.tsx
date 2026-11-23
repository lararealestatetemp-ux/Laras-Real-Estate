import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { BUSINESS_PHONE, BUSINESS_PHONE_TEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/page-sections.module.css";

export const metadata = buildPageMetadata({
  title: "Remodeling",
  description: "Request a remodeling consultation from Laras Real Estate.",
  path: "/remodeling",
});

export default function RemodelingPage() {
  return (
    <section className={`${styles.section} ${styles.twoColumn}`}>
      <div className={styles.copy}>
        <h1>Remodeling</h1>
        <p>
          Planning an update to your home? Tell us about your project and
          request a consultation.
        </p>
        <p>
          You can also call{" "}
          <a className={styles.phoneLink} href={BUSINESS_PHONE_TEL}>
            {BUSINESS_PHONE}
          </a>
          .
        </p>
      </div>
      <div className={styles.formPanel} id="consultation">
        <h2>Request a consultation</h2>
        <ConsultationForm />
      </div>
    </section>
  );
}
