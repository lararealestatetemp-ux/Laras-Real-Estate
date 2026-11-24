import { Suspense } from "react";

import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyDiscoveryToolbar } from "@/components/property/PropertyDiscoveryToolbar";
import { PageHero } from "@/components/ui/PageHero";
import {
  filterPropertiesByDiscovery,
  parseDiscoveryFilters,
} from "@/lib/properties/discovery";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/property.module.css";

export const metadata = buildPageMetadata({
  title: "Properties for Sale",
  description: "View property listings from Laras Real Estate.",
  path: "/properties",
});

type PropertiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function PropertyListing({
  searchParams,
}: PropertiesPageProps) {
  const params = await searchParams;
  const filters = parseDiscoveryFilters(params);
  const properties = filterPropertiesByDiscovery(filters);

  return (
    <section className={styles.listing} aria-label="Property listings">
      <PropertyDiscoveryToolbar />
      {properties.length > 0 ? (
        <div className={styles.grid}>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>
          {filters.q ||
          filters.type !== "all" ||
          filters.price ||
          filters.beds ||
          filters.baths
            ? "No properties match your search."
            : "No properties available right now."}
        </p>
      )}
    </section>
  );
}

export default function PropertiesPage(props: PropertiesPageProps) {
  return (
    <>
      <PageHero
        title="Properties for Sale"
        description="Browse available houses, land, and commercial properties."
        imageSrc="/images/properties-hero-stock.jpg"
        imageAlt="Development placeholder stock photo: lighted residential home exterior"
      />
      <Suspense
        fallback={
          <p className={styles.emptyState} role="status">
            Loading properties…
          </p>
        }
      >
        <PropertyListing {...props} />
      </Suspense>
    </>
  );
}
