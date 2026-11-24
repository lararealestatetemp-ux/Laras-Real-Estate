"use client";

import { useState } from "react";

import type { PropertyImage } from "@/lib/properties/types";
import styles from "@/styles/property.module.css";

export function PropertyGallery({
  images,
  title,
}: {
  images: PropertyImage[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (!selectedImage) {
    return <p className={styles.galleryEmpty}>No property images available.</p>;
  }

  const sideEntries = images
    .map((image, index) => ({ image, index }))
    .filter((entry) => entry.index !== selectedIndex)
    .slice(0, 3);
  const extraCount = Math.max(0, images.length - 1 - sideEntries.length);

  return (
    <div className={styles.gallery} aria-label={`${title} image gallery`}>
      <div className={styles.galleryPrimaryWrap}>
        {/* Local stock images; next/image optional later. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.galleryPrimary}
          src={selectedImage.src}
          alt={selectedImage.alt}
          width={1200}
          height={800}
          data-primary="true"
        />
      </div>
      {images.length > 1 ? (
        <div className={styles.gallerySide} aria-label="Choose an image">
          {sideEntries.map(({ image, index }, visibleIndex) => {
            const isLastVisible =
              visibleIndex === sideEntries.length - 1 && extraCount > 0;
            return (
              <button
                className={styles.galleryThumbnailButton}
                key={`${image.src}-${index}`}
                type="button"
                  aria-label={`View image ${index + 1} of ${images.length}: ${image.alt}`}
                  onClick={() => setSelectedIndex(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.galleryThumbnail}
                  src={image.src}
                  alt=""
                  width={400}
                  height={280}
                  loading="lazy"
                />
                {isLastVisible ? (
                  <span className={styles.galleryMoreBadge} aria-hidden="true">
                    +{extraCount} Photos
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
