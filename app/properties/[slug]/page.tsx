import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bathtub,
  Bed,
  Buildings,
  House,
  MapPin,
  Ruler,
  SquaresFour,
  Tree,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

import { PropertyInquiryForm } from "@/components/forms/PropertyInquiryForm";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { FinancingBadge } from "@/components/ui/FinancingBadge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import {
  getAvailableProperties,
  getPropertyBySlug,
} from "@/lib/properties/queries";
import type { PropertyType } from "@/lib/properties/types";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/property.module.css";

function propertyTypeIcon(propertyType: PropertyType): Icon {
  switch (propertyType) {
    case "house":
      return House;
    case "land":
      return Tree;
    case "commercial":
      return Buildings;
    default: {
      const _exhaustive: never = propertyType;
      return _exhaustive;
    }
  }
}

type PropertyPageProps = {
  params: Promise<{ slug: string }>;
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

export function generateStaticParams() {
  return getAvailableProperties().map((property) => ({
    slug: property.slug,
  }));
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property || property.status !== "available") {
    notFound();
  }

  return buildPageMetadata({
    title: property.title,
    description: property.description,
    path: `/properties/${property.slug}`,
  });
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property || property.status !== "available") {
    notFound();
  }

  const basics = [
    property.bedrooms !== undefined
      ? {
          label: "Beds",
          value: numberFormatter.format(property.bedrooms),
          icon: Bed,
        }
      : undefined,
    property.bathrooms !== undefined
      ? {
          label: "Baths",
          value: numberFormatter.format(property.bathrooms),
          icon: Bathtub,
        }
      : undefined,
    property.squareFootage !== undefined
      ? {
          label: "Sq ft",
          value: numberFormatter.format(property.squareFootage),
          icon: Ruler,
        }
      : undefined,
    {
      label: "Type",
      value: property.propertyType,
      icon: propertyTypeIcon(property.propertyType),
    },
    property.location
      ? {
          label: "Location",
          value: property.location,
          icon: MapPin,
        }
      : undefined,
    property.lotSize
      ? {
          label: "Lot",
          value: property.lotSize,
          icon: SquaresFour,
        }
      : undefined,
  ].filter(
    (
      item,
    ): item is { label: string; value: string; icon: Icon } => Boolean(item),
  );

  return (
    <div className={styles.detailPage}>
      <div className={styles.detailInner}>
        {property.isDevelopmentPlaceholder ? (
          <p className={styles.placeholderBanner}>
            Development placeholder listing — sample content and stock photos
            only
          </p>
        ) : null}

        <PropertyGallery images={property.images} title={property.title} />

        <header className={styles.detailHeader}>
          <h1>{property.title}</h1>
          <div className={styles.detailPriceRow}>
            {property.price !== null ? (
              <p className={styles.detailPrice}>
                {priceFormatter.format(property.price)}
              </p>
            ) : null}
            {property.ownerFinancingAvailable ? <FinancingBadge /> : null}
          </div>
        </header>

        {basics.length > 0 ? (
          <ul className={styles.basicDetails} aria-label="Basic details">
            {basics.map((item) => {
              const DetailIcon = item.icon;
              return (
                <li key={item.label}>
                  <DetailIcon
                    className={styles.basicIcon}
                    size={28}
                    weight="duotone"
                    aria-hidden="true"
                  />
                  <span className={styles.basicLabel}>{item.label}</span>
                  <span className={styles.basicValue}>{item.value}</span>
                </li>
              );
            })}
          </ul>
        ) : null}

        <div className={styles.detailColumns}>
          <article className={styles.detailContent}>
            <h2>About this property</h2>
            <p>{property.description}</p>

            {property.features.length > 0 ? (
              <section className={styles.features}>
                <h2>Property features</h2>
                <ul className={styles.featureList}>
                  {property.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>

          <aside className={styles.detailActions} aria-label="Property actions">
            <PrimaryButton href="#inquiry">
              Contact About This Property
            </PrimaryButton>
            {property.ownerFinancingAvailable ? (
              <SecondaryButton href="/financing#financing-inquiry">
                Apply for Financing
              </SecondaryButton>
            ) : null}
            <p className={styles.detailActionsNote}>
              Prefer a general question?{" "}
              <Link href="/contact">Contact us</Link>.
            </p>
          </aside>
        </div>

        <section className={styles.inquiry} id="inquiry">
          <div className={styles.inquiryHeading}>
            <h2>Ask About This Property</h2>
            <p>Tell us how to reach you and what you would like to know.</p>
          </div>
          <PropertyInquiryForm
            propertySlug={property.slug}
            propertyTitle={property.title}
          />
        </section>
      </div>
    </div>
  );
}
