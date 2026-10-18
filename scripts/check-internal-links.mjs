#!/usr/bin/env node
// Offline internal-link and fragment check over the built site, equivalent to the CI step
//   lychee --offline --include-fragments --index-files index.html --root-dir <dist>
//          --config lychee.pending.toml "<dist>/**/*.html"
// so it can run locally without lychee and as part of `npm test`. Same exclusions: only pages the
// URL contract marks pending (scripts/pending-links.mjs).
//   node scripts/check-internal-links.mjs [dist-dir]
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pendingPatterns } from "./pending-links.mjs";

const dist = path.resolve(process.argv[2] ?? "sites/silo/dist");
const excludes = pendingPatterns().map((p) => new RegExp(p));
const toUrl = (abs, frag) => `file://${abs.split(path.sep).join("/").replace(/^(?!\/)/, "/").replace(/\/$/, "")}${frag ? `#${frag}` : ""}`;

/** @returns {string[]} every .html file under dir */
function htmlFiles(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : [];
  });
}

/** Link targets lychee extracts from HTML attributes. */
function links(html) {
  const out = [];
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) out.push(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]*)"/g)) {
    for (const part of m[1].split(",")) out.push(part.trim().split(/\s+/)[0]);
  }
  return out.filter(Boolean);
}

const idCache = new Map();
function hasFragment(file, frag) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idCache.set(file, new Set([...html.matchAll(/\s(?:id|name)="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file).has(decodeURIComponent(frag));
}

const errors = [];
let checked = 0;
let excluded = 0;

for (const file of htmlFiles(dist)) {
  for (const raw of links(readFileSync(file, "utf8"))) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith("//")) continue; // http(s), mailto, data, silo: (offline)
    const [beforeFrag, frag = ""] = raw.split("#");
    const pathPart = beforeFrag.split("?")[0];
    const target =
      pathPart === ""
        ? file
        : pathPart.startsWith("/")
          ? path.join(dist, ...decodeURIComponent(pathPart).split("/"))
          : path.resolve(path.dirname(file), decodeURIComponent(pathPart));
    const url = toUrl(target, frag);
    if (excludes.some((re) => re.test(url))) {
      excluded++;
      continue;
    }
    checked++;
    const where = `${path.relative(dist, file)} -> ${raw}`;
    let resolved = target;
    if (existsSync(target) && statSync(target).isDirectory()) {
      resolved = path.join(target, "index.html");
      if (!existsSync(resolved)) {
        errors.push(`${where}: directory has no index.html`);
        continue;
      }
    }
    if (!existsSync(resolved)) {
      errors.push(`${where}: file not found`);
      continue;
    }
    if (frag && resolved.endsWith(".html") && !hasFragment(resolved, frag)) errors.push(`${where}: fragment #${frag} not found`);
  }
}

console.log(`check-internal-links: ${checked} checked, ${excluded} excluded (pending pages), ${errors.length} error(s)`);
if (errors.length) {
  console.error(`  ${errors.join("\n  ")}`);
  process.exit(1);
}
