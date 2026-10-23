/**
 * The project schedule. One record per project feeds hllmr.com (home page and /projects/) and
 * dhellmer.com. Every fact here must be checkable from a public link or be phrased as the
 * company's own account. Do not add customers, ratings, usage counts or testimonials without the
 * owner's say-so. URLs are absolute (ADR-0015 D6); sites render their own with `local()`.
 */
import { ORIGINS, hub } from "./urls.ts";

/**
 * The HLLMR divisions (ADR-0015 D1): the parent, HLLMR Ventures (VNTRS), and the four divisions
 * under it. A division is not a separate company until an LLC exists (D5).
 */
export const DIVISIONS = ["vntrs", "tools", "upgrade", "live", "gaming"] as const;
export type Division = (typeof DIVISIONS)[number];

/** Public availability of a product, from evidence (a release, a license, a repository). */
export const AVAILABILITY = ["Available", "Development", "Research", "Archived"] as const;
export type Availability = (typeof AVAILABILITY)[number];

export interface Project {
  tag: string;
  slug: string;
  name: string;
  /** One line: what it is. */
  what: string;
  /** Two or three sentences for the schedule and cards. */
  summary: string;
  status: string;
  kind: "Product" | "Infrastructure" | "Method" | "Library" | "Mod" | "Tooling";
  /** The division it belongs to. */
  division: Division;
  /** Availability, for products and libraries; absent for the company's own infrastructure. */
  availability?: Availability;
  /** True for an early release (v0.x or untagged): usable, not settled. */
  early?: boolean;
  /** Its page on hllmr.com, if any (absolute URL). */
  page?: string;
  links: { label: string; href: string }[];
}

export const PROJECTS: Project[] = [
  {
    tag: "P-01",
    slug: "silo",
    name: "Silo",
    what: "A free, open-source mod manager for Farming Simulator 25.",
    summary:
      "Silo reads a player's mods and game log, points to the likely culprit when the game crashes, and flags conflicts before launch. A desktop app, a public catalog API and a Discord bot, built and released by one developer working with AI agents.",
    status: "Released, 1.0",
    kind: "Product",
    division: "gaming",
    availability: "Available",
    page: hub("/projects/silo/"),
    links: [
      { label: "silo.hllmr.com", href: "https://silo.hllmr.com" },
      { label: "source", href: "https://github.com/HLLMR-VENTURES/silo" },
    ],
  },
  {
    tag: "P-02",
    slug: "self-hosted-stack",
    name: "Self-hosted business stack",
    what: "The company's own mail, files, documents, automation and recovery, on hardware it controls.",
    summary:
      "HLLMR runs its business on infrastructure it operates instead of renting by the seat. AI agents do much of the operating work inside written roles. The owner approves every change, merge and release, and every backup is proven by restoring it.",
    status: "In production",
    kind: "Infrastructure",
    division: "upgrade",
    page: hub("/projects/self-hosted-stack/"),
    links: [],
  },
  {
    tag: "P-03",
    slug: "writwall",
    name: "Writwall",
    what: "A governance method for building software with AI agents.",
    summary:
      "A human ratifies intent, work is dispatched one bounded unit at a time with an explicit capability grant, a separate review checks the result against the record, and every enforcement layer is birth-tested before it is trusted. Public, with its full pilot log, including the measurements that went the wrong way.",
    status: "Public, CC BY 4.0",
    kind: "Method",
    division: "tools",
    availability: "Available",
    page: hub("/writwall/"),
    links: [{ label: "source", href: "https://github.com/HLLMR-VENTURES/writwall" }],
  },
  {
    tag: "P-04",
    slug: "conset",
    name: "Conset",
    what: "A deterministic parser for construction drawings and specifications.",
    summary:
      "It reads a drawing set and a spec book the same way every time, with no model in the loop, because a document-control pipeline cannot rest on a component that guesses.",
    status: "In development",
    kind: "Library",
    division: "tools",
    availability: "Development",
    links: [],
  },
  {
    tag: "P-05",
    slug: "stratum-dsp",
    name: "Stratum DSP",
    what: "An audio analysis engine in Rust, published on crates.io.",
    summary:
      "BPM detection, key detection and beat tracking for DJ applications, and the engine behind Stratum. The same preference for tools that behave identically on every run, in a different domain.",
    status: "Published, 1.0",
    kind: "Library",
    division: "tools",
    availability: "Available",
    links: [
      { label: "crates.io", href: "https://crates.io/crates/stratum-dsp" },
      { label: "source", href: "https://github.com/HLLMR-VENTURES/stratum-dsp" },
    ],
  },
  {
    tag: "P-06",
    slug: "fs25-markets",
    name: "Realistic Market Demand and Input Market",
    what: "Two economy mods for Farming Simulator 25.",
    summary:
      "Selling prices that respond to demand, so flooding a market drops its price, and a buy-side companion in which fuel, fertilizer and seed prices drift by month. Single-player, PC. Licensed CC BY-NC-SA 4.0.",
    status: "Public",
    kind: "Mod",
    division: "gaming",
    availability: "Available",
    links: [
      { label: "demand", href: "https://github.com/HLLMR-VENTURES/FS25_RealisticMarketDemand" },
      { label: "inputs", href: "https://github.com/HLLMR-VENTURES/FS25_RealisticInputMarket" },
    ],
  },
  {
    tag: "P-07",
    slug: "agent-tooling",
    name: "Agent tooling",
    what: "Small open-source tools for teams running AI agents.",
    summary:
      "openrouter-media, an MCP server that gives agents image and video generation as tools, and paperclip-spend-guard, a plugin that gives an agent workforce cost visibility and budget guardrails on metered models. Both early.",
    status: "Public, MIT, early",
    kind: "Tooling",
    division: "tools",
    availability: "Available",
    early: true,
    links: [
      { label: "openrouter-media", href: "https://github.com/HLLMR-VENTURES/openrouter-media" },
      { label: "spend-guard", href: "https://github.com/HLLMR-VENTURES/paperclip-spend-guard" },
    ],
  },
  {
    tag: "P-08",
    slug: "curia",
    name: "Curia",
    what: "A check on AI agents' claims that a change works.",
    summary:
      "Curia sends a reviewer whose job is to refute a change by running commands against the real system, not by reading the diff, and returns confirmed, refuted or unverified. An early public version is out under a noncommercial license; it is not yet packaged for other projects.",
    status: "Preview, v0.1",
    kind: "Tooling",
    division: "tools",
    availability: "Development",
    early: true,
    links: [{ label: "source", href: "https://github.com/HLLMR-VENTURES/curia" }],
  },
  {
    tag: "P-09",
    slug: "stratum",
    name: "Stratum",
    what: "A DJ software platform for library management and set preparation.",
    summary:
      "In design. A desktop library app exists in private development, paused since December 2025, and Stratum DSP is its published engine. No release date.",
    status: "Research, paused",
    kind: "Product",
    division: "tools",
    availability: "Research",
    links: [],
  },
  {
    tag: "P-10",
    slug: "staqs",
    name: "Staqs",
    what: "Personal finance for people with a day job and a side business.",
    summary: "In design, including a scenario engine for testing financial decisions before making them. Nothing released.",
    status: "Research",
    kind: "Product",
    division: "tools",
    availability: "Research",
    links: [],
  },
];

/** Incubator stages, in order. Every venture and project sits at exactly one. */
export const STAGES = ["Idea", "Building", "Launched", "Spun out"] as const;
export type Stage = (typeof STAGES)[number];

/** Stage of each project above, for the hub register. */
export const PROJECT_STAGE: Record<string, Stage> = {
  silo: "Launched",
  "self-hosted-stack": "Launched",
  writwall: "Launched",
  conset: "Building",
  "stratum-dsp": "Launched",
  "fs25-markets": "Launched",
  "agent-tooling": "Launched",
  curia: "Building",
  stratum: "Building",
  staqs: "Idea",
};

/**
 * Ventures: the four divisions of HLLMR Ventures (ADR-0015 D1), each with its own site and arms
 * (@hllmr/brand, src/arms.ts). A division can graduate to its own company; until then it is a
 * division, never a subsidiary (D5). Stages: Launched = it has something released or on offer;
 * Building = its site exists and its first work is being made.
 */
export interface Venture {
  slug: string;
  /** Key into the armory (@hllmr/brand, src/arms.ts). */
  coat: "tools" | "upgrade" | "live" | "gaming";
  name: string;
  /** The field it works in, in one or two words. */
  field: string;
  line: string;
  stage: Stage;
  /** Its front door (absolute URL). */
  href?: string;
}

export const VENTURES: Venture[] = [
  {
    slug: "tools",
    coat: "tools",
    name: "HLLMR TOOLS",
    field: "Software",
    line: "Useful software, built with purpose: released tools, projects in development and research.",
    stage: "Launched",
    href: `${ORIGINS.tools}/`,
  },
  {
    slug: "upgrade",
    coat: "upgrade",
    name: "HLLMR UPGRADE",
    field: "Business systems",
    line: "Connected websites and operational software for owner-run service businesses, kept running.",
    stage: "Launched",
    href: `${ORIGINS.upgrade}/`,
  },
  {
    slug: "live",
    coat: "live",
    name: "HLLMR LIVE",
    field: "Media",
    line: "DJ sets, events, video and demos under the HLLMR name.",
    stage: "Building",
    href: `${ORIGINS.live}/`,
  },
  {
    slug: "gaming",
    coat: "gaming",
    name: "HLLMR GAMING",
    field: "Gaming",
    line: "Silo, game mods, and games to come.",
    stage: "Launched",
    href: `${ORIGINS.gaming}/`,
  },
];
