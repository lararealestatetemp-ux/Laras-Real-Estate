import { beforeEach, expect, test } from "vitest";

import { POST } from "@/app/api/leads/property-inquiry/route";
import { resetRateLimits } from "@/lib/leads/rate-limit";

const validBody = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "",
  message: "Is this still available?",
  propertySlug: "sample-house",
  company: "",
};

function req(body: unknown, raw?: string) {
  return new Request("http://localhost/api/leads/property-inquiry", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "1.2.3.4" },
    body: raw ?? JSON.stringify(body),
  }) as never;
}

beforeEach(() => {
  resetRateLimits();
  delete process.env.RESEND_API_KEY;
  delete process.env.LEAD_INBOX_EMAIL;
});

test("invalid email returns 400 without leaking internals", async () => {
  const res = await POST(req({ ...validBody, email: "bad" }));
  expect(res.status).toBe(400);
  const json = await res.json();
  expect(json.ok).toBe(false);
  expect(json.fields.email).toBeTruthy();
  expect(JSON.stringify(json)).not.toMatch(/stack|RESEND|LEAD_INBOX/i);
});

test("malformed JSON returns 400", async () => {
  const res = await POST(req(null, "{not json"));
  expect(res.status).toBe(400);
  expect((await res.json()).ok).toBe(false);
});

test("honeypot returns success without requiring email config", async () => {
  const res = await POST(req({ ...validBody, company: "spam" }));
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json.ok).toBe(true);
  expect(json.correlationId).toBeTruthy();
});

test("unconfigured email maps to a phone-number message without env names", async () => {
  const res = await POST(req(validBody));
  expect(res.status).toBe(503);
  const json = await res.json();
  expect(json.ok).toBe(false);
  expect(json.error).toContain("936-208-3019");
  expect(JSON.stringify(json)).not.toMatch(/stack|RESEND|LEAD_INBOX|not_configured/i);
});

test("missing property slug returns 400 with a slug field error", async () => {
  const res = await POST(req({ ...validBody, propertySlug: undefined }));
  expect(res.status).toBe(400);
  expect((await res.json()).fields.propertySlug).toBeTruthy();
});
