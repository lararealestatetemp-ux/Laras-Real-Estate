"use client";

import { useState } from "react";

import { NavLink } from "@/components/layout/NavLink";
import { NAV_ITEMS } from "@/lib/constants";
import styles from "@/styles/layout.module.css";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.mobileNav} aria-label="Mobile navigation">
      <button
        className={styles.menuButton}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        Menu
      </button>
      {isOpen ? (
        <div className={styles.mobilePanel} id="mobile-navigation">
          <ul className={styles.mobileList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink
                  className={styles.mobileLink}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
