import { renderPrometheusMetrics } from "@/monitoring/prometheus";

export async function GET() {
  const body = await renderPrometheusMetrics();
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; version=0.0.4; charset=utf-8" },
  });
}
