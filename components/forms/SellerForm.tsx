"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from "@/styles/forms.module.css";

import { FormField } from "./FormField";
import { FormSelect } from "./FormSelect";
import { FormStatus } from "./FormStatus";
import { FormTextarea } from "./FormTextarea";
import { Honeypot } from "./Honeypot";
import { useLeadForm } from "./useLeadForm";

export function SellerForm() {
  const { status, error, fieldErrors, handleSubmit } =
    useLeadForm("/api/leads/seller");

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGrid}>
        <FormField
          id="seller-first-name"
          name="firstName"
          label="First name"
          autoComplete="given-name"
          error={fieldErrors.firstName}
          required
        />
        <FormField
          id="seller-last-name"
          name="lastName"
          label="Last name"
          autoComplete="family-name"
          error={fieldErrors.lastName}
          required
        />
        <FormField
          id="seller-email"
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
          id="seller-phone"
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={fieldErrors.phone}
          required
        />
      </div>
      <FormField
        id="seller-property-address"
        name="propertyAddress"
        label="Property address"
        autoComplete="street-address"
        error={fieldErrors.propertyAddress}
        required
      />
      <div className={styles.fieldGrid}>
        <FormSelect
          id="seller-property-type"
          name="propertyType"
          label="Property type"
          defaultValue=""
          error={fieldErrors.propertyType}
          required
        >
          <option value="" disabled>
            Select a type
          </option>
          <option value="house">House</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial building</option>
        </FormSelect>
        <FormField
          id="seller-asking-price"
          name="askingPrice"
          label="Asking price"
          inputMode="decimal"
          error={fieldErrors.askingPrice}
          required
        />
      </div>
      <FormTextarea
        id="seller-general-info"
        name="generalInfo"
        label="General information about the property"
        rows={5}
        error={fieldErrors.generalInfo}
        required
      />
      <FormTextarea
        id="seller-comments"
        name="comments"
        label="Additional comments"
        rows={4}
        error={fieldErrors.comments}
      />
      <Honeypot id="seller-company" />
      <div className={styles.submitRow}>
        <PrimaryButton type="submit" disabled={status === "pending"}>
          {status === "pending" ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : null}
          Request Cash Offer Information
        </PrimaryButton>
        <FormStatus
          status={status}
          message={
            status === "pending"
              ? "Sending your request…"
              : status === "success"
                ? "Thank you. Your request has been sent."
                : status === "error"
                  ? error
                  : undefined
          }
        />
      </div>
    </form>
  );
}
