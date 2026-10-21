/** Site-wide constants for dhellmer.com. Absolute URLs derive from Astro's `site` (SITE_URL). */
import { execFileSync } from "node:child_process";

/** Public name string (owner decision 2026-10-18: "David Hellmer", matching hllmr.com's FOUNDER). */
export const NAME = "David Hellmer";
export const SITE_NAME = "David Hellmer";
export const LOCALITY = "Dallas–Fort Worth, Texas";
export const ROLE = "Founder, HLLMR Ventures";
export const THEME_STORAGE_KEY = "dhellmer-theme";

/** The company site, where the essays and the ventures' own pages live. */
export const HUB = "https://hllmr.com";

export const LINKS = {
  hub: HUB,
  hubContact: `${HUB}/contact/`,
  hubWriting: `${HUB}/writing/`,
  hubFeed: `${HUB}/feed.xml`,
  github: "https://github.com/HLLMR-VENTURES",
  siteSource: "https://github.com/HLLMR-VENTURES/web",
} as const;

export const NAV = [
  { href: "/about/", label: "About" },
  { href: "/cv/", label: "CV" },
  { href: "/writing/", label: "Writing" },
  { href: "/ventures/", label: "Ventures" },
  { href: "/elsewhere/", label: "Elsewhere" },
] as const;

/**
 * Profiles the site links to (owner decision 2026-10-18: no email on this site, links only).
 * List only profiles the owner has confirmed. A `pending` entry renders as a placeholder that a
 * release build refuses (TODO(v1-copy)), so nothing is guessed into production.
 */
export interface Profile {
  label: string;
  handle: string;
  href?: string;
  note: string;
  pending?: boolean;
}

export const PROFILES: Profile[] = [
  {
    label: "LinkedIn",
    handle: "linkedin.com/in/dhellmer",
    href: "https://www.linkedin.com/in/dhellmer",
    note: "The working history in full, and the best place for a professional introduction.",
  },
  {
    label: "GitHub",
    handle: "github.com/HLLMR-VENTURES",
    href: LINKS.github,
    note: "Code for Silo, Writwall, Stratum DSP and the rest, under the HLLMR Ventures organization.",
  },
];

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
 * The log's revision line in the footer: date and short hash of the last commit that touched this
 * site, the shared design package, or the hllmr.com data it reads (ventures and writing). Derived
 * from git, not from the build clock, so an unchanged rebuild is byte-identical.
 */
export const REVISION: { date: string; hash: string } = (() => {
  try {
    const out = execFileSync(
      "git",
      [
        "log",
        "-1",
        "--format=%cs %h",
        "--",
        ".",
        "../../packages/design",
        ...SILO_ONLY_DESIGN,
        "../../packages/portfolio",
      ],
      { cwd: process.cwd(), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    const [date, hash] = out.split(" ");
    if (date && hash && /^\d{4}-\d{2}-\d{2}$/.test(date)) return { date, hash };
  } catch {
    /* not a git checkout */
  }
  return { date: "unreleased", hash: "local" };
})();
