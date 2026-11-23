"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { BUSINESS_PHONE } from "@/lib/constants";

export type SubmissionStatus = "idle" | "pending" | "success" | "error";

type LeadResponse = {
  ok?: boolean;
  error?: string;
  fields?: Record<string, string>;
};

const FALLBACK_ERROR = `We could not send your message right now. Please call ${BUSINESS_PHONE}.`;

function focusSubmissionError(
  form: HTMLFormElement,
  fields: Record<string, string>,
  statusId: string,
) {
  const firstInvalidName = Object.keys(fields)[0];

  requestAnimationFrame(() => {
    const firstInvalidControl = firstInvalidName
      ? form.elements.namedItem(firstInvalidName)
      : null;

    if (firstInvalidControl instanceof HTMLElement) {
      firstInvalidControl.focus();
      return;
    }

    form.ownerDocument.getElementById(statusId)?.focus();
  });
}

export function useLeadForm(endpoint: string) {
  const statusId = useId();
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      payload[key] = typeof value === "string" ? value : "";
    });

    setStatus("pending");
    setError(undefined);
    setFieldErrors({});

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await response.json().catch(() => ({}))) as LeadResponse;

      if (!response.ok || json.ok !== true) {
        // Leave field values untouched so the visitor can correct and retry.
        const responseFieldErrors = json.fields ?? {};
        setFieldErrors(responseFieldErrors);
        setError(json.error ?? FALLBACK_ERROR);
        setStatus("error");
        focusSubmissionError(form, responseFieldErrors, statusId);
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setError(FALLBACK_ERROR);
      setStatus("error");
      focusSubmissionError(form, {}, statusId);
    }
  }

  return { status, statusId, error, fieldErrors, handleSubmit };
}
