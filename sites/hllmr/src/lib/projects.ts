/**
 * The project schedule. One record per project feeds the home page and /projects/.
 * Every fact here must be checkable from a public link or be phrased as the company's own account.
 * Do not add customers, ratings, usage counts or testimonials without the owner's say-so.
 */
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
  /** Page on this site, if any. */
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
    status: "Public beta, shipping",
    kind: "Product",
    page: "/projects/silo/",
    links: [
      { label: "silo.hllmr.com", href: "https://silo.hllmr.com" },
      { label: "source", href: "https://github.com/HLLMR/silo" },
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
    page: "/projects/self-hosted-stack/",
    links: [],
  },
  {
    tag: "P-03",
    slug: "writwall",
    name: "Writwall",
    what: "A governance method for building software with AI agents.",
    summary:
      "A human ratifies intent, work is dispatched one bounded unit at a time with an explicit capability grant, a separate review checks the result against the record, and every enforcement layer is birth-tested before it is trusted. Public, with its full pilot log, including the measurements that went the wrong way.",
    status: "Public",
    kind: "Method",
    page: "/writwall/",
    links: [{ label: "source", href: "https://github.com/HLLMR/writwall" }],
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
    links: [],
  },
  {
    tag: "P-05",
    slug: "stratum-dsp",
    name: "stratum-dsp",
    what: "An audio analysis engine in Rust, published on crates.io.",
    summary:
      "BPM detection, key detection and beat tracking for DJ applications. The same preference for tools that behave identically on every run, in a different domain.",
    status: "Published, 1.0",
    kind: "Library",
    links: [
      { label: "crates.io", href: "https://crates.io/crates/stratum-dsp" },
      { label: "source", href: "https://github.com/HLLMR/stratum-dsp" },
    ],
  },
  {
    tag: "P-06",
    slug: "fs25-markets",
    name: "Realistic Market Demand and Input Market",
    what: "Two economy mods for Farming Simulator 25.",
    summary:
      "Selling prices that respond to demand, so flooding a market drops its price, and a buy-side companion in which fuel, fertilizer and seed prices drift by month. Single-player, PC.",
    status: "Public",
    kind: "Mod",
    links: [
      { label: "demand", href: "https://github.com/HLLMR/FS25_RealisticMarketDemand" },
      { label: "inputs", href: "https://github.com/HLLMR/FS25_RealisticInputMarket" },
    ],
  },
  {
    tag: "P-07",
    slug: "agent-tooling",
    name: "Agent tooling",
    what: "Small open-source tools for teams running AI agents.",
    summary:
      "openrouter-media, an MCP server that gives agents image and video generation as tools, and paperclip-spend-guard, a plugin that gives an agent workforce cost visibility and budget guardrails on metered models.",
    status: "Public, MIT",
    kind: "Tooling",
    links: [
      { label: "openrouter-media", href: "https://github.com/HLLMR/openrouter-media" },
      { label: "spend-guard", href: "https://github.com/HLLMR/paperclip-spend-guard" },
    ],
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
};

/**
 * Ventures: lines of business that start inside HLLMR Ventures and may graduate to their own
 * subdomain, domain or company. Each brings its own accent colour, set per slug in
 * components/VentureRegister.astro (inline styles are blocked by the CSP). Names marked "to come" are placeholders
 * the owner has not chosen; never invent a public name for one.
 */
export interface Venture {
  slug: string;
  name: string;
  /** Industry or field, in two or three words. */
  field: string;
  line: string;
  stage: Stage;
  href?: string;
}

export const VENTURES: Venture[] = [
  {
    slug: "silo",
    name: "Silo",
    field: "Software product",
    line: "A free, open-source mod manager for Farming Simulator 25, with its own catalog API and community bot.",
    stage: "Launched",
    href: "https://silo.hllmr.com",
  },
  {
    slug: "build",
    name: "HLLMR Build",
    field: "AI-assisted development",
    line: "Software and automation built with AI agents, and help for teams adopting them, with nothing called done until it is seen working.",
    stage: "Launched",
    href: "/build/",
  },
  {
    slug: "live",
    name: "DJ & events",
    field: "Entertainment",
    line: "Music, performance and events under the HLLMR name. Its own site is to come.",
    stage: "Idea",
  },
];
