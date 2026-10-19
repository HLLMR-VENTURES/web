// Help screenshots: a right-sized srcset and a full-size link, without touching the Markdown.
//
// Markdown images can't carry attributes. With `image.layout: "constrained"` Astro gives each one
// a srcset up to the capture's 3200 px, but its `sizes` says "100vw", which would make browsers
// fetch far more than the Help column shows. After the build this rewrites `sizes` to the column's
// real width and wraps each image in a link to its full-size file (the ShotViewer opens it in
// place; without scripts the link opens the image). It fails the build if it finds nothing to
// change, so an Astro output change can't silently drop either.
import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

/** The Help column: 1180px docs width minus the 280px sidebar and gaps; full width below 900px. */
export const HELP_SIZES = "(min-width: 1180px) 820px, (min-width: 900px) calc(100vw - 400px), calc(100vw - 32px)";

const IMG = /<img\b[^>]*\bdata-astro-image="constrained"[^>]*>/g;

/**
 * @param {string} html one built Help page
 * @returns {{ html: string, count: number }}
 */
export function enhanceHelpImages(html) {
  let count = 0;
  const out = html.replace(IMG, (tag) => {
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
    if (!src || !/\ssizes="[^"]*"/.test(tag)) throw new Error(`help image without src or sizes: ${tag.slice(0, 120)}`);
    count++;
    const sized = tag.replace(/\ssizes="[^"]*"/, ` sizes="${HELP_SIZES}"`);
    // `src` is the largest candidate: the capture at its own 3200x2000.
    return `<a class="zoom" href="${src}" data-zoom>${sized}<span class="zoom-hint" aria-hidden="true">Full size</span></a>`;
  });
  return { html: out, count };
}

/** @returns {import("astro").AstroIntegration} */
export function helpImages() {
  return {
    name: "silo:help-images",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const help = path.join(fileURLToPath(dir), "help");
        let pages = 0;
        let images = 0;
        for (const entry of await readdir(help, { withFileTypes: true })) {
          if (!entry.isDirectory()) continue;
          const file = path.join(help, entry.name, "index.html");
          const { html, count } = enhanceHelpImages(await readFile(file, "utf8"));
          if (count) {
            await writeFile(file, html);
            pages++;
            images += count;
          }
        }
        if (!images) throw new Error("silo:help-images found no Help screenshots to enhance; check Astro's image output");
        logger.info(`enhanced ${images} Help screenshots on ${pages} pages`);
      },
    },
  };
}
