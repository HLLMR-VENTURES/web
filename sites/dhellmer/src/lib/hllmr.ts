/**
 * What dhellmer.com shows from hllmr.com: the divisions, the projects and the writing. Read
 * straight from the shared HLLMR portfolio record (@hllmr/portfolio, ADR-0015 D6) at build time,
 * so the personal site can never list a division, project or essay the company site does not (and
 * never misses one). The essays are linked, never copied: their canonical home is hllmr.com.
 */
import { PROJECTS, PROJECT_STAGE, VENTURES, WRITING, type Stage } from "@hllmr/portfolio";
import { HUB, NAME } from "./site";

/** hllmr.com paths become absolute links; external links pass through. */
const out = (href: string) => (href.startsWith("/") ? `${HUB}${href}` : href);

export interface VentureLink {
  slug: string;
  name: string;
  field: string;
  line: string;
  stage: Stage;
  /** Absolute URL of the venture's front door; absent while it has none (an Idea). */
  href?: string;
  /** Host shown next to the link, e.g. "silo.hllmr.com". */
  host?: string;
}

/** Short label for a link: the host, plus the path on hllmr.com (where the path names the page). */
const host = (href: string) => {
  const u = new URL(href);
  return u.host === "hllmr.com" ? u.host + u.pathname.replace(/\/$/, "") : u.host;
};

/** Every HLLMR venture, in the hub's order. */
export const VENTURE_LINKS: VentureLink[] = VENTURES.map((v) => {
  const href = v.href ? out(v.href) : undefined;
  return { slug: v.slug, name: v.name, field: v.field, line: v.line, stage: v.stage, href, host: href && host(href) };
});

export interface ProjectLink {
  slug: string;
  name: string;
  what: string;
  stage: Stage;
  href: string;
  host: string;
}

/** A project's own product site: a link on its own *.hllmr.com subdomain (e.g. silo.hllmr.com). */
const productSite = (p: (typeof PROJECTS)[number]) =>
  p.links.find((l) => {
    const h = new URL(l.href).hostname;
    return h.endsWith(".hllmr.com") && h !== "www.hllmr.com";
  })?.href;

/**
 * The hub's projects, each linked to its own product site if it has one, else its hllmr.com page,
 * else its first public link, else the register. A personal site points at the thing itself;
 * hllmr.com's case study stays one click away from there.
 */
export const PROJECT_LINKS: ProjectLink[] = PROJECTS.map((p) => {
  const href = out(productSite(p) ?? p.page ?? p.links[0]?.href ?? "/projects/");
  return { slug: p.slug, name: p.name, what: p.what, stage: PROJECT_STAGE[p.slug] ?? "Building", href, host: host(href) };
});

export interface Essay {
  title: string;
  description: string;
  published: string;
  kind: string;
  /** Canonical URL on hllmr.com. */
  href: string;
}

/** Writing by this site's owner, newest first, linked to its canonical page on hllmr.com. */
export const ESSAYS: Essay[] = WRITING.filter((w) => w.author === NAME)
  .map((w) => ({ title: w.title, description: w.description, published: w.published, kind: w.kind, href: out(w.path) }))
  .sort((a, b) => b.published.localeCompare(a.published));

/**
 * A date as "28 Aug 2026".
 * @param iso - YYYY-MM-DD
 */
export function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d} ${months[m - 1]} ${y}`;
}
