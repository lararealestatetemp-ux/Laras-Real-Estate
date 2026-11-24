import Image from "next/image";
import {
  ClipboardText,
  House,
  Star,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

import { FinancingInquiryForm } from "@/components/forms/FinancingInquiryForm";
import { PageHero } from "@/components/ui/PageHero";
import { getAvailableProperties } from "@/lib/properties/queries";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/financing.module.css";

export const metadata = buildPageMetadata({
  title: "Financing",
  description:
    "Ask Laras Real Estate about financing that may be available on selected properties and projects.",
  path: "/financing",
});

const FINANCING_HIGHLIGHTS = [
  {
    icon: House,
    title: "Owner Financing",
    description: "Available on select properties.",
  },
  {
    icon: ClipboardText,
    title: "Simple Process",
    description: "Straightforward application.",
  },
  {
    icon: UsersThree,
    title: "Selective Projects",
    description: "Ask us if your project qualifies.",
  },
  {
    icon: Star,
    title: "Personalised Support",
    description: "We're here to help.",
  },
] as const;

export default function FinancingPage() {
  const properties = getAvailableProperties().map((property) => ({
    slug: property.slug,
    title: property.title,
  }));

  return (
    <>
      <PageHero
        title="Financing"
        description="Ask about financing that may be available for a property or project you are considering."
        imageSrc="/images/financing-hero-stock.jpg"
        imageAlt="Development placeholder stock photo: residential home exterior"
      />

      <section
        className={styles.section}
        aria-label="Financing details and inquiry"
      >
        <div className={styles.layout}>
          <div className={styles.leftColumn}>
            <ul className={styles.highlightList}>
              {FINANCING_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
                <li key={title} className={styles.highlightItem}>
                  <span className={styles.highlightIcon} aria-hidden="true">
                    <Icon weight="duotone" size={72} />
                  </span>
                  <div>
                    <p className={styles.highlightTitle}>{title}</p>
                    <p className={styles.highlightDescription}>{description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <aside className={styles.promo} aria-labelledby="financing-promo-title">
              <div className={styles.promoImageWrap}>
                <Image
                  className={styles.promoImage}
                  src="/images/about-kitchen-stock.jpg"
                  alt="Development placeholder stock photo: bright kitchen interior"
                  fill
                  sizes="(max-width: 48rem) 100vw, 22rem"
                />
              </div>
              <div className={styles.promoCopy}>
                <h2 id="financing-promo-title">Let&apos;s Build Your Future</h2>
                <p>
                  We believe in helping the right people find the right
                  opportunities.
                </p>
              </div>
            </aside>
          </div>

          <div className={styles.formPanel} id="financing-inquiry">
            <div className={styles.formIntro}>
              <h2>Interested in Financing?</h2>
              <p>
                Get started by contacting us or visiting our financing
                application.
              </p>
            </div>
            <FinancingInquiryForm properties={properties} />
          </div>
        </div>
      </section>
    </>
  );
}
