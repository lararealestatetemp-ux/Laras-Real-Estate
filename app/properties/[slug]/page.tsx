import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PropertyInquiryForm } from "@/components/forms/PropertyInquiryForm";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { FinancingBadge } from "@/components/ui/FinancingBadge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import {
  getAvailableProperties,
  getPropertyBySlug,
} from "@/lib/properties/queries";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/property.module.css";

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

  const facts = [
    property.location
      ? { label: "Location", value: property.location }
      : undefined,
    { label: "Property type", value: property.propertyType },
    property.bedrooms !== undefined
      ? { label: "Bedrooms", value: numberFormatter.format(property.bedrooms) }
      : undefined,
    property.bathrooms !== undefined
      ? {
          label: "Bathrooms",
          value: numberFormatter.format(property.bathrooms),
        }
      : undefined,
    property.squareFootage !== undefined
      ? {
          label: "Square footage",
          value: `${numberFormatter.format(property.squareFootage)} sq. ft.`,
        }
      : undefined,
    property.lotSize
      ? { label: "Lot size", value: property.lotSize }
      : undefined,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <div className={styles.detailPage}>
      <div className={styles.detailInner}>
        {property.isDevelopmentPlaceholder ? (
          <p className={styles.placeholderBanner}>
            Development placeholder listing
          </p>
        ) : null}

        <header className={styles.detailHeader}>
          <p className={styles.detailType}>{property.propertyType}</p>
          <h1>{property.title}</h1>
          {property.price !== null ? (
            <p className={styles.detailPrice}>
              {priceFormatter.format(property.price)}
            </p>
          ) : null}
          {property.ownerFinancingAvailable ? <FinancingBadge /> : null}
        </header>

        <PropertyGallery images={property.images} title={property.title} />

        <div className={styles.detailColumns}>
          <article className={styles.detailContent}>
            <h2>Property Details</h2>
            <p>{property.description}</p>

            {facts.length > 0 ? (
              <dl className={styles.facts}>
                {facts.map((fact) => (
                  <div className={styles.fact} key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {property.features.length > 0 ? (
              <section className={styles.features}>
                <h2>Features</h2>
                <ul>
                  {property.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>

          <aside className={styles.detailActions} aria-label="Property actions">
            <PrimaryButton href="#inquiry">
              Ask About This Property
            </PrimaryButton>
            {property.ownerFinancingAvailable ? (
              <SecondaryButton href="/financing">
                Learn About Financing
              </SecondaryButton>
            ) : null}
          </aside>
        </div>

        <section className={styles.inquiry} id="inquiry">
          <div className={styles.inquiryHeading}>
            <h2>Ask About This Property</h2>
            <p>
              Prefer a general question? <Link href="/contact">Contact us</Link>.
            </p>
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
