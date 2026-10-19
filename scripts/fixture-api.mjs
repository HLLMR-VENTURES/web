#!/usr/bin/env node
// Minimal SiloAPI stand-in for local development and browser tests, serving
// tests/fixtures/silo-api/, plus the two GitHub API reads the /c/ page makes (tests/fixtures/github/). Mirrors the planned CORS split: public routes answer any origin
// without credentials; /auth and /author answer only the site origin, with credentials.
//   npm run fixtures            (FIXTURE_SIGNED_IN=1 makes GET /author/me return 200)
//   PUBLIC_SILO_API=http://127.0.0.1:8787 npm run dev
//   PUBLIC_GITHUB_API=http://127.0.0.1:8787 npm run dev   (then /c/?g=0123456789abcdef0123456789abcdef)
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.FIXTURE_PORT ?? 8787);
const SITE_ORIGINS = new Set(["http://localhost:4321", "http://127.0.0.1:4321", "http://localhost:4322"]);
const dir = fileURLToPath(new URL("../tests/fixtures/silo-api/", import.meta.url));
const ghDir = fileURLToPath(new URL("../tests/fixtures/github/", import.meta.url));
const LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(body === undefined ? "" : JSON.stringify(body));
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  const origin = req.headers.origin ?? "";
  const credentialed = /^\/(auth|author)(\/|$)/.test(url.pathname);
  const cors = credentialed
    ? SITE_ORIGINS.has(origin)
      ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Credentials": "true", Vary: "Origin" }
      : {}
    : { "Access-Control-Allow-Origin": "*" };

  if (req.method === "OPTIONS") return send(res, 204, undefined, { ...cors, "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE", "Access-Control-Allow-Headers": "content-type" });
  if (req.method !== "GET") return send(res, 405, { error: "fixture server is read-only" }, cors);

  const m = url.pathname.match(/^\/authors\/([^/]+)$/);
  if (m) {
    const login = decodeURIComponent(m[1]);
    const f = `${dir}authors/${login.toLowerCase()}.json`;
    if (!LOGIN.test(login) || !existsSync(f)) return send(res, 404, { error: "not found" }, cors);
    return send(res, 200, JSON.parse(readFileSync(f, "utf8")), { ...cors, "Cache-Control": "max-age=300" });
  }
  if (url.pathname === "/author/me") {
    if (process.env.FIXTURE_SIGNED_IN !== "1") return send(res, 401, { error: "signed out" }, cors);
    return send(res, 200, JSON.parse(readFileSync(`${dir}author/me.json`, "utf8")), cors);
  }
  // GitHub: GET /gists/:id (JSON) and GET /repos/:owner/:repo/contents/silo-collection.json (raw).
  const gist = url.pathname.match(/^\/gists\/([0-9a-fA-F]{20,40})$/);
  if (gist) {
    const f = `${ghDir}gists/${gist[1].toLowerCase()}.json`;
    if (!existsSync(f)) return send(res, 404, { message: "Not Found" }, cors);
    return send(res, 200, JSON.parse(readFileSync(f, "utf8")), cors);
  }
  const repo = url.pathname.match(/^\/repos\/([A-Za-z0-9-]{1,39})\/([A-Za-z0-9._-]{1,100})\/contents\/silo-collection\.json$/);
  if (repo) {
    const f = `${ghDir}repos/${repo[1].toLowerCase()}__${repo[2].toLowerCase()}.json`;
    if (!existsSync(f)) return send(res, 404, { message: "Not Found" }, cors);
    res.writeHead(200, { "Content-Type": "application/vnd.github.raw+json", ...cors });
    return res.end(readFileSync(f, "utf8"));
  }
  if (url.pathname === "/rate-limited/gists/0123456789abcdef0123456789abcdef") {
    return send(res, 403, { message: "API rate limit exceeded" }, { ...cors, "x-ratelimit-remaining": "0", "Access-Control-Expose-Headers": "x-ratelimit-remaining" });
  }
  if (url.pathname === "/stats") return send(res, 200, JSON.parse(readFileSync(`${dir}stats.json`, "utf8")), cors);
  return send(res, 404, { error: "no fixture" }, cors);
}).listen(PORT, "127.0.0.1", () => console.log(`fixture SiloAPI on http://127.0.0.1:${PORT}`));
