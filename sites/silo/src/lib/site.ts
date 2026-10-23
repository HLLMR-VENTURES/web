/** Site-wide constants for silo.hllmr.com. Absolute URLs derive from Astro's `site` (SITE_URL). */

export const SITE_NAME = "Silo";
export const OWNER = "HLLMR Ventures LLC";
export const THEME_STORAGE_KEY = "silo-theme";

/** SiloAPI origin, fixed at build time (see astro.config.mjs). */
export const SILO_API: string = import.meta.env.PUBLIC_SILO_API ?? "https://silo-api.hllmr.com";

/** GitHub API origin for the /c/ page, fixed at build time (fixture server in tests). */
export const GITHUB_API: string = import.meta.env.PUBLIC_GITHUB_API ?? "https://api.github.com";

/**
 * Silo's GitHub repository. It moved from HLLMR/silo to HLLMR-VENTURES/silo on 2026-10-21; GitHub
 * redirects the old URLs, and shipped app builds still use them. Checks on GitHub-supplied URLs
 * accept either owner (SILO_REPO_URLS), so data written before or after the move both pass.
 */
export const SILO_REPO = "HLLMR-VENTURES/silo";
export const SILO_REPO_URLS = [`https://github.com/${SILO_REPO}/`, "https://github.com/HLLMR/silo/"] as const;

export const LINKS = {
  source: `https://github.com/${SILO_REPO}`,
  releases: `https://github.com/${SILO_REPO}/releases`,
  discussions: `https://github.com/${SILO_REPO}/discussions`,
  issues: `https://github.com/${SILO_REPO}/issues`,
  newIssue: `https://github.com/${SILO_REPO}/issues/new/choose`,
  hllmr: "https://hllmr.com/",
  /** HLLMR GAMING, the division Silo is endorsed under (ADR-0015 D4). */
  gaming: "https://gaming.hllmr.com/",
  verifyDownload: `https://github.com/${SILO_REPO}/blob/main/docs/VERIFY_DOWNLOAD.md`,
  /** Vanity redirect served by this site (nginx 302, static stub fallback). */
  discord: "/discord",
  orgGithub: "https://github.com/HLLMR-VENTURES",
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
