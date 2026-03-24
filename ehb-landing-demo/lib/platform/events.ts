export type EhbEventType =
  | "auth.user.registered"
  | "pss.case.verified"
  | "pss.refill.expired"
  | "dmo.application.approved"
  | "stl.score.updated"
  | "franchise.report.submitted";

export type EhbEventEnvelope<TPayload = Record<string, unknown>> = {
  eventId: string;
  type: EhbEventType;
  source: string;
  occurredAt: string;
  correlationId?: string;
  payloadVersion: number;
  payload: TPayload;
};

export function createEvent<TPayload>(args: {
  type: EhbEventType;
  source: string;
  payload: TPayload;
  correlationId?: string;
}): EhbEventEnvelope<TPayload> {
  return {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: args.type,
    source: args.source,
    occurredAt: new Date().toISOString(),
    correlationId: args.correlationId,
    payloadVersion: 1,
    payload: args.payload,
  };
}

