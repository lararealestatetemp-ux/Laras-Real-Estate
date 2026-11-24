"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";

import { BeforeAfterPair } from "@/components/remodeling/BeforeAfterPair";
import styles from "@/styles/remodeling.module.css";

type PlaceholderImage = {
  src: string;
  alt: string;
};

type Pair = {
  id: string;
  before: PlaceholderImage;
  after: PlaceholderImage;
};

export function BeforeAfterCarousel({ pairs }: { pairs: readonly Pair[] }) {
  const [index, setIndex] = useState(0);

  if (pairs.length === 0) {
    return null;
  }

  const current = pairs[index] ?? pairs[0];
  const canNavigate = pairs.length > 1;

  function goTo(nextIndex: number) {
    const length = pairs.length;
    setIndex(((nextIndex % length) + length) % length);
  }

  return (
    <div className={styles.carousel}>
      <BeforeAfterPair before={current.before} after={current.after} />

      {canNavigate ? (
        <>
          <div className={styles.carouselControls}>
            <button
              className={styles.carouselArrow}
              type="button"
              aria-label="Previous before and after example"
              onClick={() => goTo(index - 1)}
            >
              <CaretLeft size={28} weight="bold" aria-hidden="true" />
            </button>
            <button
              className={styles.carouselArrow}
              type="button"
              aria-label="Next before and after example"
              onClick={() => goTo(index + 1)}
            >
              <CaretRight size={28} weight="bold" aria-hidden="true" />
            </button>
          </div>

          <div
            className={styles.carouselDots}
            role="tablist"
            aria-label="Before and after examples"
          >
            {pairs.map((pair, pairIndex) => (
              <button
                key={pair.id}
                className={styles.carouselDot}
                type="button"
                role="tab"
                aria-selected={pairIndex === index}
                aria-label={`Show example ${pairIndex + 1} of ${pairs.length}`}
                onClick={() => setIndex(pairIndex)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
