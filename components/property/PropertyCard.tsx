import Link from "next/link";

import { FinancingBadge } from "@/components/ui/FinancingBadge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { Property } from "@/lib/properties/types";
import styles from "@/styles/property.module.css";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function PropertyCard({ property }: { property: Property }) {
  const href = `/properties/${property.slug}`;
  const image = property.images[0];

  return (
    <article
      className={styles.card}
      id={`property-${property.id}`}
      data-property-id={property.id}
      tabIndex={-1}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.cardImage}
          src={image.src}
          alt={image.alt}
          width={600}
          height={400}
        />
      ) : null}
      <div className={styles.cardBody}>
        {property.isDevelopmentPlaceholder ? (
          <p className={styles.placeholderNote}>
            Development placeholder listing
          </p>
        ) : null}
        <h2 className={styles.cardTitle}>
          <Link href={href}>{property.title}</Link>
        </h2>
        {property.price !== null ? (
          <p className={styles.price}>{priceFormatter.format(property.price)}</p>
        ) : null}
        {property.location ? (
          <p className={styles.location}>{property.location}</p>
        ) : null}
        <p className={styles.type}>{property.propertyType}</p>
        {property.ownerFinancingAvailable ? <FinancingBadge /> : null}
        <div className={styles.cardActions}>
          <SecondaryButton href={href}>View Details</SecondaryButton>
          <PrimaryButton href={`${href}#inquiry`}>
            Ask About This Property
          </PrimaryButton>
        </div>
      </div>
    </article>
  );
}
