/** Site-wide constants for silo.hllmr.com. Absolute URLs derive from Astro's `site` (SITE_URL). */

export const SITE_NAME = "Silo";
export const OWNER = "HLLMR Ventures LLC";
export const THEME_STORAGE_KEY = "silo-theme";

/** SiloAPI origin, fixed at build time (see astro.config.mjs). */
export const SILO_API: string = import.meta.env.PUBLIC_SILO_API ?? "https://silo-api.hllmr.com";

export const LINKS = {
  source: "https://github.com/HLLMR/silo",
  releases: "https://github.com/HLLMR/silo/releases",
  discussions: "https://github.com/HLLMR/silo/discussions",
  issues: "https://github.com/HLLMR/silo/issues",
  newIssue: "https://github.com/HLLMR/silo/issues/new/choose",
  hllmr: "https://hllmr.com/",
  verifyDownload: "https://github.com/HLLMR/silo/blob/main/docs/VERIFY_DOWNLOAD.md",
  /** Vanity redirect served by this site (nginx 302, static stub fallback). */
  discord: "/discord",
  orgGithub: "https://github.com/HLLMR",
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
