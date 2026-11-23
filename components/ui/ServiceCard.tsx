import Link from "next/link";

import styles from "@/styles/home.module.css";

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export function ServiceCard({
  title,
  description,
  href,
  linkLabel,
}: ServiceCardProps) {
  return (
    <article className={styles.serviceCard}>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link href={href}>{linkLabel}</Link>
    </article>
  );
}
