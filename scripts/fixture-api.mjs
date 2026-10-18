#!/usr/bin/env node
// Minimal SiloAPI stand-in for local development and browser tests, serving
// tests/fixtures/silo-api/. Mirrors the planned CORS split: public routes answer any origin
// without credentials; /auth and /author answer only the site origin, with credentials.
//   npm run fixtures            (FIXTURE_SIGNED_IN=1 makes GET /author/me return 200)
//   PUBLIC_SILO_API=http://127.0.0.1:8787 npm run dev
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.FIXTURE_PORT ?? 8787);
const SITE_ORIGINS = new Set(["http://localhost:4321", "http://127.0.0.1:4321", "http://localhost:4322"]);
const dir = fileURLToPath(new URL("../tests/fixtures/silo-api/", import.meta.url));
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
  if (url.pathname === "/stats") return send(res, 200, JSON.parse(readFileSync(`${dir}stats.json`, "utf8")), cors);
  return send(res, 404, { error: "no fixture" }, cors);
}).listen(PORT, "127.0.0.1", () => console.log(`fixture SiloAPI on http://127.0.0.1:${PORT}`));
