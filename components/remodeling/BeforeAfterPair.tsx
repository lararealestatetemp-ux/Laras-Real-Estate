import styles from "@/styles/remodeling.module.css";

type PlaceholderImage = {
  src: string;
  alt: string;
};

type BeforeAfterPairProps = {
  before: PlaceholderImage;
  after: PlaceholderImage;
};

const PLACEHOLDER_DISCLOSURE =
  "Placeholder imagery — not completed Laras Real Estate projects";

export function BeforeAfterPair({
  before,
  after,
}: BeforeAfterPairProps) {
  return (
    <figure className={styles.comparison}>
      <figcaption className={styles.disclosure}>
        {PLACEHOLDER_DISCLOSURE}
      </figcaption>
      <div className={styles.imageGrid}>
        <div className={styles.imagePanel}>
          <span className={styles.imageLabel}>Before</span>
          {/* The brief intentionally uses external placeholder imagery. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.comparisonImage}
            src={before.src}
            alt={before.alt}
            width={800}
            height={600}
            loading="lazy"
          />
        </div>
        <div className={styles.imagePanel}>
          <span className={styles.imageLabel}>After</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.comparisonImage}
            src={after.src}
            alt={after.alt}
            width={800}
            height={600}
            loading="lazy"
          />
        </div>
      </div>
    </figure>
  );
}
