import Link from "next/link";

import {
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_PHONE_TEL,
  NAV_ITEMS,
  TAGLINE,
} from "@/lib/constants";
import styles from "@/styles/layout.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <p className={styles.footerBrand}>{BUSINESS_NAME}</p>
          <p className={styles.tagline}>{TAGLINE}</p>
        </div>
        <nav aria-label="Footer navigation">
          <h2 className={styles.footerHeading}>Quick links</h2>
          <ul className={styles.footerLinks}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className={styles.footerHeading}>Contact</h2>
          <a href={BUSINESS_PHONE_TEL}>{BUSINESS_PHONE}</a>
        </div>
      </div>
    </footer>
  );
}
