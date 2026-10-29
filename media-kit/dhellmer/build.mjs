/**
 * Builds dhellmer.com's personal media kit: SVG masters (committed, in media-kit/dhellmer/masters/) and
 * every platform export (rendered, not committed) into <out>/dhellmer.com/.
 *
 *   node media-kit/dhellmer/build.mjs --out "F:\Media Kits"
 *
 * A personal kit, so its own build: the family generator (../build.mjs) draws HLLMR arms and the
 * wordmark, which dhellmer.com does not carry (ADR-0015). This one reuses the shared renderer and the
 * shared platform sizes read-only, and changes neither. Needs `npm ci` (fonts and sharp, both already in
 * the lockfile) and Edge or Chrome. Adds no dependency; touches nothing a site release builds from.
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { openBrowser } from "../lib/render.mjs";
import {
  MEASURE_EXPR,
  MEASURE_PAGE,
  THEMES,
  avatarInner,
  avatarPage,
  bannerPage,
  lockupInner,
  svgDoc,
  svgPage,
  thumbPage,
  watermarkPage,
} from "./layouts.mjs";
import { PLATFORMS, SKIPPED } from "./platforms.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const root = outIdx >= 0 ? args[outIdx + 1] : join(here, "..", "out");
const out = join(root, "dhellmer.com");

/**
 * The published portrait (sites/dhellmer/src/assets/portrait.jpg, 1200×1500, metadata-free) cropped
 * square on the face, so it reads in a circle at 98 px, and treated as the site shows it: CSS
 * `grayscale(1) contrast(1.06)`, which is a 1.06 gain about mid-grey (128 × 0.06 = 7.68).
 */
const PORTRAIT = join(here, "..", "..", "sites", "dhellmer", "src", "assets", "portrait.jpg");
const CROP = { left: 330, top: 115, width: 400, height: 400 };
const photo = (w) => sharp(PORTRAIT).extract(CROP).grayscale().linear(1.06, -7.68).resize(w, w).png().toBuffer();

const browser = await openBrowser();
const files = []; // [path in kit, width, height, bytes, note]

async function save(rel, png, w, h, note, { maxBytes, jpeg } = {}) {
  const meta = await sharp(png).metadata();
  if (meta.width !== w || meta.height !== h) throw new Error(`${rel}: rendered ${meta.width}x${meta.height}, wanted ${w}x${h}`);
  let buf = await sharp(png).png({ compressionLevel: 9 }).toBuffer();
  if (maxBytes && buf.length > maxBytes) {
    if (!jpeg) throw new Error(`${rel}: ${buf.length} bytes is over the ${maxBytes}-byte limit`);
    buf = await sharp(png).flatten().jpeg({ quality: 90 }).toBuffer();
    rel = rel.replace(/\.png$/, ".jpg");
    if (buf.length > maxBytes) throw new Error(`${rel}: ${buf.length} bytes is over the ${maxBytes}-byte limit`);
  }
  const p = join(out, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, buf);
  files.push([rel.replaceAll("\\", "/"), w, h, buf.length, note]);
}

try {
  const m = await browser.measure(MEASURE_PAGE, MEASURE_EXPR);
  for (const [k, v] of Object.entries(m)) if (!(v > 0)) throw new Error(`font measurement ${k} is ${v}: a face did not load`);

  // Masters: SVG, written to the repo (source of truth) and the kit, with a PNG of each beside them.
  const masters = [];
  const S = 1024;
  for (const theme of ["light", "dark"]) {
    masters.push([`avatar-${theme}.svg`, svgDoc(avatarInner(S, m, { theme }), S, S, { title: "David Hellmer", bg: THEMES[theme].ground }), S, S]);
  }
  for (const [name, ink] of [["white", "#ffffff"], ["black", "#000000"]]) {
    masters.push([`avatar-${name}.svg`, svgDoc(avatarInner(S, m, { mono: ink }), S, S, { title: "David Hellmer" }), S, S]);
  }
  for (const v of ["light", "dark", "white", "black"]) {
    const mono = v === "white" ? "#ffffff" : v === "black" ? "#000000" : undefined;
    const lk = lockupInner(m, { h: 100, theme: v === "light" ? "light" : "dark", mono });
    masters.push([`lockup-${v}.svg`, svgDoc(lk.svg, lk.width, lk.height, { title: "David Hellmer" }), lk.width, lk.height]);
  }
  mkdirSync(join(here, "masters"), { recursive: true });
  mkdirSync(join(out, "masters", "png"), { recursive: true });
  for (const [name, svg, w, h] of masters) {
    writeFileSync(join(here, "masters", name), svg);
    writeFileSync(join(out, "masters", name), svg);
    files.push([`masters/${name}`, Math.round(w), Math.round(h), Buffer.byteLength(svg), "SVG master (vector; any size)"]);
    // PNG beside each master: avatars at 1024, lockups 2400 wide, on transparency.
    const pw = name.startsWith("lockup") ? 2400 : 1024;
    const ph = Math.round((pw * h) / w);
    const png = await browser.shot(svgPage(svg, pw, ph), pw, ph, { transparent: true });
    await save(`masters/png/${name.replace(".svg", ".png")}`, png, pw, ph, name.includes("white") ? "PNG of the master (white: shows on dark grounds only)" : "PNG of the master");
  }

  // Platform exports.
  for (const [platform, spec] of Object.entries(PLATFORMS)) {
    for (const a of spec.assets) {
      let png;
      if (a.kind === "photo") png = await photo(a.w);
      else {
        let html;
        let transparent = false;
        if (a.kind === "avatar") html = avatarPage(m, a.w, "dark");
        else if (a.kind === "banner") html = bannerPage(m, a.w, a.h, a.safe, { theme: "dark", align: a.align, line: a.line !== false });
        else if (a.kind === "watermark") html = watermarkPage(m, a.w);
        else if (a.kind === "thumb-overlay") ((html = thumbPage(m, a.w, a.h)), (transparent = true));
        else if (a.kind === "thumb-guide") html = thumbPage(m, a.w, a.h, { guide: true });
        else throw new Error(`unknown kind ${a.kind}`);
        png = await browser.shot(html, a.w, a.h, { transparent });
      }
      await save(`${platform}/${a.file}`, png, a.w, a.h, a.note, { maxBytes: a.maxBytes, jpeg: a.jpeg });
    }
  }
} finally {
  await browser.close();
}

// README (with the generated file list, sources and skipped platforms) and copy.
const kb = (n) => (n < 1024 * 1024 ? `${Math.round(n / 102.4) / 10} KB` : `${Math.round(n / 104857.6) / 10} MB`);
const fill = {
  FILES:
    "| File | Pixels | Size | Use |\n|---|---|---|---|\n" +
    files.map(([f, w, h, b, n]) => `| \`${f}\` | ${w}×${h} | ${kb(b)} | ${n ?? ""} |`).join("\n"),
  SOURCES:
    "| Platform | What the page says (as read) | Source | Checked |\n|---|---|---|---|\n" +
    Object.values(PLATFORMS)
      .flatMap((s) => s.sources.map((x) => `| ${s.name} | ${x.says} | ${x.url} | ${x.checked}${x.official === false ? " (no figure for this case on the page)" : ""} |`))
      .join("\n"),
  SKIPPED: SKIPPED.map(([p, why]) => `- **${p}:** ${why}.`).join("\n"),
  CROP: `${CROP.width}×${CROP.height} from left ${CROP.left}, top ${CROP.top}`,
};
const readme = readFileSync(join(here, "kit-README.md"), "utf8").replace(/\{\{(\w+)\}\}/g, (_, k) => fill[k]);
writeFileSync(join(out, "README.md"), readme);
copyFileSync(join(here, "copy.md"), join(out, "copy.md"));
console.log(`${files.length} files, README.md and copy.md in ${out}`);
