import {
  Clock,
  EnvelopeSimple,
  FacebookLogo,
  Phone,
} from "@phosphor-icons/react/dist/ssr";

import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { BUSINESS_PHONE, BUSINESS_PHONE_TEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/contact.module.css";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Call Laras Real Estate or send a message through the form.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Laras Real Estate"
        description="Call us or send a message using the form."
        imageSrc="/images/contact-hero-stock.jpg"
        imageAlt="Development placeholder stock photo: residential home exterior"
      />

      <section className={styles.section} aria-label="Contact details and form">
        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label="Contact information">
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">
                  <Phone weight="fill" size={32} />
                </span>
                <a className={styles.contactLink} href={BUSINESS_PHONE_TEL}>
                  {BUSINESS_PHONE}
                </a>
              </li>

              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">
                  <EnvelopeSimple weight="fill" size={32} />
                </span>
                <div>
                  <a
                    className={styles.contactLink}
                    href="mailto:info@example.com"
                  >
                    Email Us
                  </a>
                  <p className={styles.fillerNote}>
                    Filler email for layout preview
                  </p>
                </div>
              </li>

              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">
                  <FacebookLogo weight="fill" size={32} />
                </span>
                <div>
                  <a
                    className={styles.contactLink}
                    href="https://www.facebook.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Follow Us on Facebook
                  </a>
                  <p className={styles.fillerNote}>
                    Filler social link for layout preview
                  </p>
                </div>
              </li>

              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">
                  <Clock weight="fill" size={32} />
                </span>
                <div className={styles.hoursBlock}>
                  <p className={styles.hoursTitle}>Business Hours</p>
                  <ul className={styles.hoursList}>
                    <li>Monday – Friday: 8:00 AM – 5:00 PM</li>
                    <li>Saturday: By Appointment</li>
                    <li>Sunday: Closed</li>
                  </ul>
                  <p className={styles.fillerNote}>
                    Filler hours for layout preview
                  </p>
                </div>
              </li>
            </ul>

            <div
              className={styles.mapPanel}
              role="region"
              aria-label="Development placeholder map"
            >
              <p className={styles.mapNote}>Development placeholder map</p>
              <div className={styles.mapSurface} aria-hidden="true">
                <span className={styles.mapPin} />
              </div>
              <div className={styles.mapFooter}>
                <p className={styles.mapLocation}>
                  Sample Area, TX (placeholder)
                </p>
                <span className={styles.mapDirections}>Directions</span>
              </div>
              <p className={styles.fillerNote}>
                Map layout only — not a live location
              </p>
            </div>
          </aside>

          <div className={styles.formPanel} id="contact-form">
            <div className={styles.formIntro}>
              <h2>Send Us a Message</h2>
              <p>We typically respond within one business day.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
