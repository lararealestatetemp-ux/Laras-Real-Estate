import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { BeforeAfterPair } from "@/components/remodeling/BeforeAfterPair";
import { ServicesList } from "@/components/remodeling/ServicesList";
import { PageHero } from "@/components/ui/PageHero";
import { BUSINESS_PHONE, BUSINESS_PHONE_TEL } from "@/lib/constants";
import {
  BEFORE_AFTER_PLACEHOLDERS,
  REMODELING_SERVICE_PLACEHOLDERS,
} from "@/lib/remodeling/placeholders";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/remodeling.module.css";

export const metadata = buildPageMetadata({
  title: "Remodeling",
  description: "Request a remodeling consultation from Laras Real Estate.",
  path: "/remodeling",
});

export default function RemodelingPage() {
  return (
    <div className={styles.page}>
      <PageHero
        title="Remodeling"
        description="Explore provisional service categories and request a consultation about the updates you are considering."
      />

      <section className={styles.section} aria-labelledby="services-title">
        <div className={styles.sectionHeader}>
          <h2 id="services-title">Services under consideration</h2>
          <p>
            These placeholder service categories are shown for planning and
            require owner approval before they are presented as available
            services.
          </p>
        </div>
        <ServicesList services={REMODELING_SERVICE_PLACEHOLDERS} />
      </section>

      <section className={styles.section} aria-labelledby="examples-title">
        <div className={styles.sectionHeader}>
          <h2 id="examples-title">Before and after examples</h2>
          <p>
            The following images demonstrate the intended presentation only.
          </p>
        </div>
        {BEFORE_AFTER_PLACEHOLDERS.map((pair) => (
          <BeforeAfterPair
            key={pair.id}
            before={pair.before}
            after={pair.after}
          />
        ))}
      </section>

      <section
        className={styles.consultation}
        aria-labelledby="consultation-title"
      >
        <div className={styles.consultationCopy}>
          <h2 id="consultation-title">Request a consultation</h2>
          <p>
            Tell us about the project you are considering and how to reach you.
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
          <ConsultationForm />
        </div>
      </section>
    </div>
  );
}
