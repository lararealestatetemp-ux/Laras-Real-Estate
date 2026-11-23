import type { AuditEventType } from "./types";

export function writeAuditEvent(event: {
  type: AuditEventType;
  correlationId: string;
  ok: boolean;
}): void {
  console.info(
    JSON.stringify({
      type: event.type,
      correlationId: event.correlationId,
      ok: event.ok,
      ts: new Date().toISOString(),
    }),
  );
}
