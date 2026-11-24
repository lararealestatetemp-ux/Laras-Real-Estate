"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { REMODELING_SERVICE_PLACEHOLDERS } from "@/lib/remodeling/placeholders";
import styles from "@/styles/forms.module.css";

import { FormField } from "./FormField";
import { FormStatus } from "./FormStatus";
import { FormTextarea } from "./FormTextarea";
import { Honeypot } from "./Honeypot";
import { useLeadForm } from "./useLeadForm";

export function ConsultationForm() {
  const { status, statusId, error, fieldErrors, handleSubmit } = useLeadForm(
    "/api/leads/consultation",
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldGrid}>
        <FormField
          id="consultation-first-name"
          name="firstName"
          label="First Name"
          autoComplete="given-name"
          error={fieldErrors.firstName}
          required
        />
        <FormField
          id="consultation-last-name"
          name="lastName"
          label="Last Name"
          autoComplete="family-name"
          error={fieldErrors.lastName}
          required
        />
      </div>
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
      <div className={styles.field}>
        <label className={styles.label} htmlFor="consultation-project-type">
          Project Type
        </label>
        <select
          className={styles.control}
          id="consultation-project-type"
          name="projectType"
          defaultValue=""
        >
          <option value="" disabled>
            Select a service
          </option>
          {REMODELING_SERVICE_PLACEHOLDERS.map((service) => (
            <option key={service.id} value={service.label}>
              {service.label}
            </option>
          ))}
        </select>
      </div>
      <FormTextarea
        id="consultation-message"
        name="message"
        label="Project Details"
        placeholder="Describe your project..."
        rows={5}
        error={fieldErrors.message}
        required
      />
      <Honeypot id="consultation-company" />
      <div className={styles.submitRow}>
        <PrimaryButton type="submit" disabled={status === "pending"}>
          {status === "pending" ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : null}
          Request Consultation →
        </PrimaryButton>
        <FormStatus
          id={statusId}
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
