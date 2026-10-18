/**
 * Indexable page registry for sitemap.xml. A page is listed only once its source file exists.
 * lastmod is the source file's last commit date (git), falling back to the build date.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

export interface IndexablePage {
  path: string;
  /** Source file relative to sites/hllmr/. */
  source: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;
}

export const INDEXABLE: IndexablePage[] = [
  { path: "/", source: "src/pages/index.astro", changefreq: "monthly", priority: 1.0 },
  { path: "/services/", source: "src/pages/services/index.astro", changefreq: "monthly", priority: 0.9 },
  { path: "/projects/", source: "src/pages/projects/index.astro", changefreq: "monthly", priority: 0.9 },
  { path: "/projects/silo/", source: "src/pages/projects/silo/index.astro", changefreq: "monthly", priority: 0.8 },
  { path: "/projects/self-hosted-stack/", source: "src/pages/projects/self-hosted-stack/index.astro", changefreq: "monthly", priority: 0.8 },
  { path: "/writing/", source: "src/pages/writing/index.astro", changefreq: "monthly", priority: 0.7 },
  { path: "/writing/document-control-for-ai-agents/", source: "src/pages/writing/document-control-for-ai-agents/index.astro", changefreq: "yearly", priority: 0.8 },
  { path: "/writwall/", source: "src/pages/writwall/index.astro", changefreq: "monthly", priority: 0.6 },
  { path: "/company/", source: "src/pages/company/index.astro", changefreq: "yearly", priority: 0.6 },
  { path: "/contact/", source: "src/pages/contact/index.astro", changefreq: "yearly", priority: 0.6 },
  { path: "/privacy/", source: "src/pages/privacy/index.astro", changefreq: "yearly", priority: 0.3 },
];

// Build code is bundled before it runs, so import.meta.url does not point at src/. The build
// always runs from sites/hllmr (npm -w / astro build), which we assert.
const siteRoot = process.cwd().replace(/[\\/]?$/, "/");
if (!existsSync(siteRoot + "astro.config.mjs") || !siteRoot.replace(/\\/g, "/").endsWith("sites/hllmr/")) {
  throw new Error(`pages.ts: expected to run from sites/hllmr, got ${siteRoot}`);
}

/** @returns the registry entries whose source file exists */
export function builtPages(): IndexablePage[] {
  return INDEXABLE.filter((p) => existsSync(siteRoot + p.source));
}

/**
 * Last commit date (YYYY-MM-DD) of a source file.
 * @param source - path relative to sites/hllmr/
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
