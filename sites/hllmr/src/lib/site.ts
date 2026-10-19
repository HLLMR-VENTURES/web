/** Site-wide constants for hllmr.com. Absolute URLs derive from Astro's `site` (SITE_URL). */
import { execFileSync } from "node:child_process";

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

export const NAV = [
  { href: "/projects/", label: "Ventures" },
  { href: "/writing/", label: "Writing" },
  { href: "/company/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

/** The AI-assisted development venture. Name "HLLMR Build" and path /build/ confirmed by the owner 2026-10-18. */
export const BUILD = {
  name: "HLLMR Build",
  label: "AI-assisted development",
  nav: [
    { href: "/build/", label: "Overview" },
    { href: "/build/services/", label: "Services" },
    { href: "/projects/silo/", label: "Case study" },
  ],
} as const;

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

/**
 * Design files that only silo.hllmr.com imports (through packages/design/silo.css). The footer
 * revision ignores them, so a Silo-only design commit leaves this site's content id unchanged.
 * Keep in step with the "!packages/design/..." excludes in this site's release workflow.
 */
const SILO_ONLY_DESIGN = ["silo.css", "skins/silo.css", "tokens/fonts.css"].map(
  (f) => `:(exclude)../../packages/design/${f}`,
);

/**
 * The drawing revision shown in the footer title block: date and short hash of the last commit
 * that touched this site or the shared design package. Derived from git, not from the build clock,
 * so an unchanged rebuild is byte-identical (the release id is content-addressed).
 */
export const REVISION: { date: string; hash: string } = (() => {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs %h", "--", ".", "../../packages/design", ...SILO_ONLY_DESIGN], {
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
