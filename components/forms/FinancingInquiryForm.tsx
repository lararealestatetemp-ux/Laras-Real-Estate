"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from "@/styles/forms.module.css";

import { FormField } from "./FormField";
import { FormStatus } from "./FormStatus";
import { FormTextarea } from "./FormTextarea";
import { Honeypot } from "./Honeypot";
import { useLeadForm } from "./useLeadForm";

export function FinancingInquiryForm() {
  const { status, statusId, error, fieldErrors, handleSubmit } =
    useLeadForm("/api/leads/contact");

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldGrid}>
        <FormField
          id="financing-first-name"
          name="firstName"
          label="First name"
          autoComplete="given-name"
          error={fieldErrors.firstName}
          required
        />
        <FormField
          id="financing-last-name"
          name="lastName"
          label="Last name"
          autoComplete="family-name"
          error={fieldErrors.lastName}
          required
        />
        <FormField
          id="financing-email"
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
          id="financing-phone"
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={fieldErrors.phone}
        />
      </div>
      <FormTextarea
        id="financing-message"
        name="message"
        label="Message"
        rows={5}
        error={fieldErrors.message}
        required
      />
      <Honeypot id="financing-company" />
      <input name="reason" type="hidden" value="financing" readOnly />
      <div className={styles.submitRow}>
        <PrimaryButton type="submit" disabled={status === "pending"}>
          {status === "pending" ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : null}
          Send Inquiry
        </PrimaryButton>
        <FormStatus
          id={statusId}
          status={status}
          message={
            status === "pending"
              ? "Sending your inquiry…"
              : status === "success"
                ? "Thank you. Your inquiry has been sent."
                : status === "error"
                  ? error
                  : undefined
          }
        />
      </div>
    </form>
  );
}
