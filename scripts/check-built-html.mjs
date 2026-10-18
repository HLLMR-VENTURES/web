#!/usr/bin/env node
// Static checks over a built site (no network). Run after `astro build`:
//   node scripts/check-built-html.mjs sites/silo/dist [--release]
// Fails on: inline scripts/styles whose hash is missing from the page's CSP <meta>; inline event
// handlers; third-party resource loads in static HTML; a runtime API override; artifact paths
// the release tool would refuse; duplicate ids; banned copy on authors pages; missing <main>.
// --release also fails on leftover TODO(v1-copy) placeholders.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const dist = path.resolve(process.argv[2] ?? "sites/silo/dist");
const release = process.argv.includes("--release");
const problems = [];
const fail = (file, msg) => problems.push(`${path.relative(dist, file) || "."}: ${msg}`);

/** @returns {string[]} every file under dir */
function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(dist);
const sha256 = (s) => `'sha256-${createHash("sha256").update(s, "utf8").digest("base64")}'`;

// 1. Artifact names: the host release tool accepts only [A-Za-z0-9._-] path components and
//    refuses dot-prefixed components (see the hosting skill's release.sh).
for (const f of files) {
  const rel = path.relative(dist, f).split(path.sep);
  if (!rel.every((c) => /^[A-Za-z0-9._-]+$/.test(c) && !c.startsWith("."))) fail(f, "path the release tool would refuse");
}

// 2. Built JS must not read a runtime API override (the old /browse ?api= escape hatch).
for (const f of files.filter((f) => f.endsWith(".js"))) {
  const js = readFileSync(f, "utf8");
  if (/[?&]api=|get\(\s*["']api["']\s*\)/.test(js)) fail(f, "runtime API override (?api=) in production JS");
}

const BANNED_AUTHORS_COPY = /\b(host(ing)?|alternative|replac\w*|competitor|early access|priority)\b/gi;
const AUTHORS_ALLOW = ["Does Silo host my files? No"];

for (const f of files.filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(f, "utf8");
  const isStub = /<meta http-equiv="refresh"/i.test(html);
  const csp = html.match(/<meta http-equiv="content-security-policy" content="([^"]*)"/i)?.[1] ?? "";
  const directive = (name) => csp.split(";").map((d) => d.trim()).find((d) => d.startsWith(`${name} `)) ?? "";

  // 3. Inline scripts/styles must be covered by the page's CSP hashes.
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/type="application\/ld\+json"/i.test(m[1])) continue; // data block, never executed
    if (!directive("script-src").includes(sha256(m[2]))) fail(f, `inline <script> not in CSP script-src: ${m[2].slice(0, 60)}…`);
  }
  for (const m of html.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/gi)) {
    if (!directive("style-src").includes(sha256(m[2]))) fail(f, `inline <style> not in CSP style-src: ${m[2].slice(0, 60)}…`);
  }
  if (/\sstyle="/i.test(html.replace(/<astro-island[^>]*>/g, ""))) fail(f, "inline style attribute (blocked by CSP without 'unsafe-inline')");

  // 4. No inline event handlers.
  const handler = html.match(/<[a-z][^>]*\son[a-z]+\s*=/i);
  if (handler) fail(f, `inline event handler: ${handler[0].slice(0, 80)}`);

  // 5. Static HTML loads nothing from third parties (islands fetch at runtime under CSP).
  for (const m of html.matchAll(/<(script|img|source|iframe|video|audio|link)\b[^>]*\b(src|srcset|href)="(https?:)?\/\/([^"/]+)/gi)) {
    const tag = m[1].toLowerCase();
    if (tag === "link" && !/rel="(stylesheet|preload|modulepreload|icon|apple-touch-icon|manifest)"/i.test(m[0])) continue;
    fail(f, `third-party ${tag} load from ${m[4]}`);
  }

  // 6. Duplicate ids.
  const seen = new Set();
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) {
    if (seen.has(m[1])) fail(f, `duplicate id "${m[1]}"`);
    seen.add(m[1]);
  }

  // 7. Landmarks on real pages.
  if (!isStub && (html.match(/<main\b/g) ?? []).length !== 1) fail(f, "page must have exactly one <main>");
  if (!isStub && !csp) fail(f, "page has no CSP <meta>");

  // 8. Authors pages: copy rules from the authors plan.
  const rel = path.relative(dist, f).split(path.sep).join("/");
  if (rel.startsWith("authors/")) {
    // Page content only: the shared footer's "doesn't host them" disclosure is site-wide copy.
    const main = html.match(/<main\b[\s\S]*<\/main>/i)?.[0] ?? html;
    let text = main.replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ");
    for (const ok of AUTHORS_ALLOW) text = text.split(ok).join(" ");
    for (const m of text.matchAll(BANNED_AUTHORS_COPY)) fail(f, `banned authors copy: "${m[0]}"`);
  }

  // 9. Release builds may not carry copy placeholders.
  if (release && html.includes("TODO(v1-copy)")) fail(f, "TODO(v1-copy) placeholder left in a release build");
}

if (problems.length) {
  console.error(`check-built-html: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-built-html: ${files.length} files OK`);
