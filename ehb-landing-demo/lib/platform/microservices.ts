export type ServiceName =
  | "auth"
  | "pss"
  | "crb"
  | "dmo"
  | "stl"
  | "franchise"
  | "industry"
  | "ai"
  | "wallet";

export type ServiceConfig = {
  name: ServiceName;
  routePrefix: string;
  envUrlKey: string;
  defaultLocalUrl: string;
};

export const SERVICE_REGISTRY: Record<ServiceName, ServiceConfig> = {
  auth: { name: "auth", routePrefix: "/auth", envUrlKey: "EHB_AUTH_SERVICE_URL", defaultLocalUrl: "http://localhost:4010" },
  pss: { name: "pss", routePrefix: "/pss", envUrlKey: "EHB_PSS_SERVICE_URL", defaultLocalUrl: "http://localhost:4020" },
  crb: { name: "crb", routePrefix: "/crb", envUrlKey: "EHB_CRB_SERVICE_URL", defaultLocalUrl: "http://localhost:4030" },
  dmo: { name: "dmo", routePrefix: "/dmo", envUrlKey: "EHB_DMO_SERVICE_URL", defaultLocalUrl: "http://localhost:4040" },
  stl: { name: "stl", routePrefix: "/stl", envUrlKey: "EHB_STL_SERVICE_URL", defaultLocalUrl: "http://localhost:4050" },
  franchise: { name: "franchise", routePrefix: "/franchise", envUrlKey: "EHB_FRANCHISE_SERVICE_URL", defaultLocalUrl: "http://localhost:4060" },
  industry: { name: "industry", routePrefix: "/industry", envUrlKey: "EHB_INDUSTRY_SERVICE_URL", defaultLocalUrl: "http://localhost:4070" },
  ai: { name: "ai", routePrefix: "/ai", envUrlKey: "EHB_AI_SERVICE_URL", defaultLocalUrl: "http://localhost:4080" },
  wallet: { name: "wallet", routePrefix: "/wallet", envUrlKey: "EHB_WALLET_SERVICE_URL", defaultLocalUrl: "http://localhost:4090" },
};

export function serviceBaseUrl(service: ServiceName) {
  const conf = SERVICE_REGISTRY[service];
  const fromEnv = process.env[conf.envUrlKey];
  return fromEnv && fromEnv.length > 0 ? fromEnv : conf.defaultLocalUrl;
}

export function buildServiceUrl(service: ServiceName, path: string) {
  const base = serviceBaseUrl(service).replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

