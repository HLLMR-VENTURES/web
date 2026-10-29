// URL contract for gaming.hllmr.com: the shared family runner (family-contract.mjs) over gaming.urls.json,
// plus the launch-video guard below. Run with `npm run test:gaming`, or CONTRACT_BASE_URL=... via
// run-nginx-family.sh gaming.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runFamilyContract } from "./family-contract.mjs";
import { createNginxModel } from "./nginx-model.mjs";

runFamilyContract("gaming");

// Launch Shorts scheduled on YouTube go public at 11:00 America/Chicago (CST, UTC-6, after the
// 2 November DST change). No page may carry one before then. Same list as contract.test.mjs (Silo).
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

test("gaming: the tour is on the home page, frames are limited to youtube-nocookie.com, the privacy page says so, and no Short appears before it is public", async () => {
  const here = (p) => fileURLToPath(new URL(p, import.meta.url));
  const BASE = process.env.CONTRACT_BASE_URL;
  const model = BASE
    ? null
    : createNginxModel({
        root: here("../../sites/gaming/dist/"),
        redirects: JSON.parse(readFileSync(here("../../sites/gaming/redirects.json"), "utf8")),
        runtime: {},
      });
  const get = async (path) => (model ? (model("GET", path).body ?? "") : (await fetch(new URL(path, BASE))).text());

  const home = await get("/");
  assert.ok(home.includes('data-vf-id="JE-sVn1OI4g"'), "home page shows the two-minute tour");
  const frameSrc = home.match(/<meta http-equiv="content-security-policy" content="[^"]*?(frame-src [^;"]*)/i)?.[1];
  assert.equal(frameSrc?.trim(), "frame-src https://www.youtube-nocookie.com");
  assert.ok((await get("/privacy/")).includes("youtube-nocookie.com"), "privacy page names the video player");

  const { entries } = JSON.parse(readFileSync(here("./gaming.urls.json"), "utf8"));
  const pages = entries.filter((e) => e.status === 200 && e.path.endsWith("/")).map((e) => e.path);
  const now = Date.now();
  for (const p of pages) {
    const body = await get(p);
    for (const [id, at] of Object.entries(SCHEDULED_SHORTS)) {
      if (now < Date.parse(at)) assert.ok(!body.includes(id), `${p} shows Short ${id} before ${at}`);
    }
  }
});
