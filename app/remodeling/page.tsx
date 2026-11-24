import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { BeforeAfterCarousel } from "@/components/remodeling/BeforeAfterCarousel";
import { ServicesList } from "@/components/remodeling/ServicesList";
import { PageHero } from "@/components/ui/PageHero";
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
        imageSrc="/images/remodeling-hero-stock.jpg"
        imageAlt="Development placeholder stock photo: renovated interior living space"
      />

      <section className={styles.mainSection} aria-label="Services and consultation">
        <div className={styles.leftColumn}>
          <div className={styles.servicesColumn}>
            <h2 id="services-title">Our Services</h2>
            <p className={styles.servicesNote}>
              Provisional service categories for planning. Final offerings
              require owner approval.
            </p>
            <ServicesList services={REMODELING_SERVICE_PLACEHOLDERS} />
          </div>

          <div className={styles.beforeAfterBlock} aria-labelledby="examples-title">
            <h2 id="examples-title">Before &amp; After</h2>
            <p className={styles.disclosure}>
              Placeholder imagery — not completed Laras Real Estate projects
            </p>
            <BeforeAfterCarousel pairs={BEFORE_AFTER_PLACEHOLDERS} />
          </div>
        </div>

        <aside
          className={styles.formPanel}
          id="consultation"
          aria-labelledby="consultation-title"
        >
          <div className={styles.formIntro}>
            <h2 id="consultation-title">Request Consultation</h2>
            <p>Tell us about your project and we will get back to you.</p>
          </div>
          <ConsultationForm />
        </aside>
      </section>
    </div>
  );
}
