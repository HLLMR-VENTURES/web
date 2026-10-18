// Link-check exclusions derived from the URL contract (tests/url-contract/silo.urls.json).
//
// A page the contract still marks `pending` (not ported yet) has no file in dist/, so links to it
// cannot resolve offline. Exactly those pages are excluded; when an entry loses `pending`, its
// links are checked again with no other change. CONTRACT_STRICT=1 excludes nothing.
//
// Patterns match the file:// URLs lychee reports after resolving a root-relative link against
// --root-dir: lychee drops the trailing slash (`/browse/` -> `file://…/dist/browse`) and keeps any
// fragment (`/help/#updates-h` -> `file://…/dist/help#updates-h`).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const contractPath = fileURLToPath(new URL("../tests/url-contract/silo.urls.json", import.meta.url));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Site paths of pending contract entries, normalized: no query, no trailing slash, no index.html.
 * @returns {string[]} e.g. ["/browse", "/legal/privacy-policy.html"]
 */
export function pendingPaths() {
  if (process.env.CONTRACT_STRICT === "1") return [];
  const contract = JSON.parse(readFileSync(contractPath, "utf8"));
  const raw = [
    ...contract.entries.filter((e) => e.pending).map((e) => e.path),
    ...(contract.anchors?.pending ? Object.values(contract.anchors.map) : []),
  ];
  const norm = raw
    .map((p) => p.split("?")[0].replace(/\/index\.html$/, "").replace(/\/$/, ""))
    .filter((p) => p !== "");
  return [...new Set(norm)].sort();
}

/**
 * Regexes (as strings) matching resolved links to pending pages, with or without a trailing
 * slash, an explicit index.html, or a fragment. Nothing below a pending page is matched.
 * @returns {string[]}
 */
export function pendingPatterns() {
  return pendingPaths().map((p) => `^file://.*/sites/silo/dist${esc(p)}(/|/index\\.html)?(#.*)?$`);
}
