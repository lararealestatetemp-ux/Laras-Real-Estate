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

  return (
    <div className={styles.gallery} aria-label={`${title} image gallery`}>
      {/* Remote fixture images are intentionally rendered without optimization. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.galleryPrimary}
        src={selectedImage.src}
        alt={selectedImage.alt}
        width={1200}
        height={800}
        data-primary="true"
      />
      {images.length > 1 ? (
        <div className={styles.galleryThumbnails} aria-label="Choose an image">
          {images.map((image, index) => (
            <button
              className={styles.galleryThumbnailButton}
              key={`${image.src}-${index}`}
              type="button"
              aria-label={`View image ${index + 1} of ${images.length}: ${image.alt}`}
              aria-pressed={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.galleryThumbnail}
                src={image.src}
                alt=""
                width={180}
                height={120}
                loading={index === 0 ? undefined : "lazy"}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
