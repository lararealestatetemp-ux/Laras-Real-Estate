"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from "@/styles/forms.module.css";

import { FormField } from "./FormField";
import { FormStatus } from "./FormStatus";
import { FormTextarea } from "./FormTextarea";

type SubmissionStatus = "idle" | "pending" | "success" | "error";

export function PropertyInquiryForm({
  propertySlug,
  propertyTitle,
}: {
  propertySlug: string;
  propertyTitle: string;
}) {
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const value = (name: string) => String(formData.get(name) ?? "").trim();

    setStatus("pending");

    try {
      const response = await fetch("/api/leads/property-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: value("firstName"),
          lastName: value("lastName"),
          email: value("email"),
          phone: value("phone"),
          message: value("message"),
          company: value("company"),
          propertySlug: value("propertySlug"),
        }),
      });

      if (!response.ok) {
        throw new Error("Inquiry request failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.intro}>
        Send a question about <strong>{propertyTitle}</strong>.
      </p>
      <div className={styles.fieldGrid}>
        <FormField
          id="property-inquiry-first-name"
          name="firstName"
          label="First name"
          autoComplete="given-name"
          required
        />
        <FormField
          id="property-inquiry-last-name"
          name="lastName"
          label="Last name"
          autoComplete="family-name"
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
          required
        />
        <FormField
          id="property-inquiry-phone"
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
      </div>
      <FormTextarea
        id="property-inquiry-message"
        name="message"
        label="Message"
        rows={6}
        required
      />
      <div className={styles.visuallyHidden} aria-hidden="true">
        <label htmlFor="property-inquiry-company">Company</label>
        <input
          id="property-inquiry-company"
          name="company"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
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
                  ? "We could not send your inquiry. Please try again."
                  : undefined
          }
        />
      </div>
    </form>
  );
}
