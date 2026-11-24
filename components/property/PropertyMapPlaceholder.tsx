"use client";

import type { Property } from "@/lib/properties/types";
import styles from "@/styles/property.module.css";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function focusCard(id: string) {
  const el = document.getElementById(`property-${id}`);
  if (!el) {
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.focus({ preventScroll: true });
}

export function PropertyMapPlaceholder({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <section
      className={styles.mapPanel}
      aria-label="Development placeholder map"
    >
      <p className={styles.mapNote}>Development placeholder map</p>
      <div className={styles.mapSurface}>
        {properties.map((property) =>
          property.mapPin ? (
            <button
              key={property.id}
              type="button"
              className={styles.mapPin}
              style={{
                left: `${property.mapPin.x}%`,
                top: `${property.mapPin.y}%`,
              }}
              aria-label={`View ${property.title} on listing`}
              title={
                property.price !== null
                  ? `${property.title} — ${priceFormatter.format(property.price)}`
                  : property.title
              }
              onClick={() => focusCard(property.id)}
            />
          ) : null,
        )}
      </div>
      {properties.length === 0 ? (
        <p className={styles.mapEmpty}>No listings match.</p>
      ) : null}
    </section>
  );
}
