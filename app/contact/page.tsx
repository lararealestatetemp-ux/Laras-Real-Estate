import { ContactForm } from "@/components/forms/ContactForm";
import { BUSINESS_PHONE, BUSINESS_PHONE_TEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/styles/page-sections.module.css";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Contact Laras Real Estate.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className={`${styles.section} ${styles.twoColumn}`}>
      <div className={styles.copy}>
        <h1>Contact Laras Real Estate</h1>
        <p>
          Call{" "}
          <a className={styles.phoneLink} href={BUSINESS_PHONE_TEL}>
            {BUSINESS_PHONE}
          </a>{" "}
          or send a message using the form.
        </p>
      </div>
      <div className={styles.formPanel} id="contact-form">
        <h2>Send a message</h2>
        <ContactForm />
      </div>
    </section>
  );
}
