"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from "@/styles/forms.module.css";

import { FormField } from "./FormField";
import { FormStatus } from "./FormStatus";
import { FormTextarea } from "./FormTextarea";
import { Honeypot } from "./Honeypot";
import { useLeadForm } from "./useLeadForm";

export function ConsultationForm() {
  const { status, error, fieldErrors, handleSubmit } = useLeadForm(
    "/api/leads/consultation",
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGrid}>
        <FormField
          id="consultation-first-name"
          name="firstName"
          label="First name"
          autoComplete="given-name"
          error={fieldErrors.firstName}
          required
        />
        <FormField
          id="consultation-last-name"
          name="lastName"
          label="Last name"
          autoComplete="family-name"
          error={fieldErrors.lastName}
          required
        />
        <FormField
          id="consultation-email"
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
          id="consultation-phone"
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={fieldErrors.phone}
          required
        />
      </div>
      <FormTextarea
        id="consultation-message"
        name="message"
        label="Tell us about your project"
        rows={6}
        error={fieldErrors.message}
        required
      />
      <Honeypot id="consultation-company" />
      <div className={styles.submitRow}>
        <PrimaryButton type="submit" disabled={status === "pending"}>
          {status === "pending" ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : null}
          Request Consultation
        </PrimaryButton>
        <FormStatus
          status={status}
          message={
            status === "pending"
              ? "Sending your request…"
              : status === "success"
                ? "Thank you. Your consultation request has been sent."
                : status === "error"
                  ? error
                  : undefined
          }
        />
      </div>
    </form>
  );
}
