/**
 * The site revision shown in a family site's footer: date and short hash of the last commit that
 * touched what the site shows. Derived from git, not the build clock, so an unchanged rebuild is
 * byte-identical (the release id is content-addressed). Run from the site's directory (Astro's cwd).
 */
import { execFileSync } from "node:child_process";

/** Design files only silo.hllmr.com imports (named *silo*.css); no family site's revision follows them. */
export const SILO_ONLY_DESIGN = ":(exclude,glob)../../packages/design/**/*silo*.css";

/** Paths every family site shows, relative to its sites/<name> directory. */
export const FAMILY_PATHS = [
  ".",
  "../../packages/brand",
  "../../packages/design",
  SILO_ONLY_DESIGN,
  "../../packages/portfolio",
] as const;

/**
 * @param paths - git pathspecs, relative to the site directory
 * @returns the last commit's date and short hash, or "unreleased"/"local" outside a git checkout
 */
export function revision(paths: readonly string[] = FAMILY_PATHS): { date: string; hash: string } {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs %h", "--", ...paths], {
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
}
