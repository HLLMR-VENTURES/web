// Content collections: each fact is written once and feeds every place that shows it
// (visible cards, JSON-LD, llms.txt). Schemas fail the build on bad or missing fields.
import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

/** Home feature cards; `ld` is the matching schema.org featureList line. */
const features = defineCollection({
  loader: file("src/content/features.yaml"),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    /** Placeholder glyph at parity; Lucide icons with labels replace these in Phase 3. */
    glyph: z.string().optional(),
    title: z.string().optional(),
    /** Trusted HTML authored in this repo. */
    body: z.string().optional(),
    wide: z.boolean().default(false),
    /** false = JSON-LD / llms.txt only (no visible card). */
    card: z.boolean().default(true),
    ld: z.string().optional(),
    /** One-line summary for llms.txt. */
    llms: z.string().optional(),
  }),
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

export const collections = { features, faq, screens };
