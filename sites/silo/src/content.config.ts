// Content collections: each fact is written once and feeds every place that shows it
// (visible rows and cards, JSON-LD, llms.txt). Schemas fail the build on bad or missing fields.
import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

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

export const collections = { features, faq, screens };
