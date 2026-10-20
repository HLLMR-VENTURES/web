/**
 * The HLLMR armory: the house (HLLMR Ventures, VNTRS), its four divisions and its products, drawn
 * from a fixed rulebook (heraldry direction, owner decision 2026-10-18; division arms approved by the
 * owner 2026-10-20, ADR-0015 D4; geometry from the mood board).
 *
 * Rules: one metal (Argent, Or) on one colour; every pair clears 3:1; one partition or ordinary per
 * coat; no two divisions share a field tincture. A product may share its division's field, as a
 * family likeness (Silo's green, under GAMING), but never its ordinary. The house bears the
 * plainest arms.
 * Two forms on one 24-unit grid: the banner (24 x 24) below 48 px, the escutcheon (24 x 28.785)
 * from 48 px up. Clip paths live once per page in ArmsDefs.astro.
 */
export const TINCTURES = {
  argent: { name: "Argent", hex: "#f3f4f5" },
  or: { name: "Or", hex: "#e3b23c" },
  sable: { name: "Sable", hex: "#14161a" },
  azure: { name: "Azure", hex: "#1a4480" },
  gules: { name: "Gules", hex: "#a3262a" },
  vert: { name: "Vert", hex: "#36602a" },
  purpure: { name: "Purpure", hex: "#5a3672" },
} as const;
export type Tincture = keyof typeof TINCTURES;
/** The partition or ordinary a coat bears (heraldic "division of the field" in the wider sense). */
export type Partition = "perPale" | "chevron" | "bend" | "fessDancetty" | "quarterly" | "pale" | "saltire";
export type Form = "banner" | "shield";

export interface Coat {
  /** Who bears it. */
  bearer: string;
  division: Partition;
  field: Tincture;
  charge: Tincture;
  /** The blazon, for captions and accessible names. */
  blazon: string;
  /** Plain-language description for visitors who don't read blazon. */
  plain: string;
}

export const ARMS = {
  house: {
    bearer: "HLLMR Ventures",
    division: "perPale",
    field: "sable",
    charge: "argent",
    blazon: "Per pale Sable and Argent",
    plain: "split down the middle, black and white",
  },
  tools: {
    bearer: "HLLMR TOOLS",
    division: "pale",
    field: "purpure",
    charge: "argent",
    blazon: "Purpure, a pale Argent",
    plain: "purple with a white upright band",
  },
  upgrade: {
    bearer: "HLLMR UPGRADE",
    division: "chevron",
    field: "azure",
    charge: "argent",
    blazon: "Azure, a chevron Argent",
    plain: "blue with a white chevron",
  },
  gaming: {
    bearer: "HLLMR GAMING",
    division: "saltire",
    field: "vert",
    charge: "or",
    blazon: "Vert, a saltire Or",
    plain: "green with a gold diagonal cross",
  },
  silo: {
    bearer: "Silo",
    division: "bend",
    field: "vert",
    charge: "or",
    blazon: "Vert, a bend Or",
    plain: "green with a gold diagonal band",
  },
  live: {
    bearer: "HLLMR LIVE",
    division: "fessDancetty",
    field: "gules",
    charge: "or",
    blazon: "Gules, a fess dancetty Or",
    plain: "red with a gold zigzag band",
  },
} as const satisfies Record<string, Coat>;
export type ArmsKey = keyof typeof ARMS;

export const SHIELD_PATH = "M0 0H24V8A24 24 0 0 1 12 28.785A24 24 0 0 1 0 8Z";
export const BANNER_PATH = "M0 0H24V24H0Z";
export const FORM_HEIGHT: Record<Form, number> = { banner: 24, shield: 28.785 };

/**
 * The field and charge of a coat as SVG markup, in its form's coordinates (to be clipped by the
 * form's clip path). Constant geometry: an unchanged coat renders byte-identically every build.
 */
export function coatMarkup(key: ArmsKey, form: Form): string {
  const c = ARMS[key];
  const F = TINCTURES[c.field].hex;
  const C = TINCTURES[c.charge].hex;
  const H = FORM_HEIGHT[form];
  const d = form === "shield" ? 1 : 0; // ordinaries sit one unit lower on the escutcheon's fess point
  const field = `<rect x="-2" y="-2" width="28" height="${H + 4}" fill="${F}"/>`;
  switch (c.division) {
    case "perPale":
      return field + `<rect x="12" y="-2" width="14" height="${H + 4}" fill="${C}"/>`;
    case "chevron":
      return (
        field +
        `<polygon points="-10,${26.757 + d} 12,${4.757 + d} 34,${26.757 + d} 34,${35.243 + d} 12,${13.243 + d} -10,${35.243 + d}" fill="${C}"/>`
      );
    case "bend":
      return (
        field +
        `<polygon points="-10,${-14.243 + d} 34,${29.757 + d} 34,${38.243 + d} -10,${-5.757 + d}" fill="${C}"/>`
      );
    case "fessDancetty": {
      const up: string[] = [];
      const dn: string[] = [];
      for (let x = -8; x <= 32; x += 4) {
        const yc = 13.5 + d + (((x % 8) + 8) % 8 === 0 ? -3.5 : -6.5);
        up.push(`${x},${yc}`);
        dn.unshift(`${x},${yc + 7}`);
      }
      return field + `<polygon points="${[...up, ...dn].join(" ")}" fill="${C}"/>`;
    }
    case "pale":
      return field + `<rect x="8" y="-2" width="8" height="${H + 4}" fill="${C}"/>`;
    case "saltire":
      return (
        field +
        `<polygon points="-10,${-14.243 + d} 34,${29.757 + d} 34,${38.243 + d} -10,${-5.757 + d}" fill="${C}"/>` +
        `<polygon points="34,${-14.243 + d} -10,${29.757 + d} -10,${38.243 + d} 34,${-5.757 + d}" fill="${C}"/>`
      );
    case "quarterly": {
      const cy = form === "shield" ? 13 : 12;
      return (
        field +
        `<rect x="12" y="-2" width="14" height="${cy + 2}" fill="${C}"/><rect x="-2" y="${cy}" width="14" height="${H + 4}" fill="${C}"/>`
      );
    }
  }
}

/**
 * A coat as a standalone favicon (banner form), outlined in Sable on light and Argent on dark.
 * Served by each family site as /favicon.svg, so the tab shows the site's own arms.
 */
export function faviconSvg(key: ArmsKey): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 26 26">` +
    `<style>.e{stroke:#14161a}@media (prefers-color-scheme:dark){.e{stroke:#e6e8eb}}</style>` +
    `<defs><clipPath id="c"><path d="${BANNER_PATH}"/></clipPath></defs>` +
    `<g clip-path="url(#c)">${coatMarkup(key, "banner")}</g>` +
    `<path d="${BANNER_PATH}" fill="none" class="e" stroke-width="2"/></svg>
`
  );
}
