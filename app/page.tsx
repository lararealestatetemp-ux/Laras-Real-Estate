import { ContactCTA } from "@/components/ui/ContactCTA";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { BUSINESS_NAME, TAGLINE } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/home.module.css";

export const metadata = buildPageMetadata({
  title: "Home",
  description: TAGLINE,
  path: "/",
});

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <h1 id="home-title">{BUSINESS_NAME}</h1>
          <p className={styles.tagline}>{TAGLINE}</p>
          <p className={styles.supporting}>
            Real solutions for buyers, sellers, and investors.
          </p>
          <div className={styles.actions}>
            <PrimaryButton href="/sell">Sell Your Property</PrimaryButton>
            <SecondaryButton href="/properties">
              View Available Properties
            </SecondaryButton>
          </div>
        </div>
        <aside className={styles.heroMarker}>
          <p>Property services for where you are and what comes next.</p>
        </aside>
      </section>

      <div className={styles.servicesWrap}>
        <section
          className={styles.section}
          aria-labelledby="services-title"
          aria-label="Ways we can help"
        >
          <h2 id="services-title">Ways we can help</h2>
          <div className={styles.serviceGrid}>
            <ServiceCard
              title="Sell a property"
              description="Share your property details and start a conversation about selling."
              href="/sell"
              linkLabel="Sell Your Property"
            />
            <ServiceCard
              title="Find a property"
              description="Browse the available properties currently listed on the site."
              href="/properties"
              linkLabel="View Available Properties"
            />
            <ServiceCard
              title="Plan a remodel"
              description="Tell us about the updates you are considering for your home."
              href="/remodeling"
              linkLabel="Explore Remodeling"
            />
            <ServiceCard
              title="Review financing"
              description="Learn about the financing information available through Laras Real Estate."
              href="/financing"
              linkLabel="Learn About Financing"
            />
          </div>
        </section>
      </div>

      <section className={`${styles.section} ${styles.intro}`}>
        <h2>Building Better Opportunities</h2>
        <p>
          Laras Real Estate connects property sales, available listings,
          remodeling conversations, and financing information in one place so
          you can choose the service that fits your plans.
        </p>
      </section>

      <section
        className={styles.remodeling}
        aria-labelledby="remodeling-preview-title"
      >
        <div
          className={styles.placeholder}
          role="img"
          aria-label="Remodeling project image placeholder"
        >
          Remodeling project imagery
        </div>
        <div className={styles.remodelingCopy}>
          <h2 id="remodeling-preview-title">Reimagine your home</h2>
          <p>
            Considering a home update? Describe your project and request a
            remodeling consultation.
          </p>
          <PrimaryButton href="/remodeling">
            Request a Remodeling Consultation
          </PrimaryButton>
        </div>
      </section>

      <ContactCTA />
    </div>
  );
}
