#!/usr/bin/env node
/**
 * EHB Industry Scaffold — add a new industry in one atomic step.
 *
 * Usage:
 *   node scripts/add-industry.mjs <code> "<name>" "<category>" [group=C] [accent=#29ABE2] [icon=sparkles]
 *
 * Example:
 *   node scripts/add-industry.mjs petcare "PetCare+" "Pets" G "#F59E0B" paw-print
 *
 * Enforces EHB-FOLDER-FLOW-MASTER.md §4. Never hand-create industry folders.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error("Usage: add-industry.mjs <code> <name> <category> [group] [accent] [icon]");
  process.exit(1);
}

const [code, name, category, group = "C", accent = "#29ABE2", icon = "sparkles"] = args;

const validCode = /^[a-z][a-z0-9-]*$/.test(code);
if (!validCode) {
  console.error(`✖ Invalid code "${code}" — must be kebab-case, start with a letter.`);
  process.exit(1);
}

const validGroups = ["A", "B", "C", "D", "E", "F", "G"];
if (!validGroups.includes(group)) {
  console.error(`✖ Invalid group "${group}" — must be one of ${validGroups.join(",")}`);
  process.exit(1);
}

const industriesJsonPath = path.join(ROOT, "data/ehb-data/industries.json");
const industries = JSON.parse(fs.readFileSync(industriesJsonPath, "utf8"));

if (industries.some((i) => i.code === code)) {
  console.error(`✖ Industry "${code}" already exists. Use a different code.`);
  process.exit(1);
}

// 1. Backup
const today = new Date().toISOString().slice(0, 10);
const backupDir = path.join(ROOT, `backup/industry-add-${code}-${today}`);
fs.mkdirSync(backupDir, { recursive: true });
fs.copyFileSync(industriesJsonPath, path.join(backupDir, "industries.json"));
console.log(`✔ Backup → ${path.relative(ROOT, backupDir)}`);

// 2. Append industry entry
const entry = {
  code, name, category, group, accent, icon,
  status: "coming-soon",
  trustMinStl: 3,
  phase: 3,
};
industries.push(entry);
fs.writeFileSync(industriesJsonPath, JSON.stringify(industries, null, 2) + "\n");
console.log(`✔ Registered in industries.json (total: ${industries.length})`);

// 3. Frontend page stub
const fePage = path.join(ROOT, `apps/web/app/(industries)/${code}/page.tsx`);
fs.mkdirSync(path.dirname(fePage), { recursive: true });
if (!fs.existsSync(fePage)) {
  fs.writeFileSync(
    fePage,
    `import { getIndustry } from "@ehb/industry-registry";

export default function ${toPascal(code)}Page() {
  const industry = getIndustry("${code}");
  if (!industry) return null;

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">
            {industry.category}
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
            {industry.name}
          </h1>
          <p className="text-ehb-textMuted max-w-2xl text-sm">
            ${name} — coming soon. Powered by EHB trust stack (PSS · CRB · DMO · STL).
          </p>
        </header>

        <section className="rounded-2xl glass-card border p-6 text-sm text-ehb-textBody">
          <p>This industry is being prepared. Check back soon.</p>
        </section>
      </div>
    </main>
  );
}
`
  );
  console.log(`✔ Frontend page → ${path.relative(ROOT, fePage)}`);
}

// 4. Frontend components folder
const feComp = path.join(ROOT, `apps/web/components/industries/${code}`);
fs.mkdirSync(feComp, { recursive: true });
fs.writeFileSync(
  path.join(feComp, ".gitkeep"),
  `# ${name} industry-specific components live here.\n`
);

// 5. Backend module stubs (NestJS-style)
const beDir = path.join(ROOT, `services/api/src/modules/industries/${code}`);
fs.mkdirSync(path.join(beDir, "dto"), { recursive: true });
fs.mkdirSync(path.join(beDir, "schemas"), { recursive: true });

const moduleFile = path.join(beDir, `${code}.module.ts`);
if (!fs.existsSync(moduleFile)) {
  fs.writeFileSync(
    moduleFile,
    `import { Module } from "@nestjs/common";
import { ${toPascal(code)}Controller } from "./${code}.controller";
import { ${toPascal(code)}Service } from "./${code}.service";

@Module({
  controllers: [${toPascal(code)}Controller],
  providers: [${toPascal(code)}Service],
  exports: [${toPascal(code)}Service],
})
export class ${toPascal(code)}Module {}
`
  );
}

const ctrlFile = path.join(beDir, `${code}.controller.ts`);
if (!fs.existsSync(ctrlFile)) {
  fs.writeFileSync(
    ctrlFile,
    `import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ${toPascal(code)}Service } from "./${code}.service";

@ApiTags("${name}")
@Controller("industries/${code}")
export class ${toPascal(code)}Controller {
  constructor(private readonly svc: ${toPascal(code)}Service) {}

  @Get("health")
  @ApiOperation({ summary: "${name} module health" })
  health() {
    return this.svc.health();
  }
}
`
  );
}

const svcFile = path.join(beDir, `${code}.service.ts`);
if (!fs.existsSync(svcFile)) {
  fs.writeFileSync(
    svcFile,
    `import { Injectable } from "@nestjs/common";

@Injectable()
export class ${toPascal(code)}Service {
  health() {
    return { module: "${code}", status: "ok" };
  }
}
`
  );
}
console.log(`✔ Backend module → ${path.relative(ROOT, beDir)}`);

// 6. Changelog append
const logPath = path.join(ROOT, "ehb-status.log");
fs.appendFileSync(
  logPath,
  `${new Date().toISOString()}\tindustry-add\t${code}\t${name}\t${category}\n`
);

console.log(`\n✅ Industry "${code}" added successfully.`);
console.log(`   Next:  pnpm install  →  pnpm run validate:folder-flow  →  npm run test:stl`);

function toPascal(str) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}
