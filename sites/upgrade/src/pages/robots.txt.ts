// /robots.txt, generated from SITE_URL. All crawlers welcome, as on hllmr.com.
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("Astro `site` is not configured");
  const body = [`# HLLMR UPGRADE, ${site.origin}`, "User-agent: *", "Allow: /", "", `Sitemap: ${new URL("/sitemap.xml", site).toString()}`, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
