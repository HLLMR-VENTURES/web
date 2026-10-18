// /robots.txt, generated from SITE_URL. Policy unchanged from the hand-written original: all
// crawlers welcome, including AI and answer-engine crawlers.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("Astro `site` is not configured");
  const body = [
    `# Silo — ${site.origin}`,
    "# Everything here is public marketing content. Crawlers welcome, including AI /",
    "# answer-engine crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …) —",
    "# we want Silo to be discoverable and citable, so nothing is disallowed.",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("/sitemap.xml", site).toString()}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
