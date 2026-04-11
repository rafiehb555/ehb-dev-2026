import { captureSentryError } from "@/monitoring/sentry";
import { logApiResponseTime } from "@/monitoring/logger";
import { incMetric, observeRouteLatency, observeRouteStatus } from "@/monitoring/prometheus";

export async function monitorApiRequest(
  req: Request,
  route: string,
  resolver: () => Promise<Response>,
): Promise<Response> {
  const start = Date.now();
  try {
    const response = await resolver();
    const ms = Date.now() - start;
    logApiResponseTime(route, ms, response.status);
    observeRouteLatency(route, ms);
    observeRouteStatus(route, response.status);
    incMetric(`ehb_api_status_${response.status}_total`);
    return response;
  } catch (err) {
    const ms = Date.now() - start;
    logApiResponseTime(route, ms, 500);
    observeRouteLatency(route, ms);
    observeRouteStatus(route, 500);
    incMetric("ehb_api_status_500_total");
    await captureSentryError(route, err, { method: req.method });
    throw err;
  }
}
