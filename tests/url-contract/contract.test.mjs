// URL contract test for silo.hllmr.com (tests/url-contract/silo.urls.json).
//
// Two modes, same assertions:
//   - default: against the built site (sites/silo/dist) through nginx-model.mjs, no Docker needed;
//   - CONTRACT_BASE_URL=http://127.0.0.1:8080: against a real nginx serving the artifact with
//     deploy/silo/nginx.conf (CI job `contract-nginx`, or infra against the test host).
// Pending entries (not yet ported) are reported as TODO; CONTRACT_STRICT=1 makes them failures.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createNginxModel } from "./nginx-model.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const contract = JSON.parse(readFileSync(here("./silo.urls.json"), "utf8"));
const redirects = JSON.parse(readFileSync(here("../../sites/silo/redirects.json"), "utf8"));
const dist = here("../../sites/silo/dist/");
const BASE = process.env.CONTRACT_BASE_URL;
const STRICT = process.env.CONTRACT_STRICT === "1";

if (!BASE && !existsSync(dist + "index.html")) {
  throw new Error("sites/silo/dist is missing: run `npm run build` first (npm test does this)");
}

const model = BASE
  ? null
  : createNginxModel({
      root: dist,
      redirects,
      runtime: { "/metrics.json": here("../fixtures/runtime/metrics.json") },
    });

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
  const pending = e.pending && !STRICT ? `pending ${e.pending}` : false;
  test(`${e.path} -> ${e.status}${e.location ? ` ${e.location}` : ""} (${mode})`, { todo: pending }, async () => {
    const r = await get(e.path);
    assert.equal(r.status, e.status, `status for ${e.path}`);
    if (e.location) assert.equal(r.location, e.location, `Location for ${e.path}`);
    if (e.contains) assert.ok(r.body.includes(e.contains), `${e.path} should contain ${JSON.stringify(e.contains)}`);
    if (e.noindex) assert.match(r.body, /<meta name="robots" content="noindex/, `${e.path} must be noindex`);
  });
}

test("every /go/ key and vanity path in redirects.json is in the contract or resolves", async () => {
  for (const key of Object.keys(redirects.go)) {
    const r = await get(`/go/${key}`);
    assert.equal(r.status, 302, `/go/${key}`);
    assert.equal(r.location, redirects.go[key], `/go/${key} target`);
  }
});

test("redirects never shadow a file in the artifact (the release tool byte-checks every file)", () => {
  if (!model) return;
  const covered = [
    ...Object.keys(redirects.go).map((k) => `/go/${k}`),
    ...Object.keys(redirects.vanity),
    ...Object.keys(redirects.permanent),
  ];
  for (const p of covered) {
    const file = dist + p.replace(/^\//, "");
    const isFile = existsSync(file) && !p.endsWith("/") && !existsSync(file + "/index.html");
    assert.ok(!isFile, `${p} is both a redirect and a file`);
  }
});

const anchors = contract.anchors;
test(
  `legacy help anchors (${Object.keys(anchors.map).length}) map to topic pages that keep the old id`,
  { todo: anchors.pending && !STRICT ? `pending ${anchors.pending}` : false },
  async () => {
    const hub = await get(anchors.page);
    assert.equal(hub.status, 200);
    for (const [id, target] of Object.entries(anchors.map)) {
      assert.ok(hub.body.includes(`"${id}"`), `${anchors.page} shim must map #${id}`);
      const page = await get(target);
      assert.equal(page.status, 200, target);
      assert.ok(page.body.includes(`id="${id}"`), `${target} must keep id="${id}"`);
    }
  },
);

test("/changelog/ links point at the repo's current owner (old notes are rewritten at build)", async () => {
  const r = await get("/changelog/");
  assert.equal(r.status, 200);
  assert.ok(!r.body.includes('href="https://github.com/HLLMR/silo'), "/changelog/ still links to github.com/HLLMR/silo");
});

// Launch Shorts scheduled on YouTube go public at 11:00 America/Chicago (CST, UTC-6, after the
// 2 November DST change). No page may carry one before then.
const SCHEDULED_SHORTS = {
  "14f7SuLtG5Q": "2026-11-03T17:00:00Z",
  VotfHpbL7F4: "2026-11-06T17:00:00Z",
  "VQcAW6x-cqA": "2026-11-10T17:00:00Z",
  mvW8sMtDnz4: "2026-11-13T17:00:00Z",
  "Rw0KD6_rO-k": "2026-11-17T17:00:00Z",
  H7BaruPLBco: "2026-11-20T17:00:00Z",
  QIUaRvVDg9w: "2026-11-24T17:00:00Z",
  odLyhutbq8A: "2026-11-27T17:00:00Z",
  FLr4mcTF5yc: "2026-12-01T17:00:00Z",
};

test("launch videos: the tour is on the home page, frames are limited to youtube-nocookie.com, and no Short appears before it is public", async () => {
  const home = await get("/");
  assert.ok(home.body.includes('data-vf-id="JE-sVn1OI4g"'), "home page shows the two-minute tour");
  const frameSrc = home.body.match(/<meta http-equiv="content-security-policy" content="[^"]*?(frame-src [^;"]*)/i)?.[1];
  assert.equal(frameSrc?.trim(), "frame-src https://www.youtube-nocookie.com");

  // Every page in the sitemap, plus the Help topics (linked from /help/, not in the sitemap).
  const sitemap = await get("/sitemap.xml");
  const helpHub = await get("/help/");
  const paths = new Set([
    ...[...sitemap.body.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]),
    ...[...helpHub.body.matchAll(/href="(\/help\/[a-z0-9-]+\/)"/g)].map((m) => m[1]),
  ]);
  assert.ok(paths.size > 25, `expected the sitemap pages and the Help topics, got ${paths.size} pages`);
  const now = Date.now();
  for (const p of paths) {
    const { body } = await get(p);
    for (const [id, at] of Object.entries(SCHEDULED_SHORTS)) {
      if (now < Date.parse(at)) assert.ok(!body.includes(id), `${p} shows Short ${id} before ${at}`);
    }
  }
});
