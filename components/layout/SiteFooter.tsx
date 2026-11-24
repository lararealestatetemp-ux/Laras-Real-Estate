import {
  EnvelopeSimple,
  FacebookLogo,
  Phone,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import {
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_PHONE_TEL,
  NAV_ITEMS,
  TAGLINE,
} from "@/lib/constants";
import styles from "@/styles/layout.module.css";

const COPYRIGHT_YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrandBlock}>
          <p className={styles.footerBrand}>{BUSINESS_NAME}</p>
          <p className={styles.tagline}>{TAGLINE}</p>
          <p className={styles.footerCopyright}>
            © {COPYRIGHT_YEAR} {BUSINESS_NAME}. All rights reserved.
          </p>
        </div>

        <nav className={styles.footerNav} aria-label="Footer navigation">
          <h2 className={styles.footerHeading}>Quick Links</h2>
          <ul className={styles.footerLinks}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.footerContact}>
          <h2 className={styles.footerHeading}>Contact</h2>
          <ul className={styles.footerContactList}>
            <li>
              <Phone
                className={styles.footerContactIcon}
                weight="fill"
                size={20}
                aria-hidden="true"
              />
              <a href={BUSINESS_PHONE_TEL}>{BUSINESS_PHONE}</a>
            </li>
            <li>
              <FacebookLogo
                className={styles.footerContactIcon}
                weight="fill"
                size={20}
                aria-hidden="true"
              />
              <a
                href="https://www.facebook.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Follow Us on Facebook
              </a>
            </li>
            <li>
              <EnvelopeSimple
                className={styles.footerContactIcon}
                weight="fill"
                size={20}
                aria-hidden="true"
              />
              <a href="mailto:info@example.com">Email Us</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
