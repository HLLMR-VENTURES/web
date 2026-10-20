/** Origins of the HLLMR sites. Portfolio URLs are absolute and built from these. */
export const ORIGINS = {
  vntrs: "https://hllmr.com",
  silo: "https://silo.hllmr.com",
  dhellmer: "https://dhellmer.com",
} as const;

/** An absolute URL on hllmr.com, from a path beginning with "/". */
export const hub = (path: string): string => `${ORIGINS.vntrs}${path}`;

/**
 * A link as a site should render it: a URL on the site's own origin becomes a path (so internal
 * link checks and local previews keep working); anything else stays absolute.
 * @param href - an absolute URL
 * @param origin - the rendering site's origin, e.g. ORIGINS.vntrs
 * @returns the path for a same-origin URL, otherwise the URL unchanged
 */
export function local(href: string, origin: string): string {
  return href.startsWith(`${origin}/`) ? href.slice(origin.length) : href;
}
