"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from "@/styles/forms.module.css";

import { FormField } from "./FormField";
import { FormStatus } from "./FormStatus";
import { FormTextarea } from "./FormTextarea";
import { Honeypot } from "./Honeypot";
import { useLeadForm } from "./useLeadForm";

export function PropertyInquiryForm({
  propertySlug,
  propertyTitle,
}: {
  propertySlug: string;
  propertyTitle: string;
}) {
  const { status, error, fieldErrors, handleSubmit } = useLeadForm(
    "/api/leads/property-inquiry",
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.intro}>
        Send a question about <strong>{propertyTitle}</strong>.
      </p>
      <div className={styles.fieldGrid}>
        <FormField
          id="property-inquiry-first-name"
          name="firstName"
          label="First name"
          autoComplete="given-name"
          error={fieldErrors.firstName}
          required
        />
        <FormField
          id="property-inquiry-last-name"
          name="lastName"
          label="Last name"
          autoComplete="family-name"
          error={fieldErrors.lastName}
          required
        />
        <FormField
          id="property-inquiry-email"
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
          id="property-inquiry-phone"
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={fieldErrors.phone}
        />
      </div>
      <FormTextarea
        id="property-inquiry-message"
        name="message"
        label="Message"
        rows={6}
        error={fieldErrors.message}
        required
      />
      <Honeypot id="property-inquiry-company" />
      <input name="propertySlug" type="hidden" value={propertySlug} readOnly />
      <div className={styles.submitRow}>
        <PrimaryButton type="submit" disabled={status === "pending"}>
          {status === "pending" ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : null}
          Send Inquiry
        </PrimaryButton>
        <FormStatus
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
