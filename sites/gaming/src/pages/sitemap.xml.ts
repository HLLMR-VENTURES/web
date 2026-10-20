// /sitemap.xml: every indexable page of gaming.hllmr.com, dated by the site revision (never the build clock).
import type { APIRoute } from "astro";
import { REVISION } from "../lib/site";

const PAGES = ["/", "/privacy/"];

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("Astro `site` is not configured");
  const lastmod = REVISION.date === "unreleased" ? "" : `\n    <lastmod>${REVISION.date}</lastmod>`;
  const urls = PAGES.map((p) => `  <url>\n    <loc>${new URL(p, site).toString()}</loc>${lastmod}\n  </url>`).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
