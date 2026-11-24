import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import styles from "@/styles/home.module.css";

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  icon: LucideIcon;
};

export function ServiceCard({
  title,
  description,
  href,
  linkLabel,
  icon: Icon,
}: ServiceCardProps) {
  return (
    <article className={styles.serviceCard}>
      <div className={styles.serviceIconWrap} aria-hidden="true">
        <Icon className={styles.serviceIcon} strokeWidth={1.75} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link className={styles.serviceLink} href={href}>
        {linkLabel}
      </Link>
    </article>
  );
}
