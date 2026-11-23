import { Suspense } from "react";
import Link from "next/link";

import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { NavLink } from "@/components/layout/NavLink";
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
            <a className={styles.phoneLink} href={BUSINESS_PHONE_TEL}>
              Call {BUSINESS_PHONE}
            </a>
          </nav>
          <a
            className={styles.mobilePhone}
            href={BUSINESS_PHONE_TEL}
            aria-label={`Call ${BUSINESS_PHONE}`}
          >
            Call<span className={styles.phoneNumber}>&nbsp;{BUSINESS_PHONE}</span>
          </a>
          <MobileNavigation />
        </div>
      </header>
    </>
  );
}
