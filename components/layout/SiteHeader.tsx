import Link from "next/link";

import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_PHONE_TEL, NAV_ITEMS } from "@/lib/constants";
import styles from "@/styles/layout.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/">
          {BUSINESS_NAME}
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link className={styles.navLink} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={BUSINESS_PHONE_TEL}>Call {BUSINESS_PHONE}</a>
        </nav>
        <MobileNavigation />
      </div>
    </header>
  );
}
