import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROOT = path.resolve(process.cwd(), "../..");

type Metric = {
  key: string;
  label: string;
  percent: number;
  status: "ok" | "warn" | "critical";
  detail: string;
};

function exists(p: string) {
  return fs.existsSync(path.join(ROOT, p));
}

function countFiles(dir: string, exts: string[] = [".ts", ".tsx"]): number {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return 0;
  let n = 0;
  const walk = (d: string) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) {
        if (!/node_modules|\.next|dist|archive|backup/.test(f.name)) walk(p);
      } else if (exts.includes(path.extname(f.name))) n++;
    }
  };
  walk(abs);
  return n;
}

function toStatus(p: number): Metric["status"] {
  if (p >= 80) return "ok";
  if (p >= 40) return "warn";
  return "critical";
}

function metric(key: string, label: string, percent: number, detail: string): Metric {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return { key, label, percent: p, status: toStatus(p), detail };
}

export async function GET() {
  // 1. Frontend (apps/web) — pages count benchmark against 32 industries + 11 core
  const webPages = countFiles("apps/web/app");
  const frontendPct = Math.min(100, (webPages / 80) * 100);

  // 2. Backend (services/api) — modules/core + modules/industries present + stl-replit routes
  const coreModules = exists("services/api/src/modules/core")
    ? fs.readdirSync(path.join(ROOT, "services/api/src/modules/core")).length
    : 0;
  const indModules = exists("services/api/src/modules/industries")
    ? fs.readdirSync(path.join(ROOT, "services/api/src/modules/industries")).length
    : 0;
  const legacyRoutes = countFiles("services/api/stl-replit/routes", [".js"]);
  const backendPct = Math.min(100, ((coreModules + indModules) / 42) * 70 + Math.min(30, legacyRoutes * 2));

  // 3. AI service
  const aiFiles = countFiles("services/ai", [".js", ".ts"]);
  const aiPct = Math.min(100, (aiFiles / 20) * 100);

  // 4. Shared packages
  const pkgs = ["ui", "types", "utils", "trust-engine", "industry-registry", "config"];
  const pkgsReady = pkgs.filter((p) => exists(`packages/${p}/package.json`)).length;
  const pkgsPct = (pkgsReady / pkgs.length) * 100;

  // 5. Admin app
  const adminFiles = countFiles("apps/admin");
  const adminPct = Math.min(100, (adminFiles / 20) * 100);

  // 6. Workers
  const workerFiles = countFiles("services/workers", [".js", ".ts"]);
  const workerPct = Math.min(100, (workerFiles / 10) * 100);

  // 7. Documentation
  const docs = [
    "docs/EHB_CONTEXT.md",
    "docs/PROJECT_STRUCTURE.md",
    "docs/LAUNCH_GUIDE.md",
    "ehb-info/EHB-MASTER-INFO.md",
    "ehb-info/EHB-MASTER-DEVELOPMENT-PLAN.md",
    "design-system/EHB-UIUX-SYSTEM.md",
    "design-system/ai-behavior.md",
    "EHB-FOLDER-FLOW-MASTER.md",
    "CLAUDE.md",
    "AGENTS.md",
  ];
  const docsReady = docs.filter(exists).length;
  const docsPct = (docsReady / docs.length) * 100;

  // 8. Monorepo setup
  const monorepoChecks = [
    "package.json",
    "pnpm-workspace.yaml",
    "turbo.json",
    "tsconfig.base.json",
    "scripts/folder-flow-validate.mjs",
    "scripts/add-industry.mjs",
    "data/ehb-data/industries.json",
    "packages/industry-registry/src/index.ts",
  ];
  const monoReady = monorepoChecks.filter(exists).length;
  const monoPct = (monoReady / monorepoChecks.length) * 100;

  // 9. Deployment readiness
  const deployChecks = [
    ".env.example",
    "apps/web/next.config.js",
    "vercel.json",
    "infrastructure/scripts/START-LOCAL.bat",
  ];
  const deployReady = deployChecks.filter(exists).length;
  const deployPct = (deployReady / deployChecks.length) * 100;

  const metrics: Metric[] = [
    metric("frontend", "Frontend (apps/web)", frontendPct, `${webPages} TSX/TS files`),
    metric("backend", "Backend (services/api)", backendPct, `${coreModules} core + ${indModules} industry modules`),
    metric("ai", "AI Service (services/ai)", aiPct, `${aiFiles} files`),
    metric("packages", "Shared Packages", pkgsPct, `${pkgsReady}/${pkgs.length} packages`),
    metric("admin", "Admin App", adminPct, `${adminFiles} files`),
    metric("workers", "Background Workers", workerPct, `${workerFiles} files`),
    metric("docs", "Documentation", docsPct, `${docsReady}/${docs.length} docs`),
    metric("monorepo", "Monorepo Setup", monoPct, `${monoReady}/${monorepoChecks.length} config files`),
    metric("deploy", "Deployment Ready", deployPct, `${deployReady}/${deployChecks.length} deploy files`),
  ];

  const overall = Math.round(metrics.reduce((s, m) => s + m.percent, 0) / metrics.length);

  return NextResponse.json({
    success: true,
    data: {
      overall,
      generatedAt: new Date().toISOString(),
      metrics,
    },
  });
}
