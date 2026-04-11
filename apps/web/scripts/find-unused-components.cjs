const fs = require("fs");
const path = require("path");

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      walk(p, acc);
    } else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

const appRoot = path.join(__dirname, "..");
const scanRoots = [
  path.join(appRoot, "app"),
  path.join(appRoot, "components"),
  path.join(appRoot, "lib"),
  path.join(appRoot, "scripts"),
];

const allCodeFiles = [];
for (const r of scanRoots) {
  if (fs.existsSync(r)) walk(r, allCodeFiles);
}

const textByFile = new Map();
for (const f of allCodeFiles) {
  try {
    textByFile.set(f, fs.readFileSync(f, "utf8"));
  } catch {
    /* skip */
  }
}

const combined = [...textByFile.values()].join("\n");

const componentFiles = walk(path.join(appRoot, "components")).filter((f) => f.endsWith(".tsx"));

const unused = [];
for (const f of componentFiles) {
  const rel = f.replace(/\\/g, "/").replace(/^.*?\/components\//, "components/");
  const base = path.basename(f, ".tsx");
  const patterns = [
    `@/components/${rel.replace(/^components\//, "").replace(/\.tsx$/, "")}`,
    rel.replace(/\.tsx$/, ""),
    base,
  ];
  let hits = 0;
  const needle1 = patterns[0];
  const needle2 = patterns[1].replace(/\\/g, "/");
  for (const [fp, txt] of textByFile) {
    if (fp === f) continue;
    if (txt.includes(needle1) || txt.includes(needle2)) {
      hits++;
      break;
    }
  }
  // crude: also check for dynamic import or short path
  if (hits === 0) {
    const short = `@/${rel.replace(/^components\//, "components/")}`.replace(/\.tsx$/, "");
    let found = false;
    for (const [fp, txt] of textByFile) {
      if (fp === f) continue;
      if (txt.includes(short)) {
        found = true;
        break;
      }
    }
    if (!found) unused.push(f);
  }
}

console.log("Possibly unused .tsx under components/ (heuristic):");
unused.sort().forEach((u) => console.log(u.replace(/\\/g, "/")));
