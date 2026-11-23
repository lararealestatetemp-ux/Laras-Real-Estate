import { randomUUID } from "node:crypto";

import { BUSINESS_PHONE } from "@/lib/constants";

import { submitLead } from "./submit";
import type { LeadSubmissionKind } from "./types";

export type LeadResponseBody =
  | { ok: true; correlationId: string }
  | {
      ok: false;
      correlationId: string;
      error: string;
      fields?: Record<string, string>;
    };

const DELIVERY_ERROR = `We could not send your message right now. Please call ${BUSINESS_PHONE}.`;

function jsonResponse(body: LeadResponseBody, status: number): Response {
  return Response.json(body, { status });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function handleLeadRequest(
  request: Request,
  kind: LeadSubmissionKind,
): Promise<Response> {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        correlationId: randomUUID(),
        error: "Please check your submission and try again.",
      },
      400,
    );
  }

  try {
    const result = await submitLead({
      kind,
      input,
      rateLimitKey: `${clientIp(request)}:${kind}`,
    });

    if (result.ok) {
      return jsonResponse(result, 200);
    }

    switch (result.reason) {
      case "validation_failed":
        return jsonResponse(
          {
            ok: false,
            correlationId: result.correlationId,
            error: "Please correct the highlighted fields and try again.",
            fields: result.fields,
          },
          400,
        );
      case "rate_limited":
        return jsonResponse(
          {
            ok: false,
            correlationId: result.correlationId,
            error: `Too many submissions. Please try again later or call ${BUSINESS_PHONE}.`,
          },
          429,
        );
      case "not_configured":
        return jsonResponse(
          {
            ok: false,
            correlationId: result.correlationId,
            error: DELIVERY_ERROR,
          },
          503,
        );
      case "send_failed":
        return jsonResponse(
          {
            ok: false,
            correlationId: result.correlationId,
            error: DELIVERY_ERROR,
          },
          502,
        );
      default: {
        const exhaustiveReason: never = result.reason;
        throw new Error(`Unsupported lead result: ${exhaustiveReason}`);
      }
    }
  } catch {
    return jsonResponse(
      { ok: false, correlationId: randomUUID(), error: DELIVERY_ERROR },
      500,
    );
  }
}
