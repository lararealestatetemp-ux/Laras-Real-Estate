"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { BUSINESS_PHONE } from "@/lib/constants";

export type SubmissionStatus = "idle" | "pending" | "success" | "error";

type LeadResponse = {
  ok?: boolean;
  error?: string;
  fields?: Record<string, string>;
};

const FALLBACK_ERROR = `We could not send your message right now. Please call ${BUSINESS_PHONE}.`;

export function useLeadForm(endpoint: string) {
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
        setFieldErrors(json.fields ?? {});
        setError(json.error ?? FALLBACK_ERROR);
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setError(FALLBACK_ERROR);
      setStatus("error");
    }
  }

  return { status, error, fieldErrors, handleSubmit };
}
