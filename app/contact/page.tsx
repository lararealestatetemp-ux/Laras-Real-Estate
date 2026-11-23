import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { BUSINESS_PHONE, BUSINESS_PHONE_TEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/page-sections.module.css";

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
      />
      <section className={`${styles.section} ${styles.twoColumn}`}>
        <div className={styles.copy}>
          <h2>Call us</h2>
          <p>
            <a className={styles.phoneLink} href={BUSINESS_PHONE_TEL}>
              {BUSINESS_PHONE}
            </a>
          </p>
        </div>
        <div className={styles.formPanel} id="contact-form">
          <h2>Send a message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
