/**
 * dhellmer.com's media-kit canvases: the personal mark (a "DH" monogram with the copper bar, from the
 * site's favicon) and the name lockup, in the site's own skin (sites/dhellmer/src/styles/tokens.css:
 * Instrument Sans condensed for display, IBM Plex Mono for indexes; graphite and warm off-white with one
 * copper accent). No HLLMR arms or wordmark: dhellmer.com does not carry them (ADR-0015).
 *
 * Every canvas is an HTML page the shared renderer (../lib/render.mjs) screenshots at an exact size.
 * Fonts are embedded as data URIs (SIL OFL 1.1, from the site's own @fontsource dependencies), so a
 * page or an SVG master needs no file or network access.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const font = (rel) =>
  "data:font/woff2;base64," + readFileSync(fileURLToPath(new URL(`../../node_modules/${rel}`, import.meta.url))).toString("base64");
const INSTRUMENT = font("@fontsource-variable/instrument-sans/files/instrument-sans-latin-wdth-normal.woff2");
const PLEX_MONO = font("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2");

/** The display face only: what the SVG masters embed. */
export const DISPLAY_FACE = `@font-face{font-family:"Instrument Sans";src:url(${INSTRUMENT}) format("woff2");font-weight:400 700;font-stretch:75% 100%}`;
const MONO_FACE = `@font-face{font-family:"IBM Plex Mono";src:url(${PLEX_MONO}) format("woff2");font-weight:400}`;
const FACES = DISPLAY_FACE + MONO_FACE;

/** The site's tokens (sites/dhellmer/src/styles/tokens.css), per theme. */
export const THEMES = {
  light: { ground: "#e9e7e2", surface: "#dfdcd5", rule: "#c8c4bb", ink: "#141414", muted: "#5a5852", accent: "#92461e" },
  dark: { ground: "#0f0f10", surface: "#19191b", rule: "#2a2a2c", ink: "#ecebe6", muted: "#9c9a94", accent: "#c97a46" },
};

export const NAME = "DAVID HELLMER";
export const DOMAIN = "DHELLMER.COM";
/** The site's positioning line (owner-approved copy on dhellmer.com), the last phrase in the accent. */
export const LINE = ["ENGINEER. DJ. ", "BUILDER OF BUSINESSES."];
/** The thumbnail guide's sample title, two lines. */
const TITLE = ["YOUR TITLE HERE,", "TWO LINES AT MOST"];

export const r = (n, p = 2) => Math.round(n * 10 ** p) / 10 ** p;

const DISPLAY = `font-family="Instrument Sans, Arial Narrow, sans-serif" font-weight="700" style="font-stretch:75%"`;
const LINEFONT = `font-family="Instrument Sans, Arial Narrow, sans-serif" font-weight="600" style="font-stretch:85%"`;
const MONO = `font-family="IBM Plex Mono, monospace" font-weight="400"`;
/** Mono labels are tracked 0.14em, as on the site. */
const TRACK = 0.14;

/**
 * Measures the fonts once, in the browser, per 1 px of font size: set widths from the page's own SVG
 * text (the engine that draws the canvases) and cap heights from the ink of an "H". The page's text
 * makes the browser load each face before the renderer evaluates the expression.
 */
export const MEASURE_PAGE = page(
  4000,
  700,
  `<svg width="4000" height="700">` +
    `<text id="dh" x="0" y="100" ${DISPLAY} font-size="100">DH</text>` +
    `<text id="name" x="0" y="220" ${DISPLAY} font-size="100">${NAME}</text>` +
    `<text id="line" x="0" y="340" ${LINEFONT} font-size="100">${LINE.join("")}</text>` +
    `<text id="t1" x="0" y="460" ${DISPLAY} font-size="100">${TITLE[0]}</text>` +
    `<text id="t2" x="2000" y="460" ${DISPLAY} font-size="100">${TITLE[1]}</text>` +
    `<text id="dom" x="0" y="580" ${MONO} font-size="100" letter-spacing="${TRACK * 100}">${DOMAIN}</text></svg>`,
);
// Trailing letter-space is not ink, so one track comes off the domain's advance.
export const MEASURE_EXPR = `(() => {
  const len = (id) => document.getElementById(id).getComputedTextLength() / 100;
  const c = document.createElement("canvas").getContext("2d");
  const cap = (font, stretch) => { c.font = font; c.fontStretch = stretch; return c.measureText("H").actualBoundingBoxAscent / 1000; };
  return {
    capD: cap('700 1000px "Instrument Sans"', "condensed"),
    capL: cap('600 1000px "Instrument Sans"', "semi-condensed"),
    capM: cap('400 1000px "IBM Plex Mono"', "normal"),
    dhW: len("dh"), nameW: len("name"), lineW: len("line"), titleW: Math.max(len("t1"), len("t2")),
    domainW: len("dom") - ${TRACK},
  };
})()`;

function page(w, h, body, { bg = "transparent" } = {}) {
  return (
    `<!doctype html><html><head><meta charset="utf-8"><style>${FACES}` +
    `html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${bg}}svg{display:block}</style></head>` +
    `<body>${body}</body></html>`
  );
}

/** A standalone SVG document; embeds the faces its text uses. */
export function svgDoc(inner, w, h, { title, bg } = {}) {
  const faces = (inner.includes("Instrument Sans") ? DISPLAY_FACE : "") + (inner.includes("IBM Plex Mono") ? MONO_FACE : "");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(w)} ${r(h)}" width="${r(w)}" height="${r(h)}" role="img"${title ? ` aria-label="${title}"` : ""}>` +
    (title ? `<title>${title}</title>` : "") +
    (faces ? `<style>${faces}</style>` : "") +
    (bg ? `<rect width="${r(w)}" height="${r(h)}" fill="${bg}"/>` : "") +
    inner +
    `</svg>\n`
  );
}

/** Puts an SVG document on an HTML page at w x h for the renderer. */
export function svgPage(svgText, w, h, bg) {
  return page(w, h, svgText.replace(/width="[^"]*" height="[^"]*"/, `width="${w}" height="${h}"`), { bg: bg ?? "transparent" });
}

/**
 * The monogram: "DH" in the display face over a short copper bar, centred so the whole mark sits
 * inside the inscribed circle (a circle crop never touches it). `mono` draws letters and bar in one ink.
 */
export function avatarInner(S, m, { theme = "dark", mono } = {}) {
  const T = THEMES[theme];
  let fs = 0.5 * S;
  const fit = () => {
    const capH = m.capD * fs;
    const barH = 0.042 * S;
    const gap = 0.06 * S;
    const blockH = capH + gap + barH;
    const halfW = (m.dhW * fs) / 2;
    return { capH, barH, gap, blockH, halfW, radius: Math.hypot(halfW, blockH / 2) };
  };
  let g = fit();
  while (g.radius > 0.36 * S) ((fs *= 0.97), (g = fit()));
  const top = (S - g.blockH) / 2;
  const barW = Math.min(2 * g.halfW, 0.34 * S);
  return (
    `<text x="${r(S / 2)}" y="${r(top + g.capH)}" text-anchor="middle" ${DISPLAY} font-size="${r(fs)}" letter-spacing="${r(-0.01 * fs)}" fill="${mono ?? T.ink}">DH</text>` +
    `<rect x="${r((S - barW) / 2)}" y="${r(top + g.capH + g.gap)}" width="${r(barW)}" height="${r(g.barH)}" fill="${mono ?? T.accent}"/>`
  );
}

/**
 * The name lockup in a 0-based box: the name (cap height h), a copper rule as wide as the name, and the
 * domain in mono beneath. Returns { svg, width, height }.
 */
export function lockupInner(m, { h = 100, theme = "dark", mono } = {}) {
  const T = THEMES[theme];
  const fsN = h / m.capD;
  const nameW = m.nameW * fsN;
  const ruleY = h + 0.3 * h;
  const ruleH = Math.max(1, 0.06 * h);
  const capM = 0.2 * h;
  const fsM = capM / m.capM;
  const domainY = ruleY + ruleH + 0.26 * h + capM;
  const width = Math.max(nameW, m.domainW * fsM);
  const svg =
    `<text x="0" y="${r(h)}" ${DISPLAY} font-size="${r(fsN)}" fill="${mono ?? T.ink}">${NAME}</text>` +
    `<rect x="0" y="${r(ruleY)}" width="${r(nameW)}" height="${r(ruleH)}" fill="${mono ?? T.accent}"/>` +
    `<text x="0" y="${r(domainY)}" ${MONO} font-size="${r(fsM)}" letter-spacing="${r(TRACK * fsM)}" fill="${mono ?? T.muted}">${DOMAIN}</text>`;
  return { svg, width, height: domainY + 0.05 * h };
}

/** Square profile picture: the monogram on the theme's ground. */
export function avatarPage(m, S, theme = "dark") {
  const T = THEMES[theme];
  return page(S, S, `<svg width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="${T.ground}"/>${avatarInner(S, m, { theme })}</svg>`);
}

/** Video watermark: the monogram on a solid dark plate (legible over any footage). */
export function watermarkPage(m, S) {
  return avatarPage(m, S, "dark");
}

/**
 * A banner or cover: the theme's ground with a quiet column grid (the site's hairline rules), and the
 * content block fitted inside `safe` ({x, y, w, h}): a copper bar, the name, the positioning line and the
 * domain. `align` is "center" or "left" within the safe area; `line: false` drops the positioning line
 * (for very shallow covers).
 */
export function bannerPage(m, W, H, safe, { theme = "dark", align = "center", line = true } = {}) {
  const T = THEMES[theme];
  // Block in local units: name cap 100.
  const capN = 100;
  const fsN = capN / m.capD;
  const nameW = m.nameW * fsN;
  const capL = 30;
  const fsL = capL / m.capL;
  const lineW = m.lineW * fsL;
  const capM = 16;
  const fsM = capM / m.capM;
  const domainW = m.domainW * fsM;
  const barW = 7;
  const pad = 26; // bar to text
  let y = capN;
  let parts =
    `<text x="0" y="${y}" ${DISPLAY} font-size="${r(fsN)}" fill="${T.ink}">${NAME}</text>`;
  if (line) {
    y += 34 + capL;
    parts +=
      `<text x="0" y="${y}" ${LINEFONT} font-size="${r(fsL)}" fill="${T.ink}">${LINE[0]}<tspan fill="${T.accent}">${LINE[1]}</tspan></text>`;
  }
  y += 30 + capM;
  parts += `<text x="0" y="${y}" ${MONO} font-size="${r(fsM)}" letter-spacing="${r(TRACK * fsM)}" fill="${T.muted}">${DOMAIN}</text>`;
  const blockW = barW + pad + Math.max(nameW, line ? lineW : 0, domainW);
  const blockH = y + 4;
  const k = Math.min(safe.w / blockW, safe.h / blockH) * 0.9;
  const bx = align === "left" ? safe.x : safe.x + (safe.w - blockW * k) / 2;
  const by = safe.y + (safe.h - blockH * k) / 2;
  const block =
    `<g transform="translate(${r(bx)} ${r(by)}) scale(${r(k, 5)})">` +
    `<rect x="0" y="0" width="${barW}" height="${r(blockH)}" fill="${T.accent}"/>` +
    `<g transform="translate(${barW + pad} 0)">${parts}</g></g>`;
  // Hairline column grid: 12 columns, the site's --rule colour, quiet.
  const cols = 12;
  let grid = "";
  for (let i = 1; i < cols; i++) grid += `<rect x="${r((W * i) / cols)}" y="0" width="1" height="${H}" fill="${T.rule}"/>`;
  return page(
    W,
    H,
    `<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${T.ground}"/><g opacity="0.55">${grid}</g>${block}</svg>`,
  );
}

/**
 * Thumbnail templates. The overlay is transparent: a title band with a copper top rule and the
 * monogram at its left, to lay over a frame grab. The guide adds a sample title, the outer safe margin
 * and the corner YouTube covers with the video length (kept clear). Vertical (Shorts) puts the band in
 * the lower middle, clear of the bottom of the frame where players draw controls.
 */
export function thumbPage(m, W, H, { guide = false } = {}) {
  const T = THEMES.dark;
  const vertical = H > W;
  const u = Math.min(W, H) / 100; // 1% of the short side
  const bandH = vertical ? 0.2 * H : 0.27 * H;
  const bandY = vertical ? 0.56 * H : H - bandH;
  const ruleH = Math.max(2, 0.9 * u);
  const S = bandH * 0.62; // monogram tile
  const tileX = 4 * u;
  const tileY = bandY + (bandH - S) / 2;
  let svg =
    `<rect x="0" y="${r(bandY)}" width="${W}" height="${r(bandH)}" fill="${T.ground}" fill-opacity="0.88"/>` +
    `<rect x="0" y="${r(bandY)}" width="${W}" height="${r(ruleH)}" fill="${T.accent}"/>` +
    `<g transform="translate(${r(tileX)} ${r(tileY)})"><rect width="${r(S)}" height="${r(S)}" fill="${T.ground}"/>${avatarInner(S, m, { theme: "dark" })}</g>`;
  if (guide) {
    const textX = tileX + S + 4 * u;
    // Title cap height a fifth of the band, smaller if the longer sample line would pass the safe margin.
    const fsT = Math.min((bandH * 0.22) / m.capD, (W - textX - 9 * u) / m.titleW);
    const capT = fsT * m.capD;
    const l1Y = bandY + bandH / 2 - capT * 0.15;
    svg +=
      `<text x="${r(textX)}" y="${r(l1Y)}" ${DISPLAY} font-size="${r(fsT)}" fill="${T.ink}">${TITLE[0]}</text>` +
      `<text x="${r(textX)}" y="${r(l1Y + capT * 1.35)}" ${DISPLAY} font-size="${r(fsT)}" fill="${T.accent}">${TITLE[1]}</text>`;
    // Outer safe margin (5% of the short side) and the video-length corner (landscape only).
    const sm = 5 * u;
    const dash = `stroke-dasharray="${r(2 * u)} ${r(1.2 * u)}"`;
    svg += `<rect x="${r(sm)}" y="${r(sm)}" width="${r(W - 2 * sm)}" height="${r(H - 2 * sm)}" fill="none" stroke="${T.ink}" stroke-opacity="0.6" stroke-width="${r(Math.max(2, 0.3 * u))}" ${dash}/>`;
    if (!vertical) {
      const cw = 0.14 * W;
      const ch = 0.12 * H;
      svg +=
        `<rect x="${r(W - cw - u)}" y="${r(H - ch - u)}" width="${r(cw)}" height="${r(ch)}" fill="none" stroke="${T.accent}" stroke-width="${r(Math.max(2, 0.35 * u))}" ${dash}/>` +
        `<text x="${r(W - cw / 2 - u)}" y="${r(H - ch / 2 - u + 1.2 * u)}" text-anchor="middle" ${MONO} font-size="${r(2.6 * u)}" letter-spacing="${r(0.3 * u)}" fill="${T.accent}">LENGTH</text>`;
    }
    const labelFs = 2.4 * u;
    svg += `<text x="${r(sm + u)}" y="${r(sm + 3.2 * u)}" ${MONO} font-size="${r(labelFs)}" letter-spacing="${r(0.3 * u)}" fill="${T.ink}" fill-opacity="0.8">GUIDE · NOT FOR UPLOAD</text>`;
  }
  // The guide is shown on a mid-grey stand-in for a frame grab so its marks read; the overlay stays transparent.
  return page(W, H, `<svg width="${W}" height="${H}">${guide ? `<rect width="${W}" height="${H}" fill="#55585c"/>` : ""}${svg}</svg>`);
}
