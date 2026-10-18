// /feed.xml: RSS 2.0 for the writing index. Dates come from src/lib/writing.ts, never the build
// clock, so an unchanged rebuild is byte-identical.
import type { APIRoute } from "astro";
import { WRITING } from "../lib/writing";
import { OWNER } from "../lib/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rfc822 = (iso: string) => new Date(`${iso}T12:00:00Z`).toUTCString();

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("Astro `site` is not configured");
  const sorted = [...WRITING].sort((a, b) => b.published.localeCompare(a.published));
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${esc(OWNER)}: writing</title>`,
    `    <link>${new URL("/writing/", site).toString()}</link>`,
    `    <atom:link href="${new URL("/feed.xml", site).toString()}" rel="self" type="application/rss+xml" />`,
    "    <description>Essays and notes on building software with AI agents.</description>",
    "    <language>en-us</language>",
  ];
  if (sorted[0]) lines.push(`    <lastBuildDate>${rfc822(sorted[0].published)}</lastBuildDate>`);
  for (const w of sorted) {
    const url = new URL(w.path, site).toString();
    lines.push(
      "    <item>",
      `      <title>${esc(w.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${rfc822(w.published)}</pubDate>`,
      `      <description>${esc(w.description)}</description>`,
      "    </item>",
    );
  }
  lines.push("  </channel>", "</rss>", "");
  return new Response(lines.join("\n"), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
