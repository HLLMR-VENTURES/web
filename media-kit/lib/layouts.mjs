/**
 * The kit's canvases, as HTML pages the renderer screenshots at exact pixel sizes. Fonts are the
 * family's own (Archivo, Bodoni Moda; SIL OFL 1.1, from @fontsource), embedded as data URIs so a
 * page needs no file or network access.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { SHIELD_H, SHIELD_W, WORDMARK_H, WORDMARK_W, r, shield, wordmark } from "./marks.mjs";

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
      `<text id="l" x="0" y="250" font-family="Bodoni Moda" font-style="italic" font-size="100">${brand.line}</text></svg>`,
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

/** A diaper (a repeating field pattern) of small saltires, the GAMING ordinary, in its field colour. */
function diaper(id, cell, color, opacity) {
  const a = cell * 0.2;
  const c = cell / 2;
  const sw = cell * 0.045;
  return (
    `<defs><pattern id="${id}" width="${r(cell)}" height="${r(cell)}" patternUnits="userSpaceOnUse">` +
    `<path d="M${r(c - a)} ${r(c - a)}L${r(c + a)} ${r(c + a)}M${r(c + a)} ${r(c - a)}L${r(c - a)} ${r(c + a)}" stroke="${color}" stroke-width="${r(sw)}" stroke-linecap="square" opacity="${opacity}"/>` +
    `</pattern></defs>`
  );
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
      ? `<text x="${r(colX)}" y="${r(colTop + k + k * 0.62 + lineFs * 0.72)}" font-family="Bodoni Moda" font-style="italic" font-size="${r(lineFs)}" fill="${T.muted}">${brand.line}</text>`
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
 * text (Discord's banner and invite background). Never the arms as a full-bleed field: a saltire
 * across a whole canvas reads as a flag, not as arms.
 */
export function fieldPage(brand, W, H, { theme = "dark", content = "" } = {}) {
  const T = THEMES[theme];
  const cell = Math.max(24, Math.round(H / 12));
  const foot = Math.max(4, Math.round(H * 0.03));
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    diaper("d", cell, brand.field, theme === "dark" ? 0.5 : 0.2) +
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
 * Thumbnail templates. `overlay`: transparent where the shot goes, with the brand band; the title
 * is typed over the band in the editor. `guide`: the same with the slot shaded and a sample title,
 * to show type size and the corner YouTube covers with the video length.
 */
export function thumbPage(brand, W, H, { guide = false, descW }) {
  const T = THEMES.dark;
  const vertical = H > W;
  const u = Math.min(W, H) / 720; // one unit = 1 px at 1280x720
  const bandH = Math.round((vertical ? 460 : 230) * u);
  const tagH = Math.round(30 * u);
  const lk = lockupSvg(brand, { h: tagH, ink: T.ink, rule: T.rule, edge: T.edge, descW });
  const pad = Math.round(36 * u);
  const frame = Math.max(6, Math.round(8 * u));
  const plateW = lk.width + pad;
  const plateH = lk.height + pad * 0.7;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  if (guide) {
    s +=
      `<defs><pattern id="h" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="24" height="24" fill="#5b616b"/><rect width="12" height="24" fill="#646a74"/></pattern></defs>` +
      `<rect width="${W}" height="${H}" fill="url(#h)"/>` +
      `<text x="${W / 2}" y="${r((H - bandH) / 2)}" text-anchor="middle" font-family="Archivo" font-weight="600" font-size="${r(26 * u)}" letter-spacing="${r(3 * u)}" fill="#e9ecef">SHOT GOES HERE (FULL BLEED, ${W}×${H})</text>`;
  }
  // Band: the ground, fading up into the shot so the title holds on any image.
  s +=
    `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.ground}" stop-opacity="0"/><stop offset="0.38" stop-color="${T.ground}" stop-opacity="0.86"/><stop offset="1" stop-color="${T.ground}" stop-opacity="0.96"/></linearGradient></defs>` +
    `<rect y="${H - bandH}" width="${W}" height="${bandH}" fill="url(#b)"/>` +
    // Frame: the division's field, with an Or hairline inside it.
    `<rect x="${frame / 2}" y="${frame / 2}" width="${W - frame}" height="${H - frame}" fill="none" stroke="${brand.field}" stroke-width="${frame}"/>` +
    `<rect x="${frame + 0.5}" y="${frame + 0.5}" width="${W - 2 * frame - 1}" height="${H - 2 * frame - 1}" fill="none" stroke="${brand.charge}" stroke-width="${Math.max(1, Math.round(u * 1.5))}"/>` +
    // Tag: the lockup on a ground plate, top left (YouTube puts the video length bottom right).
    `<rect x="${frame}" y="${frame}" width="${r(plateW + frame)}" height="${r(plateH)}" fill="${T.ground}" fill-opacity="0.92"/>` +
    `<g transform="translate(${r(frame + pad / 2)} ${r(frame + (plateH - lk.height) / 2)})">${lk.svg}</g>`;
  if (guide) {
    const fs = Math.round(60 * u);
    const tx = Math.round(40 * u);
    const lines = vertical ? ["VIDEO TITLE,", "THREE LINES", "AT MOST"] : ["VIDEO TITLE IN", "TWO LINES AT MOST"];
    // The last line's baseline: clear of the frame, and on vertical, of the bottom eighth.
    const last = vertical ? H * 0.86 : H - 46 * u;
    s += lines
      .map(
        (l, i) =>
          `<text x="${tx}" y="${r(last - (lines.length - 1 - i) * fs * 1.04)}" font-family="Archivo" font-weight="800" style="font-stretch:112%" font-size="${fs}" fill="${T.ink}">${l}</text>`,
      )
      .join("");
    if (!vertical) {
      // The corner YouTube covers with the video's length: keep the title and faces out of it.
      const cw = Math.round(150 * u);
      const ch = Math.round(60 * u);
      s += `<rect x="${W - cw - Math.round(14 * u)}" y="${H - ch - Math.round(14 * u)}" width="${cw}" height="${ch}" fill="none" stroke="#e3b23c" stroke-width="${Math.max(2, Math.round(2 * u))}" stroke-dasharray="${r(10 * u)} ${r(8 * u)}"/>`;
    }
  }
  s += `</svg>`;
  return page(W, H, s);
}
