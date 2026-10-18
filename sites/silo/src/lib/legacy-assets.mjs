// Keeps legacy asset URLs alive without a second copy in Git.
//
// The screenshot masters live once, in src/assets/screens/, where astro:assets turns them into
// AVIF/WebP srcsets. The old site served the same files at /screenshots/<name>.png, and those
// URLs are referenced from JSON-LD and possibly hot-linked, so after the build we copy the
// masters to dist/screenshots/ unchanged.
import { copyFile, mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

/** @returns {import("astro").AstroIntegration} */
export function copyLegacyScreenshots() {
  return {
    name: "silo:legacy-screenshots",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const src = fileURLToPath(new URL("../assets/screens/", import.meta.url));
        const dest = path.join(fileURLToPath(dir), "screenshots");
        await mkdir(dest, { recursive: true });
        const files = (await readdir(src)).filter((f) => f.endsWith(".png"));
        for (const f of files) await copyFile(path.join(src, f), path.join(dest, f));
        logger.info(`copied ${files.length} legacy screenshots to /screenshots/`);
      },
    },
  };
}
