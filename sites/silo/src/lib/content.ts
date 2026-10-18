/** Helpers that read the content collections in display order. */
import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

/** @returns features sorted by `order` */
export async function features(): Promise<CollectionEntry<"features">[]> {
  return (await getCollection("features")).sort(byOrder);
}

/** @returns FAQ entries sorted by `order` */
export async function faq(): Promise<CollectionEntry<"faq">[]> {
  return (await getCollection("faq")).sort(byOrder);
}

/** @returns screenshot entries sorted by `order` */
export async function screens(): Promise<CollectionEntry<"screens">[]> {
  return (await getCollection("screens")).sort(byOrder);
}

const masters = import.meta.glob<{ default: ImageMetadata }>("../assets/screens/*.png", { eager: true });

/**
 * Resolve a screenshot master by file name.
 * @param file - e.g. "library.png"
 * @returns the image metadata for astro:assets
 */
export function screenImage(file: string): ImageMetadata {
  const hit = masters[`../assets/screens/${file}`];
  if (!hit) throw new Error(`screens.yaml references a missing master: ${file}`);
  return hit.default;
}

/**
 * Plain text from trusted HTML, for JSON-LD and llms.txt.
 * @param html - markup authored in this repo
 * @returns the text with tags removed and entities decoded
 */
export function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
