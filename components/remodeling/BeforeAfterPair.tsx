import styles from "@/styles/remodeling.module.css";

type PlaceholderImage = {
  src: string;
  alt: string;
};

type BeforeAfterPairProps = {
  before: PlaceholderImage;
  after: PlaceholderImage;
};

export function BeforeAfterPair({ before, after }: BeforeAfterPairProps) {
  return (
    <figure className={styles.comparison}>
      <div className={styles.imageGrid}>
        <div className={styles.imagePanel}>
          <span className={styles.imageLabel}>Before</span>
          {/* Local stock images for layout preview. */}
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
