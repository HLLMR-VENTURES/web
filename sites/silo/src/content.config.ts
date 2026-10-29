// Content collections: each fact is written once and feeds every place that shows it
// (visible rows and cards, JSON-LD, llms.txt). Schemas fail the build on bad or missing fields.
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { SILO_REPO, SILO_REPO_URLS } from "./lib/site";

const link = z.object({ href: z.string().startsWith("/"), label: z.string() });

/** Home features; `ld` is the matching schema.org featureList line. */
const features = defineCollection({
  loader: file("src/content/features.yaml"),
  schema: z
    .object({
      id: z.string(),
      order: z.number(),
      /** row = large row with a screenshot, card = small card, data = JSON-LD / llms.txt only. */
      kind: z.enum(["row", "card", "data"]),
      kicker: z.string().optional(),
      title: z.string().optional(),
      /** Trusted HTML authored in this repo. */
      body: z.string().optional(),
      /** Screenshot id from screens.yaml (rows only). */
      screen: z.string().optional(),
      help: link.optional(),
      ld: z.string().optional(),
      /** One-line summary for llms.txt. */
      llms: z.string().optional(),
    })
    .refine((f) => f.kind === "data" || (f.title && f.body), { message: "rows and cards need a title and body" })
    .refine((f) => f.kind !== "row" || (f.screen && f.kicker), { message: "rows need a screen and a kicker" }),
});

/** FAQ: the visible <details> and the FAQPage JSON-LD both render from `answer`. */
const faq = defineCollection({
  loader: file("src/content/faq.yaml"),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    question: z.string(),
    /** Trusted HTML paragraphs authored in this repo. */
    answer: z.array(z.string()).min(1),
    /** Extra sentences only the visible answer carries (for example a link to /trust/). */
    visibleOnly: z.array(z.string()).default([]),
  }),
});

/** Screenshot manifest: one entry per master in src/assets/screens/. */
const screens = defineCollection({
  loader: file("src/content/screens.yaml"),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    file: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
    dialogCaption: z.string().optional(),
    gallery: z.boolean().default(true),
    appVersion: z.string().optional(),
  }),
});

/**
 * Legal documents: the single source (moved from HLLMR/silo docs/legal, 2026-10-18). Each renders
 * at /legal/<id>.html; `draft: true` renders the "not reviewed" banner, so it cannot be forgotten.
 */
const legal = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/legal" }),
  schema: z.object({
    title: z.string(),
    /** Label in the legal sub-navigation. */
    short: z.string(),
    description: z.string(),
    effectiveDate: z.coerce.date(),
    draft: z.boolean(),
    order: z.number(),
  }),
});

/**
 * Help topics: one Markdown file per topic, rendered at /help/<id>/. Split from the single-page
 * help of HLLMR/silo landing/help (dcb9f65); `legacyAnchor` is the old h2 id ("crash-triage-h"),
 * kept on the topic page and mapped by the /help/ hub so old links still land on the topic.
 * `appliesTo` is the app version the text describes.
 */
const help = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/help" }),
  schema: z.object({
    title: z.string(),
    /** Shorter label for navigation. */
    label: z.string(),
    summary: z.string(),
    group: z.string(),
    order: z.number(),
    legacyAnchor: z.string().regex(/^[a-z-]+-h$/),
    appliesTo: z.string(),
  }),
});

/**
 * App releases for /changelog/, read from GitHub at build time (newest first) with the notes
 * rendered by Astro's own Markdown pipeline. Fails soft: no releases means the page links to
 * GitHub instead. The notes' own "## What's new in x" heading is dropped (the page titles each
 * release) and deeper headings move down one level. Notes written before the repo moved link to
 * the old owner; those link targets point at the new one. Only href values change, so v0.4.0's
 * `gh attestation verify --repo HLLMR/silo` command (attested under the old name) stays as written.
 */
const releases = defineCollection({
  loader: {
    name: "silo-github-releases",
    load: async ({ store, renderMarkdown, logger }) => {
      store.clear();
      if (process.env.SILO_OFFLINE === "1") return;
      try {
        const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "hllmr-web-build" };
        if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
        const res = await fetch(`https://api.github.com/repos/${SILO_REPO}/releases?per_page=30`, {
          headers,
          signal: AbortSignal.timeout(10_000),
        });
        if (!res.ok) throw new Error(`GitHub ${res.status}`);
        const list = (await res.json()) as {
          tag_name: string;
          name: string | null;
          published_at: string;
          html_url: string;
          body: string | null;
          draft: boolean;
          prerelease: boolean;
        }[];
        for (const [i, r] of list.filter((x) => !x.draft && !x.prerelease).entries()) {
          const body = (r.body ?? "")
            .replace(/^\s*##\s+What's new in [^\n]*\n/i, "")
            .replace(/^(#{2,5})\s/gm, "#$1 ");
          // Every release has "Added", "Fixed" … headings; prefix their ids with the release so the
          // page's ids stay unique (v0.11.0 + "fixed" -> "v0-11-0-fixed").
          const rendered = await renderMarkdown(body);
          const prefix = r.tag_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          rendered.html = rendered.html
            .replace(/ id="([^"]+)"/g, (_m, id: string) => ` id="${prefix}-${id}"`)
            .replaceAll(`href="${SILO_REPO_URLS[1]}`, `href="${SILO_REPO_URLS[0]}`);
          store.set({
            id: r.tag_name,
            data: { tag: r.tag_name, name: r.name || r.tag_name, date: r.published_at.slice(0, 10), url: r.html_url, order: i },
            rendered,
          });
        }
      } catch (e) {
        logger.warn(`releases unavailable, /changelog/ links to GitHub: ${(e as Error).message}`);
      }
    },
  },
  schema: z.object({
    tag: z.string(),
    name: z.string(),
    date: z.string(),
    url: z.string().url(),
    order: z.number(),
  }),
});

export const collections = { features, faq, screens, legal, help, releases };
