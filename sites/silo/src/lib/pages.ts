/**
 * Indexable page registry for sitemap.xml and llms.txt. A page is listed only once its source
 * file exists, so the sitemap never advertises an unported page. lastmod is the source file's
 * last commit date (git), falling back to the build date outside a git checkout.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

export interface IndexablePage {
  path: string;
  /** Source file relative to sites/silo/. */
  source: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
}

export const INDEXABLE: IndexablePage[] = [
  { path: "/", source: "src/pages/index.astro", changefreq: "weekly", priority: 1.0 },
  { path: "/browse/", source: "src/pages/browse/index.astro", changefreq: "daily", priority: 0.9 },
  { path: "/help/", source: "src/pages/help/index.astro", changefreq: "monthly", priority: 0.8 },
  { path: "/trust/", source: "src/pages/trust/index.astro", changefreq: "weekly", priority: 0.8 },
  { path: "/download/", source: "src/pages/download/index.astro", changefreq: "weekly", priority: 0.9 },
  { path: "/changelog/", source: "src/pages/changelog/index.astro", changefreq: "weekly", priority: 0.6 },
  { path: "/community/", source: "src/pages/community/index.astro", changefreq: "monthly", priority: 0.5 },
  // /authors/ (the author program) joins when SiloAPI's author endpoints ship (owner, 2026-10-18).
  { path: "/legal/", source: "src/pages/legal/index.astro", changefreq: "monthly", priority: 0.4 },
  { path: "/legal/privacy-policy.html", source: "src/content/legal/privacy-policy.md", changefreq: "monthly", priority: 0.4 },
  { path: "/legal/terms-of-service.html", source: "src/content/legal/terms-of-service.md", changefreq: "monthly", priority: 0.4 },
  { path: "/legal/disclaimer.html", source: "src/content/legal/disclaimer.md", changefreq: "monthly", priority: 0.3 },
  { path: "/legal/copyright-takedown.html", source: "src/content/legal/copyright-takedown.md", changefreq: "monthly", priority: 0.3 },
];

// Build code is bundled before it runs, so import.meta.url does not point at src/. The build
// always runs from sites/silo (npm -w / astro build), which we assert.
const siteRoot = process.cwd().replace(/[\\/]?$/, "/");
if (!existsSync(siteRoot + "astro.config.mjs")) {
  throw new Error(`pages.ts: expected to run from sites/silo, got ${siteRoot}`);
}

/** @returns the registry entries whose source file exists */
export function builtPages(): IndexablePage[] {
  return INDEXABLE.filter((p) => existsSync(siteRoot + p.source));
}

/**
 * Last commit date (YYYY-MM-DD) of a source file.
 * @param source - path relative to sites/silo/
 * @returns the date, or today's date when git has no record of the file
 */
export function lastmod(source: string): string {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", source], {
      cwd: siteRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    /* not a git checkout */
  }
  return new Date().toISOString().slice(0, 10);
}
