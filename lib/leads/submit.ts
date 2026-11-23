import { randomUUID } from "node:crypto";

import { writeAuditEvent } from "./audit";
import { sendLeadEmail } from "./email";
import type { SendLeadEmailResult } from "./email";
import { assertRateLimit, RateLimitError } from "./rate-limit";
import { sanitizeText } from "./sanitize";
import type {
  AuditEventType,
  ContactReason,
  LeadSubmissionKind,
  LeadType,
} from "./types";
import {
  validateConsultationInput,
  validateContactInput,
  validatePropertyInquiryInput,
  validateSellerInput,
} from "./validation";

type ValidationResult =
  | { success: true; data: Record<string, string> }
  | {
      success: false;
      error: {
        flatten(): {
          fieldErrors: Record<string, string[] | undefined>;
        };
      };
    };

type SubmissionConfig = {
  auditType: AuditEventType;
  leadType: LeadType;
  subject: string;
  validate(input: unknown): ValidationResult;
};

type SubmitLeadDependencies = {
  correlationId: () => string;
  sendEmail: (input: {
    subject: string;
    text: string;
  }) => Promise<SendLeadEmailResult>;
  writeAudit: typeof writeAuditEvent;
  rateLimit: typeof assertRateLimit;
};

type SubmitLeadResult =
  | { ok: true; correlationId: string }
  | {
      ok: false;
      correlationId: string;
      reason:
        | "validation_failed"
        | "rate_limited"
        | "not_configured"
        | "send_failed";
      fields?: Record<string, string>;
    };

const DEFAULT_DEPENDENCIES: SubmitLeadDependencies = {
  correlationId: randomUUID,
  sendEmail: sendLeadEmail,
  writeAudit: writeAuditEvent,
  rateLimit: assertRateLimit,
};

function getSubmissionConfig(kind: LeadSubmissionKind): SubmissionConfig {
  switch (kind) {
    case "seller":
      return {
        auditType: "SELLER_FORM_SUBMITTED",
        leadType: "SELLER",
        subject: "New seller lead",
        validate: validateSellerInput,
      };
    case "property-inquiry":
      return {
        auditType: "PROPERTY_INQUIRY_SUBMITTED",
        leadType: "PROPERTY_BUYER",
        subject: "New property inquiry",
        validate: validatePropertyInquiryInput,
      };
    case "consultation":
      return {
        auditType: "CONSULTATION_FORM_SUBMITTED",
        leadType: "REMODELING",
        subject: "New remodeling consultation",
        validate: validateConsultationInput,
      };
    case "contact":
      return {
        auditType: "CONTACT_FORM_SUBMITTED",
        leadType: "GENERAL",
        subject: "New contact lead",
        validate: validateContactInput,
      };
    default: {
      const exhaustiveKind: never = kind;
      throw new Error(`Unsupported lead submission kind: ${exhaustiveKind}`);
    }
  }
}

function sanitizeLeadData(
  data: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      const maxLen =
        key === "firstName" || key === "lastName"
          ? 80
          : key === "email"
            ? 254
            : key === "message" ||
                key === "generalInfo" ||
                key === "comments"
              ? 2000
              : 200;
      return [key, sanitizeText(value, maxLen)];
    }),
  );
}

function leadTypeForContactReason(reason: ContactReason): LeadType {
  switch (reason) {
    case "sell":
      return "SELLER";
    case "property":
      return "PROPERTY_BUYER";
    case "remodeling":
      return "REMODELING";
    case "financing":
      return "FINANCING";
    case "general":
      return "GENERAL";
    default: {
      const exhaustiveReason: never = reason;
      throw new Error(`Unsupported contact reason: ${exhaustiveReason}`);
    }
  }
}

function firstFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fieldErrors).flatMap(([field, errors]) =>
      errors?.[0] ? [[field, errors[0]]] : [],
    ),
  );
}

export async function submitLead(
  submission: {
    kind: LeadSubmissionKind;
    input: unknown;
    rateLimitKey: string;
  },
  dependencyOverrides: Partial<SubmitLeadDependencies> = {},
): Promise<SubmitLeadResult> {
  const dependencies = { ...DEFAULT_DEPENDENCIES, ...dependencyOverrides };
  const correlationId = dependencies.correlationId();
  const config = getSubmissionConfig(submission.kind);
  const rawInput =
    typeof submission.input === "object" && submission.input !== null
      ? (submission.input as Record<string, unknown>)
      : {};

  if (
    typeof rawInput.company === "string" &&
    rawInput.company.length > 0
  ) {
    dependencies.writeAudit({
      type: config.auditType,
      correlationId,
      ok: true,
    });
    return { ok: true, correlationId };
  }

  const validation = config.validate(submission.input);
  if (!validation.success) {
    dependencies.writeAudit({
      type: config.auditType,
      correlationId,
      ok: false,
    });
    return {
      ok: false,
      correlationId,
      reason: "validation_failed",
      fields: firstFieldErrors(validation.error.flatten().fieldErrors),
    };
  }

  try {
    dependencies.rateLimit(submission.rateLimitKey);
  } catch (error) {
    if (!(error instanceof RateLimitError)) {
      throw error;
    }
    dependencies.writeAudit({
      type: config.auditType,
      correlationId,
      ok: false,
    });
    return { ok: false, correlationId, reason: "rate_limited" };
  }

  const sanitized = sanitizeLeadData(validation.data);
  const leadType =
    submission.kind === "contact"
      ? leadTypeForContactReason(sanitized.reason as ContactReason)
      : config.leadType;
  const delivery = await dependencies.sendEmail({
    subject: config.subject,
    text: JSON.stringify({ leadType, ...sanitized }, null, 2),
  });
  dependencies.writeAudit({
    type: config.auditType,
    correlationId,
    ok: delivery.ok,
  });

  return delivery.ok
    ? { ok: true, correlationId }
    : { ok: false, correlationId, reason: delivery.reason };
}
