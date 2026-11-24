import Image from "next/image";
import {
  CurrencyCircleDollar,
  Handshake,
  Lightning,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";

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

const SELL_HIGHLIGHTS = [
  {
    icon: Lightning,
    title: "Fast Process",
    description: "Quick and straightforward",
  },
  {
    icon: CurrencyCircleDollar,
    title: "No Fees",
    description: "Avoid agent commission",
  },
  {
    icon: Handshake,
    title: "Any Condition",
    description: "We buy as-is",
  },
  {
    icon: MapPin,
    title: "Houses, Land & Commercial Buildings",
    description: null,
  },
] as const;

export default function SellPage() {
  return (
    <>
      <section
        className={`${styles.mediaHero} ${styles.sellHero}`}
        aria-labelledby="sell-title"
      >
        <div className={styles.mediaHeroMedia}>
          <Image
            className={styles.mediaHeroImage}
            src="/images/sell-hero-stock.jpg"
            alt="Development placeholder stock photo: residential home exterior"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className={styles.mediaHeroScrim} aria-hidden="true" />
        <div className={styles.mediaHeroInner}>
          <div className={styles.mediaHeroCopy}>
            <h1 id="sell-title">Sell Your Property for Cash</h1>
            <p>
              We buy houses, land, and commercial properties. Get a fair offer
              quickly and easily.
            </p>
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.twoColumn} ${styles.sellColumns}`}
      >
        <div className={`${styles.copy} ${styles.sellHighlights}`}>
          <ul className={styles.highlightList}>
            {SELL_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className={styles.highlightItem}>
                <span className={styles.highlightIcon} aria-hidden="true">
                  <Icon weight="fill" size={76} />
                </span>
                <div>
                  <p className={styles.highlightTitle}>{title}</p>
                  {description ? (
                    <p className={styles.highlightDescription}>{description}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
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
    </>
  );
}
