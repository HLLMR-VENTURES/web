/**
 * Builds a brand's media kit: SVG masters (committed, in media-kit/<brand>/masters/) and every
 * platform export (rendered, not committed) into <out>/<kit folder>/.
 *
 *   node media-kit/build.mjs hllmr-gaming --out "F:\Media Kits"
 *
 * Needs `npm ci` (for the brand fonts and sharp, both already in the lockfile) and Edge or Chrome.
 * Adds no dependency; touches nothing a site release builds from.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import { openBrowser } from "./lib/render.mjs";
import { ARMS, TINCTURES, checkWordmarkSource } from "./lib/marks.mjs";
import {
  MEASURE_EXPR,
  THEMES,
  avatarPage,
  avatarSvg,
  bannerPage,
  fieldPage,
  lockupSvg,
  measurePage,
  svgDoc,
  svgPage,
  thumbPage,
  watermarkPage,
} from "./lib/layouts.mjs";
import { PLATFORMS } from "./platforms.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const key = args.find((a) => !a.startsWith("--"));
const outIdx = args.indexOf("--out");
if (!key) throw new Error("usage: node media-kit/build.mjs <brand> [--out <dir>]");
const brandDir = join(here, key);
const brand = { ...(await import(pathToFileURL(join(brandDir, "brand.mjs")).href)).default };
// The arms' tinctures, from the brand package: the field for frames and the foot, the charge for hairlines.
brand.field = TINCTURES[ARMS[brand.coat].field].hex;
brand.charge = TINCTURES[ARMS[brand.coat].charge].hex;
const root = outIdx >= 0 ? args[outIdx + 1] : join(here, "out");
const out = join(root, brand.folder);

checkWordmarkSource();
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
  const m = await browser.measure(measurePage(brand), MEASURE_EXPR);

  // Masters: SVG, written to the repo (source of truth) and the kit, with PNG renders beside them.
  const masters = [];
  const S = 1024;
  for (const theme of ["light", "dark"]) {
    const T = THEMES[theme];
    masters.push([`avatar-${theme}.svg`, svgDoc(avatarSvg(brand, S, { edge: T.edge }), S, S, { title: brand.name, bg: T.ground }), S, S]);
  }
  for (const [name, ink] of [["white", "#ffffff"], ["black", "#000000"]]) {
    masters.push([`avatar-${name}.svg`, svgDoc(avatarSvg(brand, S, { mono: ink }), S, S, { title: brand.name }), S, S]);
  }
  for (const v of ["light", "dark", "white", "black"]) {
    const T = THEMES[v] ?? {};
    const mono = v === "white" ? "#ffffff" : v === "black" ? "#000000" : undefined;
    const lk = lockupSvg(brand, { h: 100, ink: T.ink, rule: T.rule, edge: T.edge, mono, descW: m.descW });
    masters.push([`lockup-${v}.svg`, svgDoc(lk.svg, lk.width, lk.height, { title: brand.name, margin: 2 }), lk.width + 4, lk.height + 4]);
  }
  mkdirSync(join(brandDir, "masters"), { recursive: true });
  mkdirSync(join(out, "masters", "png"), { recursive: true });
  for (const [name, svg, w, h] of masters) {
    writeFileSync(join(brandDir, "masters", name), svg);
    writeFileSync(join(out, "masters", name), svg);
    files.push([`masters/${name}`, Math.round(w), Math.round(h), Buffer.byteLength(svg), "SVG master (vector; any size)"]);
    // PNG beside each master: avatars at 1024, lockups 2400 wide, on transparency.
    const pw = name.startsWith("lockup") ? 2400 : 1024;
    const ph = Math.round((pw * h) / w);
    const preview = name.includes("white") ? "#14161a" : undefined;
    const png = await browser.shot(svgPage(svg, pw, ph), pw, ph, { transparent: true });
    await save(`masters/png/${name.replace(".svg", ".png")}`, png, pw, ph, preview ? "PNG of the master (white: shows on dark grounds only)" : "PNG of the master");
  }

  // Platform exports.
  for (const [platform, spec] of Object.entries(PLATFORMS)) {
    for (const a of spec.assets) {
      if (a.only && !brand.extras.includes(a.only)) continue;
      let html;
      let transparent = false;
      if (a.kind === "avatar") html = avatarPage(brand, a.w, brand.theme);
      else if (a.kind === "banner") html = bannerPage(brand, a.w, a.h, a.safe, { theme: brand.theme, align: a.align, line: a.line !== false, ...m });
      else if (a.kind === "field") html = fieldPage(brand, a.w, a.h, { theme: brand.theme });
      else if (a.kind === "watermark") ((html = watermarkPage(brand, a.w)), (transparent = true));
      else if (a.kind === "thumb-overlay") ((html = thumbPage(brand, a.w, a.h, { ...m })), (transparent = true));
      else if (a.kind === "thumb-guide") html = thumbPage(brand, a.w, a.h, { guide: true, ...m });
      else throw new Error(`unknown kind ${a.kind}`);
      const png = await browser.shot(html, a.w, a.h, { transparent });
      await save(`${platform}/${a.file}`, png, a.w, a.h, a.note, { maxBytes: a.maxBytes, jpeg: a.jpeg });
    }
  }
} finally {
  await browser.close();
}

// README (with the generated file list and sources) and copy.
const kb = (n) => (n < 1024 * 1024 ? `${Math.round(n / 102.4) / 10} KB` : `${Math.round(n / 104857.6) / 10} MB`);
const fileTable =
  "| File | Pixels | Size | Use |\n|---|---|---|---|\n" +
  files.map(([f, w, h, b, n]) => `| \`${f}\` | ${w}×${h} | ${kb(b)} | ${n ?? ""} |`).join("\n");
const sources =
  "| Platform | What the page says (as read) | Source | Checked |\n|---|---|---|---|\n" +
  Object.entries(PLATFORMS)
    .flatMap(([p, s]) => s.sources.map((x) => `| ${s.name} | ${x.says} | ${x.url} | ${x.checked}${x.official === false ? " (not an official page)" : ""} |`))
    .join("\n");
const coat = ARMS[brand.coat];
const tint = (k) => `${TINCTURES[k].name} | \`${TINCTURES[k].hex}\``;
const colours =
  "| Name | Hex | Use |\n|---|---|---|\n" +
  [
    `| ${tint(coat.field)} | The arms' field: the shield, frames, the foot band |`,
    `| ${tint(coat.charge)} | The arms' charge, and hairlines${coat.charge === "or" ? ". Never as text on a light ground" : ""} |`,
    ...(coat.field !== "sable" && coat.charge !== "sable" ? [`| ${tint("sable")} | Ink on light grounds; the arms' outline on light |`] : []),
    ...(coat.field !== "argent" && coat.charge !== "argent" ? [`| ${tint("argent")} | The arms' outline on dark |`] : []),
    `| Dark ground | \`${THEMES.dark.ground}\` | Backgrounds of the banners, avatars and thumbnail band |`,
    `| Dark ink | \`${THEMES.dark.ink}\` | Text on the dark ground |`,
    `| Dark muted | \`${THEMES.dark.muted}\` | The line ("${brand.line}") on dark |`,
    `| Light ground | \`${THEMES.light.ground}\` | Light backgrounds |`,
    `| Light muted | \`${THEMES.light.muted}\` | Secondary text on light |`,
    `| Accent on dark | \`${brand.accentDark}\` | ${brand.name}'s accent as text on dark (the site's dark theme) |`,
  ].join("\n");
const notesPath = join(brandDir, "notes.md");
const fill = {
  NAME: brand.name,
  KEY: key,
  SITE: brand.site.replace(/^https:\/\/|\/$/g, ""),
  SITE_URL: brand.site,
  ABOUT: brand.about,
  BLAZON: coat.blazon,
  PLAIN: coat.plain,
  DESCRIPTOR: brand.descriptor,
  ENDORSE: brand.endorse,
  COLOURS: colours,
  NOTES: existsSync(notesPath) ? readFileSync(notesPath, "utf8") : "",
  FILES: fileTable,
  SOURCES: sources,
};
const readme = readFileSync(join(here, "kit-README.md"), "utf8").replace(/\{\{(\w+)\}\}/g, (_, k) => fill[k]);
writeFileSync(join(out, "README.md"), readme);
copyFileSync(join(brandDir, "copy.md"), join(out, "copy.md"));
console.log(`${files.length} files, README.md and copy.md in ${out}`);
