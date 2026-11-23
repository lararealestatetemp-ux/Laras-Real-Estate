import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from "@/styles/home.module.css";

export function ContactCTA() {
  return (
    <section className={styles.contactCta} aria-labelledby="contact-cta-title">
      <div>
        <h2 id="contact-cta-title">Let&apos;s talk about your next step</h2>
        <p>
          Share what you are planning, and Laras Real Estate will help you
          identify the right place to begin.
        </p>
      </div>
      <PrimaryButton href="/contact">Contact Laras Real Estate</PrimaryButton>
    </section>
  );
}
