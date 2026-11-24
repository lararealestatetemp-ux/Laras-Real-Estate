import Image from "next/image";
import {
  Hammer,
  Handshake,
  Heart,
  Home as HomeIcon,
  KeyRound,
  ShieldCheck,
  Users,
} from "lucide-react";

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
        <div className={styles.heroMedia}>
          <Image
            className={styles.heroImage}
            src="/images/hero-home-stock.jpg"
            alt="Development placeholder stock photo: modern home exterior at twilight"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 id="home-title">{BUSINESS_NAME}</h1>
            <p className={styles.tagline}>{TAGLINE}</p>
            <div className={styles.heroRule} aria-hidden="true" />
            <p className={styles.supporting}>
              Real Solutions for Buyers, Sellers, and Better Living.
            </p>
            <div className={styles.actions}>
              <PrimaryButton href="/sell">Sell Your Property →</PrimaryButton>
              <SecondaryButton
                className={styles.heroSecondary}
                href="/properties"
              >
                View Available Properties →
              </SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.servicesWrap}>
        <section
          className={styles.section}
          aria-labelledby="services-title"
          aria-label="Ways we can help"
        >
          <h2 id="services-title" className={styles.visuallyHidden}>
            Ways we can help
          </h2>
          <div className={styles.serviceGrid}>
            <ServiceCard
              icon={HomeIcon}
              title="Sell Your Property for Cash"
              description="Sell your house, land, or commercial building quickly and easily."
              href="/sell"
              linkLabel="Get Started →"
            />
            <ServiceCard
              icon={KeyRound}
              title="Properties for Sale"
              description="Explore our available properties, including owner financing options."
              href="/properties"
              linkLabel="View Properties →"
            />
            <ServiceCard
              icon={Hammer}
              title="Remodeling Services"
              description="Quality remodeling to reimagine your space."
              href="/remodeling"
              linkLabel="Learn More →"
            />
            <ServiceCard
              icon={Handshake}
              title="Financing Available"
              description="Financing options for selective projects."
              href="/financing"
              linkLabel="Explore Financing →"
            />
          </div>
        </section>
      </div>

      <section
        className={`${styles.section} ${styles.intro}`}
        aria-labelledby="about-title"
      >
        <div className={styles.introMedia}>
          <Image
            className={styles.introImage}
            src="/images/about-kitchen-stock.jpg"
            alt="Development placeholder stock photo: modern kitchen interior"
            fill
            sizes="(max-width: 48rem) 100vw, 50vw"
          />
        </div>
        <div className={styles.introCopy}>
          <p className={styles.introEyebrow}>About Us</p>
          <h2 id="about-title">Building Better Opportunities</h2>
          <p>
            Laras Real Estate helps homeowners, buyers, and investors move
            forward with selling, buying, remodeling, or financing, all in one
            place so you can choose the path that fits your plans.
          </p>
          <PrimaryButton href="/contact">Contact Us →</PrimaryButton>
          <ul className={styles.introValues}>
            <li>
              <Users className={styles.introValueIcon} aria-hidden="true" />
              <span>Local Expertise</span>
            </li>
            <li>
              <ShieldCheck
                className={styles.introValueIcon}
                aria-hidden="true"
              />
              <span>Trusted &amp; Reliable</span>
            </li>
            <li>
              <Heart className={styles.introValueIcon} aria-hidden="true" />
              <span>Community Focused</span>
            </li>
          </ul>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.remodeling}`}
        aria-labelledby="remodeling-preview-title"
      >
        <div className={styles.remodelingCopy}>
          <p className={styles.remodelingEyebrow}>Our Work</p>
          <h2 id="remodeling-preview-title">Before &amp; After</h2>
          <p>See the difference a fresh perspective can make.</p>
          <SecondaryButton
            className={styles.remodelingOutline}
            href="/remodeling"
          >
            View More Projects →
          </SecondaryButton>
        </div>
        <div className={styles.beforeAfter}>
          <figure className={styles.beforeAfterItem}>
            <span className={styles.beforeLabel}>Before</span>
            <Image
              className={styles.beforeAfterImage}
              src="/images/remodeling-before-stock.jpg"
              alt="Development placeholder: kitchen before remodel of the same property"
              width={960}
              height={640}
            />
          </figure>
          <figure className={styles.beforeAfterItem}>
            <span className={`${styles.beforeLabel} ${styles.afterLabel}`}>
              After
            </span>
            <Image
              className={styles.beforeAfterImage}
              src="/images/remodeling-after-stock.jpg"
              alt="Development placeholder: kitchen after remodel of the same property"
              width={960}
              height={640}
            />
          </figure>
        </div>
      </section>

      <ContactCTA />
    </div>
  );
}
