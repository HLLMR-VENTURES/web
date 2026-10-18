// A small, deliberately literal model of deploy/silo/nginx.conf, so `npm test` can check the URL
// contract against the built site without Docker. CI also runs the same contract against the real
// nginx image with the real config (tests/url-contract/run-nginx.sh); when the two disagree, the
// real nginx wins and this model gets fixed.
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * @typedef {{ status: number, location?: string, body?: string }} ModelResponse
 * @typedef {{ go: Record<string,string>, vanity: Record<string,string>, permanent: Record<string,string> }} Redirects
 */

/**
 * Build a request handler that mirrors the nginx server block.
 * @param {object} opts
 * @param {string} opts.root - the built site (release directory)
 * @param {Redirects} opts.redirects - parsed sites/silo/redirects.json
 * @param {Record<string,string>} opts.runtime - URL path -> local file for runtime aliases
 * @returns {(method: string, url: string) => ModelResponse}
 */
export function createNginxModel({ root, redirects, runtime }) {
  /** exact `location = /x { return ...; }` blocks, as generated into redirects.conf */
  const exact = new Map();
  for (const [key, to] of Object.entries(redirects.go)) exact.set(`/go/${key}`, { status: 302, location: to });
  for (const [from, to] of Object.entries(redirects.vanity)) exact.set(from, { status: 302, location: to });
  for (const [from, to] of Object.entries(redirects.permanent)) exact.set(from, { status: 301, location: to });

  const isFile = (p) => existsSync(p) && statSync(p).isFile();
  const isDir = (p) => existsSync(p) && statSync(p).isDirectory();
  const read = (p) => readFileSync(p, "utf8");
  const local = (uri) => path.join(root, ...uri.split("/").filter(Boolean));
  const notFound = () => {
    const p = path.join(root, "404.html");
    return { status: 404, body: isFile(p) ? read(p) : "" };
  };

  /**
   * nginx `try_files $uri $uri/ <fallback>` with `index index.html` and the automatic
   * directory redirect (which keeps the query string).
   */
  const tryFiles = (uri, query, fallbacks) => {
    const p = local(uri);
    if (!uri.endsWith("/") && isFile(p)) return { status: 200, body: read(p) };
    if (isDir(p)) {
      if (!uri.endsWith("/")) return { status: 301, location: `${uri}/${query}` };
      const idx = path.join(p, "index.html");
      if (isFile(idx)) return { status: 200, body: read(idx) };
    }
    for (const fb of fallbacks) {
      const f = fb === "$uri.html" ? local(`${uri.replace(/\/$/, "")}.html`) : local(fb);
      if (fb === "$uri.html" && uri.endsWith("/")) continue;
      if (isFile(f)) return { status: 200, body: read(f) };
    }
    return notFound();
  };

  return function handle(method, url) {
    const q = url.indexOf("?");
    const uri = decodeURIComponent(q === -1 ? url : url.slice(0, q));
    const query = q === -1 ? "" : url.slice(q);

    if (uri === "/healthz") return { status: 200, body: "ok\n" };
    if (method !== "GET" && method !== "HEAD") return { status: 405 };
    if (/\/\./.test(uri)) return { status: 403 };
    if (exact.has(uri)) return exact.get(uri);
    if (runtime[uri]) return isFile(runtime[uri]) ? { status: 200, body: read(runtime[uri]) } : notFound();
    if (uri.startsWith("/authors/")) return tryFiles(uri, query, ["/authors/profile.shell.html"]);
    return tryFiles(uri, query, ["$uri.html"]);
  };
}
