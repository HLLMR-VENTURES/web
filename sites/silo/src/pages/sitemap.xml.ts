// /sitemap.xml (the legacy URL robots.txt and search consoles already know). Generated from the
// page registry; noindex pages, /c/, /go/ and author dashboard states are never listed.
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
