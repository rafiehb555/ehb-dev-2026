#!/usr/bin/env node
/**
 * One-time bulk scaffold — creates frontend + backend stubs for every industry
 * in data/ehb-data/industries.json that doesn't already have them.
 *
 * Safe to re-run: existing files are never overwritten.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const industries = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/ehb-data/industries.json"), "utf8")
);

const toPascal = (s) =>
  s.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");

let created = 0;

for (const ind of industries) {
  const { code, name, category } = ind;

  // Frontend page
  const fePage = path.join(ROOT, `apps/web/app/(industries)/${code}/page.tsx`);
  if (!fs.existsSync(fePage)) {
    fs.mkdirSync(path.dirname(fePage), { recursive: true });
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
            ${name.replace(/"/g, '\\"')} — ${category} hub powered by the EHB trust stack (PSS · CRB · DMO · STL).
          </p>
        </header>

        <section className="rounded-2xl glass-card border p-6 text-sm text-ehb-textBody">
          <p className="opacity-80">Status: <span className="font-semibold text-white">{industry.status}</span></p>
          <p className="opacity-60 mt-2">Page content is being prepared. This route is auto-registered via industry-registry.</p>
        </section>
      </div>
    </main>
  );
}
`
    );
    created++;
  }

  // Components folder marker
  const feComp = path.join(ROOT, `apps/web/components/industries/${code}`);
  if (!fs.existsSync(feComp)) {
    fs.mkdirSync(feComp, { recursive: true });
    fs.writeFileSync(path.join(feComp, ".gitkeep"), `# ${name} components\n`);
  }

  // Backend module files
  const beDir = path.join(ROOT, `services/api/src/modules/industries/${code}`);
  fs.mkdirSync(beDir, { recursive: true });
  fs.mkdirSync(path.join(beDir, "dto"), { recursive: true });
  fs.mkdirSync(path.join(beDir, "schemas"), { recursive: true });

  const Pascal = toPascal(code);
  const moduleFile = path.join(beDir, `${code}.module.ts`);
  if (!fs.existsSync(moduleFile)) {
    fs.writeFileSync(
      moduleFile,
      `import { Module } from "@nestjs/common";
import { ${Pascal}Controller } from "./${code}.controller";
import { ${Pascal}Service } from "./${code}.service";

@Module({
  controllers: [${Pascal}Controller],
  providers: [${Pascal}Service],
  exports: [${Pascal}Service],
})
export class ${Pascal}Module {}
`
    );
    created++;
  }

  const ctrlFile = path.join(beDir, `${code}.controller.ts`);
  if (!fs.existsSync(ctrlFile)) {
    fs.writeFileSync(
      ctrlFile,
      `import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ${Pascal}Service } from "./${code}.service";

@ApiTags("${name}")
@Controller("industries/${code}")
export class ${Pascal}Controller {
  constructor(private readonly svc: ${Pascal}Service) {}

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
export class ${Pascal}Service {
  health() {
    return { module: "${code}", status: "ok" };
  }
}
`
    );
  }
}

console.log(`✅ Scaffold complete. ${created} new file(s) created across ${industries.length} industries.`);
