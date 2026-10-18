// /robots.txt, generated from SITE_URL. Same policy as hllmr.com
// and silo.hllmr.com: all crawlers welcome. Changing it (for example to
// disallow model-training crawlers) is an owner decision.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("Astro `site` is not configured");
  const body = [
    `# David Hellmer, ${site.origin}`,
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("/sitemap.xml", site).toString()}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
