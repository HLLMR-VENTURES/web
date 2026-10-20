/** Site-wide constants for hllmr.com. Absolute URLs derive from Astro's `site` (SITE_URL). */
import { execFileSync } from "node:child_process";
import { ORIGINS, divisionSite, local } from "@hllmr/portfolio";

export const SITE_NAME = "HLLMR";
export const OWNER = "HLLMR Ventures LLC";
export const FOUNDER = "David Hellmer";
export const LOCALITY = "Dallas–Fort Worth, Texas";
export const THEME_STORAGE_KEY = "hllmr-theme";

/** The one contact route (owner decision 2026-10-18): a plain mailto, nothing sent by the site. */
export const CONTACT_EMAIL = "d@hllmr.com";

export const LINKS = {
  github: "https://github.com/HLLMR",
  silo: "https://silo.hllmr.com",
  siloSource: "https://github.com/HLLMR/silo",
  writwall: "https://github.com/HLLMR/writwall",
  writwallLatest: "https://github.com/HLLMR/writwall/releases/latest",
  siteSource: "https://github.com/HLLMR/web",
  /** The founder's personal site; it links back here (owner decision 2026-10-18: cross-link the two). */
  founder: "https://dhellmer.com",
} as const;

/** A portfolio URL as this site renders it: links to hllmr.com become paths, others stay absolute. */
export const here = (href: string): string => local(href, ORIGINS.vntrs);

/** HLLMR Ventures, shown as VNTRS: the parent of the four divisions (ADR-0015 D1). */
export const SITE = divisionSite("vntrs");

export const NAV = [
  { href: "/#divisions", label: "Divisions" },
  { href: "/projects/", label: "Register" },
  { href: "/writing/", label: "Writing" },
  { href: "/company/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

/**
 * Absolute URL for a site path, from the build-time origin.
 * @param path - a path beginning with "/"
 * @param site - Astro.site (the configured SITE_URL)
 * @returns the absolute URL string
 */
export function abs(path: string, site: URL | undefined): string {
  if (!site) throw new Error("Astro `site` is not configured");
  return new URL(path, site).toString();
}

// Design files that only silo.hllmr.com imports are named *silo*.css (silo.css, skins/silo.css,
// tokens/fonts-silo.css). The footer revision ignores them, so a Silo-only design commit leaves
// this site's content id unchanged. Same glob as the "!packages/design/**/*silo*.css" exclude in
// this site's release workflow. (Line comments: the glob would end a block comment.)
const SILO_ONLY_DESIGN = [":(exclude,glob)../../packages/design/**/*silo*.css"];

/**
 * The drawing revision shown in the footer title block: date and short hash of the last commit
 * that touched this site or the shared design package. Derived from git, not from the build clock,
 * so an unchanged rebuild is byte-identical (the release id is content-addressed).
 */
export const REVISION: { date: string; hash: string } = (() => {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs %h", "--", ".", "../../packages/design", ...SILO_ONLY_DESIGN, "../../packages/portfolio", "../../packages/brand"], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const [date, hash] = out.split(" ");
    if (date && hash && /^\d{4}-\d{2}-\d{2}$/.test(date)) return { date, hash };
  } catch {
    /* not a git checkout */
  }
  return { date: "unreleased", hash: "local" };
})();
