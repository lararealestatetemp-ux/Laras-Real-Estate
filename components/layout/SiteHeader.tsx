import { Suspense } from "react";
import Link from "next/link";

import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { NavLink } from "@/components/layout/NavLink";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_PHONE_TEL, NAV_ITEMS } from "@/lib/constants";
import styles from "@/styles/layout.module.css";

function StaticNavItems() {
  return NAV_ITEMS.map((item) => (
    <li key={item.href}>
      <Link className={styles.navLink} href={item.href}>
        {item.label}
      </Link>
    </li>
  ));
}

function CurrentNavItems() {
  return NAV_ITEMS.map((item) => (
    <li key={item.href}>
      <NavLink className={styles.navLink} href={item.href}>
        {item.label}
      </NavLink>
    </li>
  ));
}

export function SiteHeader() {
  return (
    <>
      <a className={styles.skipLink} href="#main">
        Skip to main content
      </a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/">
            {BUSINESS_NAME}
          </Link>
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            <ul className={styles.navList}>
              <Suspense fallback={<StaticNavItems />}>
                <CurrentNavItems />
              </Suspense>
            </ul>
          </nav>
          <a
            className={styles.phoneCta}
            href={BUSINESS_PHONE_TEL}
            aria-label={`Call ${BUSINESS_PHONE}`}
          >
            <PhoneIcon className={styles.phoneIcon} />
            {BUSINESS_PHONE}
          </a>
          <a
            className={styles.mobilePhone}
            href={BUSINESS_PHONE_TEL}
            aria-label={`Call ${BUSINESS_PHONE}`}
          >
            <PhoneIcon className={styles.phoneIcon} />
            <span className={styles.phoneNumber}>{BUSINESS_PHONE}</span>
            <span className={styles.phoneShort}>Call</span>
          </a>
          <MobileNavigation />
        </div>
      </header>
    </>
  );
}
