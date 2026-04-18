/**
 * @ehb/pss-client
 *
 * The ONLY way platforms talk to PSS. No direct platform-to-platform API calls.
 * Import this from every EHB platform backend:
 *
 *   import { pssClient } from "@ehb/pss-client";
 *   const res = await pssClient.submitForSTL({ entityId, entityType, userId, entityData });
 */

const DEFAULT_TIMEOUT_MS = 8_000;

function buildClient({ baseUrl, platformId, platformKey, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const url = baseUrl || process.env.PSS_API_URL || "http://localhost:6000";
  const pid = platformId || process.env.PSS_PLATFORM_ID;
  const key = platformKey || process.env.PSS_PLATFORM_KEY;

  async function call(method, path, { body, idempotencyKey } = {}) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(`${url}${path}`, {
        method,
        headers: {
          "content-type": "application/json",
          "x-platform-id": pid,
          "x-platform-key": key,
          ...(idempotencyKey && { "x-idempotency-key": idempotencyKey }),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl.signal,
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) throw Object.assign(new Error(data?.error || `pss_${res.status}`), { status: res.status, data });
      return data;
    } finally {
      clearTimeout(t);
    }
  }

  return {
    submitForSTL: ({ entityId, entityType, userId, entityData, idempotencyKey } = {}) =>
      call("POST", "/stl/submit", {
        body: { entity_id: entityId, entity_type: entityType, user_id: userId, entity_data: entityData ?? {} },
        idempotencyKey,
      }),

    getStatus: (id) => call("GET", `/stl/status/${encodeURIComponent(id)}`),

    getBulkStatus: (ids) => call("POST", "/users/bulk-status", { body: { ids } }),

    verifyUser: (userId) => call("POST", "/users/verify", { body: { user_id: userId } }),

    getCriteria: (setName) =>
      setName
        ? call("GET", `/criteria/${encodeURIComponent(setName)}`)
        : call("GET", `/criteria`),

    getCriteriaFor: (platformId, entityType) =>
      call("GET", `/criteria/for/${encodeURIComponent(platformId)}/${encodeURIComponent(entityType)}`),

    // ops-side (DMO web UI)
    getQueue: ({ stage, platform, limit = 50 } = {}) => {
      const qs = new URLSearchParams();
      if (stage) qs.set("stage", stage);
      if (platform) qs.set("platform", platform);
      qs.set("limit", String(limit));
      return call("GET", `/ops/queue?${qs.toString()}`);
    },

    decideCase: (id, { actor, decision, stlLevel, justification, source }) =>
      call("POST", `/ops/${encodeURIComponent(id)}/decision`, {
        body: {
          actor,
          decision,
          stl_level: stlLevel,
          justification,
          source,
        },
      }),

    rerouteCase: (id, { actor, target, reason }) =>
      call("POST", `/ops/${encodeURIComponent(id)}/reroute`, {
        body: { actor, target, reason },
      }),

    getAudit: (id) => call("GET", `/ops/${encodeURIComponent(id)}/audit`),

    // platform registry (admin ops)
    registerPlatform: ({ platformId, name, webhookUrl }) =>
      call("POST", "/platforms/register", {
        body: { platform_id: platformId, name, webhook_url: webhookUrl },
      }),

    rotatePlatformKeys: (id) => call("POST", `/platforms/${encodeURIComponent(id)}/rotate`),
  };
}

export const pssClient = buildClient();
export { buildClient };
