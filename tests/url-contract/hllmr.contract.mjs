// URL contract test for hllmr.com (tests/url-contract/hllmr.urls.json). Deliberately not named
// *.test.mjs, so the Silo `npm test` glob never needs the hllmr build; run it with
// `npm run test:hllmr` (or `node --test tests/url-contract/hllmr.contract.mjs`).
//
// Two modes, same assertions:
//   - default: against the built site (sites/hllmr/dist) through nginx-model.mjs, no Docker;
//   - CONTRACT_BASE_URL=http://127.0.0.1:18081: against real nginx serving the artifact with
//     deploy/hllmr/nginx.conf (tests/url-contract/run-nginx-hllmr.sh).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createNginxModel } from "./nginx-model.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const contract = JSON.parse(readFileSync(here("./hllmr.urls.json"), "utf8"));
const redirects = JSON.parse(readFileSync(here("../../sites/hllmr/redirects.json"), "utf8"));
const nginxConf = readFileSync(here("../../deploy/hllmr/nginx.conf"), "utf8");
const dist = here("../../sites/hllmr/dist/");
const BASE = process.env.CONTRACT_BASE_URL;

if (!BASE && !existsSync(dist + "index.html")) {
  throw new Error("sites/hllmr/dist is missing: run `npm run build:hllmr` first");
}

const model = BASE ? null : createNginxModel({ root: dist, redirects, runtime: {} });

/** @returns {Promise<{status:number, location?:string, body:string}>} */
async function get(path) {
  if (model) {
    const r = model("GET", path);
    return { status: r.status, location: r.location, body: r.body ?? "" };
  }
  const r = await fetch(new URL(path, BASE), { redirect: "manual" });
  return { status: r.status, location: r.headers.get("location") ?? undefined, body: await r.text() };
}

const mode = BASE ? `nginx at ${BASE}` : "nginx model over dist/";

for (const e of contract.entries) {
  test(`${e.path} -> ${e.status}${e.location ? ` ${e.location}` : ""} (${mode})`, async () => {
    const r = await get(e.path);
    assert.equal(r.status, e.status, `status for ${e.path}`);
    if (e.location) assert.equal(r.location, e.location, `Location for ${e.path}`);
    if (e.contains) assert.ok(r.body.includes(e.contains), `${e.path} should contain ${JSON.stringify(e.contains)}`);
  });
}

test("every redirect in sites/hllmr/redirects.json is mirrored exactly in deploy/hllmr/nginx.conf", () => {
  for (const [from, to] of Object.entries(redirects.permanent)) {
    const line = `location = ${from} { return 301 ${to}; }`;
    assert.ok(nginxConf.includes(line), `nginx.conf must contain: ${line}`);
  }
  const inConf = [...nginxConf.matchAll(/location = (\S+) \{ return 30[12] /g)].map((m) => m[1]);
  for (const from of inConf) assert.ok(from in redirects.permanent, `${from} redirects in nginx.conf but not in redirects.json`);
});

test("redirects never shadow a file in the artifact (the release tool byte-checks every file)", () => {
  if (!model) return;
  for (const p of Object.keys(redirects.permanent)) {
    const file = dist + p.replace(/^\//, "");
    const shadowed = p.endsWith("/") ? existsSync(file + "index.html") : existsSync(file) && statSync(file).isFile();
    assert.ok(!shadowed, `${p} is both a redirect and a file`);
  }
});

test("every built HTML page is in the contract or is the 404 page", () => {
  if (!model) return;
  const paths = new Set(contract.entries.map((e) => e.path));
  const walk = (dir, rel = "") =>
    readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
      d.isDirectory() ? walk(`${dir}${d.name}/`, `${rel}${d.name}/`) : d.name === "index.html" ? [`/${rel}`] : [],
    );
  for (const p of walk(dist).filter((p) => !p.startsWith("/_astro/"))) {
    assert.ok(paths.has(p), `built page ${p} is missing from hllmr.urls.json`);
  }
});

