import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { writeAuditEvent } from "@/lib/leads/audit";
import { sendLeadEmail } from "@/lib/leads/email";
import {
  assertRateLimit,
  RateLimitError,
  resetRateLimits,
} from "@/lib/leads/rate-limit";
import { submitLead } from "@/lib/leads/submit";

const resendSend = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: resendSend };
  },
}));

beforeEach(() => {
  resetRateLimits();
  resendSend.mockReset();
  delete process.env.LEAD_INBOX_EMAIL;
  delete process.env.RESEND_API_KEY;
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("rate limiting rejects requests beyond the configured window", () => {
  assertRateLimit("1.2.3.4:seller", { limit: 2, windowMs: 60_000, now: 0 });
  assertRateLimit("1.2.3.4:seller", { limit: 2, windowMs: 60_000, now: 1 });

  expect(() =>
    assertRateLimit("1.2.3.4:seller", {
      limit: 2,
      windowMs: 60_000,
      now: 2,
    }),
  ).toThrow(RateLimitError);
});

test("audit output contains only approved operational metadata", () => {
  const info = vi.spyOn(console, "info").mockImplementation(() => undefined);

  writeAuditEvent({
    type: "CONTACT_FORM_SUBMITTED",
    correlationId: "correlation-1",
    ok: true,
  });

  const event = JSON.parse(String(info.mock.calls[0]?.[0]));
  expect(Object.keys(event).sort()).toEqual([
    "correlationId",
    "ok",
    "ts",
    "type",
  ]);
  expect(JSON.stringify(event)).not.toMatch(
    /Ada|936|example\.com|message|payload/i,
  );
});

test("email reports not configured without both required environment values", async () => {
  process.env.RESEND_API_KEY = "test-key";

  await expect(
    sendLeadEmail({ subject: "New lead", text: "Private details" }),
  ).resolves.toEqual({ ok: false, reason: "not_configured" });
  expect(resendSend).not.toHaveBeenCalled();
});

test("email sends to the configured lead inbox", async () => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.LEAD_INBOX_EMAIL = "leads@example.com";
  resendSend.mockResolvedValue({ data: { id: "email-1" }, error: null });

  await expect(
    sendLeadEmail({ subject: "New lead", text: "Private details" }),
  ).resolves.toEqual({ ok: true });
  expect(resendSend).toHaveBeenCalledWith(
    expect.objectContaining({
      subject: "New lead",
      text: "Private details",
      to: "leads@example.com",
    }),
  );
});

test("honeypot submissions fake success without validation or email", async () => {
  const email = vi.fn();
  const audit = vi.fn();

  const result = await submitLead(
    {
      kind: "seller",
      input: { company: "spam" },
      rateLimitKey: "1.2.3.4:seller",
    },
    {
      correlationId: () => "correlation-1",
      sendEmail: email,
      writeAudit: audit,
    },
  );

  expect(result).toEqual({ ok: true, correlationId: "correlation-1" });
  expect(email).not.toHaveBeenCalled();
  expect(audit).toHaveBeenCalledWith({
    type: "SELLER_FORM_SUBMITTED",
    correlationId: "correlation-1",
    ok: true,
  });
});

test("valid submissions are sanitized before email delivery", async () => {
  const email = vi.fn().mockResolvedValue({ ok: true });

  const result = await submitLead(
    {
      kind: "contact",
      input: {
        firstName: "Ada\u0000",
        lastName: "Lovelace",
        email: "ada@example.com",
        phone: "936-555-0100",
        reason: "financing",
        message: "  Please call me.\u0000  ",
        company: "",
      },
      rateLimitKey: "1.2.3.4:contact",
    },
    {
      correlationId: () => "correlation-2",
      sendEmail: email,
      writeAudit: vi.fn(),
    },
  );

  expect(result).toEqual({ ok: true, correlationId: "correlation-2" });
  expect(email).toHaveBeenCalledWith(
    expect.objectContaining({
      text: expect.stringMatching(/"leadType": "FINANCING"(?![\s\S]*\u0000)/),
    }),
  );
});
