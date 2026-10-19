// /llms.txt, rendered from the same feature data as the home page so the three copies the old
// site kept by hand (cards, JSON-LD, llms.txt) can no longer drift. /llms-full.txt (from the help
// MDX) joins with the help split.
import type { APIRoute } from "astro";
import { features } from "../lib/content";
import { LINKS, OWNER, SILO_API } from "../lib/site";

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error("Astro `site` is not configured");
  const at = (p: string) => new URL(p, site).toString();
  const lines = (await features()).map((f) => f.data.llms).filter(Boolean).map((l) => `- ${l}`);
  const body = `# Silo

> Silo is a free, open-source mod manager for Farming Simulator 25 (FS25). More farming,
> less fixing: it reads your mods and your game log, ranks mods by the errors they logged when
> the game crashes, flags conflicts before launch, and unifies ModHub and GitHub into one
> cross-source catalog. Organize shows every move before it touches a file, and Undo organizing
> puts every mod back in your mods folder.

Silo is a native desktop app for Windows, with macOS and Linux builds in preview. No account,
no ads, no telemetry, open source (MIT). Its catalog is served by a public read-only API
(SiloAPI) that aggregates mod metadata, versions, popularity and descriptions from ModHub and
GitHub.

## What Silo does
${lines.join("\n")}

## Principles
- Free and open source: the desktop app's source is on GitHub (MIT); the catalog server is a separate hosted service
- No account, no ads, no telemetry. Silo contacts its catalog only when you search Browse, open a mod's details, check for updates or verify a mod; it also checks GitHub for its own app updates at launch, which sends no library data. Server access logs are kept 30 days; only aggregate counts are published
- Never edits inside a mod; Organize shows every move before it touches a file; Undo organizing puts every mod back in the mods folder; updates keep the previous version in backups/; backs up before writing settings or saves
- Acts through your own GitHub account; ModHub pages open in your browser

## Links
- Site: ${at("/")}
- Source code: ${LINKS.source}
- Download / releases: ${LINKS.releases}
- Catalog API: ${SILO_API}/
- Report a bug: ${LINKS.issues}
- Privacy policy (every connection Silo makes): ${at("/legal/privacy-policy.html")}

## Notes
Not affiliated with GIANTS Software. Farming Simulator is a trademark of its respective
owner. Silo is made by ${OWNER} (Texas, USA).
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
