import styles from "@/styles/property.module.css";

type PageHeroProps = {
  title: string;
  description: string;
};

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <header className={styles.pageHero}>
      <div className={styles.pageHeroInner}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}
