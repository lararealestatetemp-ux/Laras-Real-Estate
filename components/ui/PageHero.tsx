import Image from "next/image";

import pageStyles from "@/styles/page-sections.module.css";
import styles from "@/styles/property.module.css";

type PageHeroProps = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function PageHero({
  title,
  description,
  imageSrc,
  imageAlt,
}: PageHeroProps) {
  const headingId = "page-hero-title";

  if (imageSrc) {
    return (
      <section
        className={`${pageStyles.mediaHero} ${pageStyles.innerPageHero}`}
        aria-labelledby={headingId}
      >
        <div className={pageStyles.mediaHeroMedia}>
          <Image
            className={pageStyles.mediaHeroImage}
            src={imageSrc}
            alt={
              imageAlt ??
              "Development placeholder stock photo: residential property"
            }
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className={pageStyles.mediaHeroScrim} aria-hidden="true" />
        <div className={pageStyles.mediaHeroInner}>
          <div className={pageStyles.mediaHeroCopy}>
            <h1 id={headingId}>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <header className={styles.pageHero}>
      <div className={styles.pageHeroInner}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}
