/**
 * Marks for the media kits, drawn from the shared brand package so a kit never drifts from the sites:
 * the arms come from packages/brand/src/arms.ts (imported directly), the wordmark path data is checked
 * against packages/brand/components/Wordmark.astro on every run.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ARMS, SHIELD_PATH, FORM_HEIGHT, TINCTURES, coatMarkup } from "../../packages/brand/src/arms.ts";

export { ARMS, TINCTURES };

const WORDMARK_PATHS = [
  ["", "M0 0h4v10.4h10V0h4v24h-4V13.6H4V24H0z"],
  ["translate(24 0)", "M0 0h4v20.8h10V24H0z"],
  ["translate(41 0)", "M0 0h4v20.8h10V24H0z"],
  ["translate(58.5 0)", "M0 24V0h5l7 17 7-17h5v24h-4V8.46L13.6 24h-3.2L4 8.46V24z"],
  ["translate(88.5 0)", "M0 0h4v24H0z"],
  ["translate(88.5 0)", "M4 0h6.5a7 7 0 0 1 0 14H4zM4 3.2h6.5a3 3.8 0 0 1 0 7.6H4z", "evenodd"],
  ["translate(88.5 0)", "M8.2 13h4.4L18 24h-4.4z"],
];
export const WORDMARK_W = 106.5;
export const WORDMARK_H = 24;
export const SHIELD_W = 24;
export const SHIELD_H = FORM_HEIGHT.shield;

/** Fails the build if Wordmark.astro's geometry changed without this file following it. */
export function checkWordmarkSource() {
  const src = readFileSync(fileURLToPath(new URL("../../packages/brand/components/Wordmark.astro", import.meta.url)), "utf8");
  const missing = WORDMARK_PATHS.filter(([, d]) => !src.includes(`d="${d}"`));
  if (missing.length) throw new Error(`Wordmark.astro no longer matches media-kit/lib/marks.mjs: ${missing.map((m) => m[1]).join(", ")}`);
}

/** The HLLMR wordmark, cap height h, top-left at (x, y). */
export function wordmark({ x = 0, y = 0, h, fill }) {
  const s = h / WORDMARK_H;
  const paths = WORDMARK_PATHS.map(
    ([t, d, rule]) => `<path${t ? ` transform="${t}"` : ""}${rule ? ` fill-rule="${rule}"` : ""} d="${d}"/>`,
  ).join("");
  return `<g transform="translate(${r(x)} ${r(y)}) scale(${r(s, 5)})" fill="${fill}">${paths}</g>`;
}

let clipN = 0;
/**
 * A coat as an escutcheon, height h, top-left at (x, y). `edge` outlines it (Sable on light grounds,
 * Argent on dark, as on the sites); `mono` draws it in one colour, the field solid and the charge cut out.
 */
export function shield(key, { x = 0, y = 0, h, edge, mono }) {
  const s = h / SHIELD_H;
  const id = `k${++clipN}`;
  const ew = 24 / 120; // a hairline that scales with the mark: 1 px at 120 px wide
  if (mono) {
    // One colour: the field filled, the charge knocked out (a mask), so it works as a stamp.
    const charge = coatMarkup(key, "shield").replace(/<rect[^>]*\/>/, "").replace(/fill="[^"]*"/g, 'fill="#000"');
    return (
      `<g transform="translate(${r(x)} ${r(y)}) scale(${r(s, 5)})">` +
      `<mask id="${id}" maskUnits="userSpaceOnUse" x="-1" y="-1" width="26" height="31"><path d="${SHIELD_PATH}" fill="#fff"/>${charge}</mask>` +
      `<path d="${SHIELD_PATH}" fill="${mono}" mask="url(#${id})"/>` +
      `<path d="${SHIELD_PATH}" fill="none" stroke="${mono}" stroke-width="${ew}"/></g>`
    );
  }
  return (
    `<g transform="translate(${r(x)} ${r(y)}) scale(${r(s, 5)})">` +
    `<clipPath id="${id}"><path d="${SHIELD_PATH}"/></clipPath>` +
    `<g clip-path="url(#${id})">${coatMarkup(key, "shield")}</g>` +
    (edge ? `<path d="${SHIELD_PATH}" fill="none" stroke="${edge}" stroke-width="${ew}"/>` : "") +
    `</g>`
  );
}

export const r = (n, p = 2) => Math.round(n * 10 ** p) / 10 ** p;
