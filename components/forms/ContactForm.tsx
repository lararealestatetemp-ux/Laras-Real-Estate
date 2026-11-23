"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from "@/styles/forms.module.css";

import { FormField } from "./FormField";
import { FormSelect } from "./FormSelect";
import { FormStatus } from "./FormStatus";
import { FormTextarea } from "./FormTextarea";
import { Honeypot } from "./Honeypot";
import { useLeadForm } from "./useLeadForm";

export function ContactForm() {
  const { status, statusId, error, fieldErrors, handleSubmit } =
    useLeadForm("/api/leads/contact");

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldGrid}>
        <FormField
          id="contact-first-name"
          name="firstName"
          label="First name"
          autoComplete="given-name"
          error={fieldErrors.firstName}
          required
        />
        <FormField
          id="contact-last-name"
          name="lastName"
          label="Last name"
          autoComplete="family-name"
          error={fieldErrors.lastName}
          required
        />
        <FormField
          id="contact-email"
          name="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          error={fieldErrors.email}
          required
        />
        <FormField
          id="contact-phone"
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={fieldErrors.phone}
        />
      </div>
      <FormSelect
        id="contact-reason"
        name="reason"
        label="Reason for contacting us"
        defaultValue="general"
        error={fieldErrors.reason}
        required
      >
        <option value="sell">Sell my property</option>
        <option value="property">Question about a property</option>
        <option value="remodeling">Remodeling</option>
        <option value="financing">Financing</option>
        <option value="general">General question</option>
      </FormSelect>
      <FormTextarea
        id="contact-message"
        name="message"
        label="Message"
        rows={6}
        error={fieldErrors.message}
        required
      />
      <Honeypot id="contact-company" />
      <div className={styles.submitRow}>
        <PrimaryButton type="submit" disabled={status === "pending"}>
          {status === "pending" ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : null}
          Send Message
        </PrimaryButton>
        <FormStatus
          id={statusId}
          status={status}
          message={
            status === "pending"
              ? "Sending your message…"
              : status === "success"
                ? "Thank you. Your message has been sent."
                : status === "error"
                  ? error
                  : undefined
          }
        />
      </div>
    </form>
  );
}
