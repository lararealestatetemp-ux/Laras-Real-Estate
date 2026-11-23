import { Resend } from "resend";

export type SendLeadEmailResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "send_failed" };

export async function sendLeadEmail(input: {
  subject: string;
  text: string;
}): Promise<SendLeadEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.LEAD_INBOX_EMAIL;

  if (!apiKey || !inbox) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: "Laras Real Estate Website <onboarding@resend.dev>",
      to: inbox,
      subject: input.subject,
      text: input.text,
    });

    return error ? { ok: false, reason: "send_failed" } : { ok: true };
  } catch {
    return { ok: false, reason: "send_failed" };
  }
}
