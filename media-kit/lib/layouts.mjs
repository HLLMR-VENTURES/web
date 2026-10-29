/**
 * The kit's canvases, as HTML pages the renderer screenshots at exact pixel sizes. Fonts are the
 * family's own (Archivo, Bodoni Moda; SIL OFL 1.1, from @fontsource), embedded as data URIs so a
 * page needs no file or network access.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ARMS, SHIELD_H, SHIELD_W, WORDMARK_H, WORDMARK_W, r, shield, wordmark } from "./marks.mjs";

const font = (rel) =>
  "data:font/woff2;base64," + readFileSync(fileURLToPath(new URL(`../../node_modules/${rel}`, import.meta.url))).toString("base64");
const ARCHIVO = font("@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2");
const BODONI = font("@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-normal.woff2");
const BODONI_I = font("@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-italic.woff2");

/** @font-face for Archivo only: what the SVG masters embed (the descriptor is set in it). */
export const ARCHIVO_FACE = `@font-face{font-family:"Archivo";src:url(${ARCHIVO}) format("woff2");font-weight:100 900;font-stretch:62% 125%}`;
const FACES =
  ARCHIVO_FACE +
  `@font-face{font-family:"Bodoni Moda";src:url(${BODONI}) format("woff2");font-weight:400 900}` +
  `@font-face{font-family:"Bodoni Moda";font-style:italic;src:url(${BODONI_I}) format("woff2");font-weight:400 900}`;

/**
 * The line is set in Bodoni Moda italic at a small optical size: at display sizes its comma tail is a
 * hairline that vanishes on a banner, so "playing, less" read as "playing. less".
 */
const LINE_OPSZ = "font-variation-settings:'opsz' 11";

/** Grounds and inks per theme (the hllmr.com skin's page tokens; the arms keep their tinctures). */
export const THEMES = {
  light: { ground: "#e9ecef", ink: "#14161a", muted: "#525a66", rule: "#c3c9d1", edge: "#14161a" },
  dark: { ground: "#0e1013", ink: "#eceef1", muted: "#9ba3ae", rule: "#2b3139", edge: "#e6e8eb" },
};

const page = (w, h, body, { bg = "transparent", script = "" } = {}) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${FACES}` +
  `html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${bg}}` +
  `body{position:relative;font-family:Archivo,sans-serif}svg{display:block}</style></head><body>${body}` +
  (script ? `<script>${script}</script>` : "") +
  `</body></html>`;

/**
 * The horizontal lockup (arms, wordmark, rule, descriptor) as SVG content in a 0-based box, cap
 * height `h`. Proportions follow the sites' header and og cards: descriptor in Archivo at 125% width,
 * weight 500, tracked 0.24em, after a hairline rule. Returns the markup and its width, which depends
 * on the descriptor's set width, so the caller passes `descW` (measured in the browser).
 */
export function lockupSvg(brand, { h = 100, ink, rule, edge, mono, withArms = true, descW }) {
  const sh = h * 1.5;
  const top = (sh - h) / 2;
  let x = 0;
  let out = "";
  if (withArms) {
    out += shield(brand.coat, { x: 0, y: 0, h: sh, edge, mono });
    x += (sh * SHIELD_W) / SHIELD_H + h * 0.62;
  }
  const wy = withArms ? top : 0;
  out += wordmark({ x, y: wy, h, fill: mono || ink });
  x += (h * WORDMARK_W) / WORDMARK_H + h * 0.46;
  out += `<rect x="${r(x)}" y="${r(wy)}" width="${r(h / 24)}" height="${r(h)}" fill="${mono || rule}"/>`;
  x += h / 24 + h * 0.46;
  const fs = h * 0.56;
  // Caps sit on the wordmark's baseline; Archivo's cap height is 0.686 em.
  out += `<text x="${r(x)}" y="${r(wy + h / 2 + (fs * 0.686) / 2)}" font-family="Archivo, sans-serif" font-size="${r(fs)}" font-weight="500" style="font-stretch:125%" letter-spacing="${r(fs * 0.24)}" fill="${mono || ink}">${brand.descriptor}</text>`;
  const width = x + (descW ?? 0) * fs;
  return { svg: out, width, height: withArms ? sh : h };
}

/**
 * A page that sets the descriptor and the line at 100 px, so the browser can report their widths in
 * em (MEASURE_EXPR): layouts need them before they can place and fit the text.
 */
export function measurePage(brand) {
  return page(
    4000,
    300,
    `<svg width="4000" height="300"><text id="d" x="0" y="100" font-family="Archivo" font-size="100" font-weight="500" style="font-stretch:125%" letter-spacing="24">${brand.descriptor}</text>` +
      `<text id="l" x="0" y="250" font-family="Bodoni Moda" font-style="italic" style="${LINE_OPSZ}" font-size="100">${brand.line}</text></svg>`,
  );
}
// The trailing letter-space is not part of the ink, so it is removed from the descriptor's advance.
export const MEASURE_EXPR = `({ descW: (document.getElementById("d").getComputedTextLength() - 24) / 100, lineW: document.getElementById("l").getComputedTextLength() / 100 })`;

/** A standalone SVG document (a master), with the descriptor's font embedded. */
export function svgDoc(inner, w, h, { title, bg, margin = 0 } = {}) {
  const m = margin;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(-m)} ${r(-m)} ${r(w + 2 * m)} ${r(h + 2 * m)}" width="${r(w + 2 * m)}" height="${r(h + 2 * m)}" role="img"${title ? ` aria-label="${title}"` : ""}>` +
    (title ? `<title>${title}</title>` : "") +
    (inner.includes("<text") ? `<style>${ARCHIVO_FACE}</style>` : "") +
    (bg ? `<rect x="${r(-m)}" y="${r(-m)}" width="${r(w + 2 * m)}" height="${r(h + 2 * m)}" fill="${bg}"/>` : "") +
    inner +
    `</svg>\n`
  );
}

/** Wraps a master SVG for rasterising at a given size. */
export function svgPage(svgText, w, h, bg) {
  const sized = svgText.replace(/width="[^"]*" height="[^"]*"/, `width="${w}" height="${h}"`);
  return page(w, h, sized, { bg: bg ?? "transparent" });
}

/**
 * The avatar: the division's escutcheon centred on its ground, sized so the whole shield sits inside
 * the circle a platform crops to (its corners at 0.46 of the canvas from centre).
 */
export function avatarSvg(brand, S, { edge, mono }) {
  const h = S * 0.68;
  const w = (h * SHIELD_W) / SHIELD_H;
  return shield(brand.coat, { x: (S - w) / 2, y: (S - h) / 2, h, edge, mono });
}

/**
 * A diaper (a repeating field pattern) of the brand's own ordinary, drawn small: a saltire for
 * GAMING, a pale for TOOLS, a chevron for UPGRADE, a zigzag for LIVE, a half-filled square (per pale)
 * for the house.
 */
function diaper(id, cell, brand) {
  const { color, opacity } = brand.pattern;
  const a = cell * 0.2;
  const c = cell / 2;
  const sw = r(cell * 0.045);
  const line = (d) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="square" stroke-linejoin="miter"/>`;
  const motif = {
    saltire: () => line(`M${r(c - a)} ${r(c - a)}L${r(c + a)} ${r(c + a)}M${r(c + a)} ${r(c - a)}L${r(c - a)} ${r(c + a)}`),
    pale: () => line(`M${r(c)} ${r(c - a)}V${r(c + a)}`),
    chevron: () => line(`M${r(c - a)} ${r(c + a / 2)}L${r(c)} ${r(c - a / 2)}L${r(c + a)} ${r(c + a / 2)}`),
    fessDancetty: () => line(`M${r(c - a)} ${r(c + a / 3)}L${r(c - a / 2)} ${r(c - a / 3)}L${r(c)} ${r(c + a / 3)}L${r(c + a / 2)} ${r(c - a / 3)}L${r(c + a)} ${r(c + a / 3)}`),
    perPale: () =>
      line(`M${r(c - a * 0.7)} ${r(c - a * 0.7)}H${r(c + a * 0.7)}V${r(c + a * 0.7)}H${r(c - a * 0.7)}Z`) +
      `<rect x="${r(c - a * 0.7)}" y="${r(c - a * 0.7)}" width="${r(a * 0.7)}" height="${r(a * 1.4)}" fill="${color}"/>`,
    bend: () => line(`M${r(c - a)} ${r(c - a)}L${r(c + a)} ${r(c + a)}`),
  }[ARMS[brand.coat].division]();
  return `<defs><pattern id="${id}" width="${r(cell)}" height="${r(cell)}" patternUnits="userSpaceOnUse"><g opacity="${opacity}">${motif}</g></pattern></defs>`;
}

/**
 * A banner, header or splash: the ground with the division's diaper, a field-coloured foot with an
 * Or hairline, and the content block (arms, lockup, line) fitted inside `safe` ({x, y, w, h}, the area
 * every device shows). `align` places the block in the safe area: "center", or "right" where a
 * profile picture overlaps the banner's left.
 */
export function bannerPage(brand, W, H, safe, { theme = "dark", align = "center", line = true, descW, lineW } = {}) {
  const T = THEMES[theme];
  const k = 100; // the block is laid out at cap height 100, then scaled to fit
  const lk = lockupSvg(brand, { h: k, ink: T.ink, rule: T.rule, edge: T.edge, withArms: false, descW });
  const sh = k * 3.1;
  const sw = (sh * SHIELD_W) / SHIELD_H;
  const lineFs = k * 0.92;
  const colX = sw + k * 1.1;
  const colTop = line ? sh / 2 - (k + k * 0.62 + lineFs * 0.8) / 2 : sh / 2 - k / 2;
  const blockW = colX + Math.max(lk.width, line ? lineW * lineFs : 0);
  const block =
    shield(brand.coat, { x: 0, y: 0, h: sh, edge: T.edge }) +
    `<g transform="translate(${r(colX)} ${r(colTop)})">${lk.svg}</g>` +
    (line
      ? `<text x="${r(colX)}" y="${r(colTop + k + k * 0.62 + lineFs * 0.72)}" font-family="Bodoni Moda" font-style="italic" style="${LINE_OPSZ}" font-size="${r(lineFs)}" fill="${T.muted}">${brand.line}</text>`
      : "");
  const pad = 0.9;
  const s = Math.min((safe.w * pad) / blockW, (safe.h * pad) / sh);
  const edgeGap = (safe.w * (1 - pad)) / 2;
  const bx =
    align === "right" ? safe.x + safe.w - edgeGap - blockW * s : align === "left" ? safe.x + edgeGap : safe.x + (safe.w - blockW * s) / 2;
  const by = safe.y + (safe.h - sh * s) / 2;
  return fieldPage(brand, W, H, { theme, content: `<g transform="translate(${r(bx)} ${r(by)}) scale(${r(s, 5)})">${block}</g>` });
}

/**
 * The ground alone: the diaper and the foot, no arms or type. For places that ask for no logos or
 * text (Discord's banner and invite background). Never the arms as a full-bleed field: an ordinary
 * across a whole canvas reads as a flag, not as arms.
 */
export function fieldPage(brand, W, H, { theme = "dark", content = "" } = {}) {
  const T = THEMES[theme];
  const cell = Math.max(24, Math.round(H / 12));
  const foot = Math.max(4, Math.round(H * 0.03));
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    diaper("d", cell, brand) +
    `<rect width="${W}" height="${H}" fill="${T.ground}"/><rect width="${W}" height="${H}" fill="url(#d)"/>` +
    `<rect y="${H - foot}" width="${W}" height="${foot}" fill="${brand.field}"/><rect y="${H - foot}" width="${W}" height="${Math.max(1, Math.round(foot / 5))}" fill="${brand.charge}"/>` +
    content +
    `</svg>`;
  return page(W, H, svg, { bg: T.ground });
}

/** A square or circular profile picture on its ground. */
export function avatarPage(brand, S, theme = "dark") {
  const T = THEMES[theme];
  return page(S, S, `<svg width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="${T.ground}"/>${avatarSvg(brand, S, { edge: T.edge })}</svg>`, {
    bg: T.ground,
  });
}

/** The YouTube watermark: the escutcheon alone on transparency, with an Argent edge to hold on any shot. */
export function watermarkPage(brand, S) {
  const h = S * 0.94;
  const w = (h * SHIELD_W) / SHIELD_H;
  return page(S, S, `<svg width="${S}" height="${S}">${shield(brand.coat, { x: (S - w) / 2, y: (S - h) / 2, h, edge: "#f3f4f5" })}</svg>`);
}

/**
 * Thumbnail templates (the launch-videos spec, 2026-10-28): the shot fills the canvas; a darkened
 * third holds three or four huge words; the brand mark sits bottom right, raised clear of the corner
 * YouTube covers with the video's length. Landscape darkens the left third. Portrait (Shorts) is too
 * narrow for that, so it darkens the bottom third instead, with the mark at that band's right.
 * `overlay` is transparent where the shot goes; `guide` shades the slot and sets sample words.
 */
export function thumbPage(brand, W, H, { guide = false, descW }) {
  const T = THEMES.dark;
  const vertical = H > W;
  const u = Math.min(W, H) / 1080; // one unit = 1 px at 1920x1080
  const frame = Math.max(6, Math.round(12 * u));
  const tagH = Math.round(40 * u);
  const lk = lockupSvg(brand, { h: tagH, ink: T.ink, rule: T.rule, edge: T.edge, descW });
  const pad = Math.round(48 * u);
  const plateW = lk.width + pad;
  const plateH = lk.height + pad * 0.7;
  // Keep the mark above the corner YouTube covers with the video's length (bottom right).
  const plateX = W - frame - Math.round(24 * u) - plateW;
  const plateY = H - frame - Math.round(130 * u) - plateH;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  if (guide) {
    s +=
      `<defs><pattern id="h" width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="32" height="32" fill="#5b616b"/><rect width="16" height="32" fill="#646a74"/></pattern></defs>` +
      `<rect width="${W}" height="${H}" fill="url(#h)"/>` +
      `<text x="${r(vertical ? W / 2 : W * 0.66)}" y="${r(vertical ? H * 0.3 : H * 0.42)}" text-anchor="middle" font-family="Archivo" font-weight="600" font-size="${r(30 * u)}" letter-spacing="${r(3 * u)}" fill="#e9ecef">VIDEO STILL (FULL BLEED, ${W}×${H})</text>`;
  }
  // The darkened third: solid ground fading out into the shot, so the words hold on any image.
  s += vertical
    ? `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.ground}" stop-opacity="0"/><stop offset="0.3" stop-color="${T.ground}" stop-opacity="0.88"/><stop offset="1" stop-color="${T.ground}" stop-opacity="0.96"/></linearGradient></defs>` +
      `<rect y="${r(H * 0.58)}" width="${W}" height="${r(H * 0.42)}" fill="url(#b)"/>`
    : `<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${T.ground}" stop-opacity="0.96"/><stop offset="0.72" stop-color="${T.ground}" stop-opacity="0.88"/><stop offset="1" stop-color="${T.ground}" stop-opacity="0"/></linearGradient></defs>` +
      `<rect width="${r(W * 0.42)}" height="${H}" fill="url(#b)"/>`;
  s +=
    // Frame: the division's field, with a hairline of its charge inside it.
    `<rect x="${frame / 2}" y="${frame / 2}" width="${W - frame}" height="${H - frame}" fill="none" stroke="${brand.field}" stroke-width="${frame}"/>` +
    `<rect x="${frame + 0.5}" y="${frame + 0.5}" width="${W - 2 * frame - 1}" height="${H - 2 * frame - 1}" fill="none" stroke="${brand.charge}" stroke-width="${Math.max(1, Math.round(u * 2))}"/>` +
    // The mark: the lockup on a ground plate, bottom right.
    `<rect x="${r(plateX)}" y="${r(plateY)}" width="${r(plateW)}" height="${r(plateH)}" fill="${T.ground}" fill-opacity="0.92"/>` +
    `<g transform="translate(${r(plateX + pad / 2)} ${r(plateY + (plateH - lk.height) / 2)})">${lk.svg}</g>`;
  if (guide) {
    // Sample words: four, one per line, at the size the third holds.
    const words = ["FOUR", "HUGE", "WORDS", "MAX"];
    const fs = Math.round((vertical ? 130 : 165) * u);
    const tx = frame + Math.round(48 * u);
    const lead = fs * 0.98;
    const top = vertical ? H * 0.6 : (H - lead * words.length) / 2;
    s += words
      .map((w, i) => `<text x="${tx}" y="${r(top + lead * (i + 0.8))}" font-family="Archivo" font-weight="800" font-size="${fs}" fill="${T.ink}">${w}</text>`)
      .join("");
    // The corner YouTube covers with the video's length.
    const cw = Math.round(225 * u);
    const ch = Math.round(90 * u);
    s += `<rect x="${W - frame - cw - Math.round(10 * u)}" y="${H - frame - ch - Math.round(10 * u)}" width="${cw}" height="${ch}" fill="none" stroke="#e3b23c" stroke-width="${Math.max(2, Math.round(3 * u))}" stroke-dasharray="${r(14 * u)} ${r(10 * u)}"/>`;
  }
  s += `</svg>`;
  return page(W, H, s);
}
