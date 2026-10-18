// /sitemap.xml, generated from the page registry (src/lib/pages.ts). noindex pages are never listed.
import type { APIRoute } from "astro";
import { builtPages, lastmod } from "../lib/pages";

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("Astro `site` is not configured");
  const urls = builtPages()
    .map(
      (p) =>
        `  <url>\n    <loc>${new URL(p.path, site).toString()}</loc>\n    <lastmod>${lastmod(p.source)}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
