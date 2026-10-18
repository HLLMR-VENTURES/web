#!/usr/bin/env node
// Writes .lycheeignore so the offline link check skips links to pages the URL contract still
// marks pending (not ported yet). Once an entry loses its `pending` field, links to it are checked
// again automatically. With CONTRACT_STRICT=1 nothing is ignored.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const contract = JSON.parse(readFileSync(`${root}tests/url-contract/silo.urls.json`, "utf8"));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const pending =
  process.env.CONTRACT_STRICT === "1"
    ? []
    : [
        ...contract.entries.filter((e) => e.pending).map((e) => e.path.split("?")[0]),
        ...(contract.anchors.pending ? Object.values(contract.anchors.map) : []),
      ];
const dirs = [...new Set(pending.map((p) => (p.endsWith("/") || p.endsWith(".html") || p.endsWith(".json") ? p : `${p}/`)))];
const lines = dirs.map((p) => `^file://.*/dist${esc(p)}(index\\.html)?(#.*)?$`);
writeFileSync(`${root}.lycheeignore`, lines.join("\n") + (lines.length ? "\n" : ""));
console.log(`.lycheeignore: ${lines.length} pending path(s) skipped`);
