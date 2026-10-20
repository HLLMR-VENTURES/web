/** Site constants for gaming.hllmr.com (HLLMR GAMING, a division of HLLMR Ventures LLC; ADR-0015). */
import { revision } from "@hllmr/brand/revision";
import { divisionSite } from "@hllmr/portfolio";

export const SITE = divisionSite("gaming");
export const THEME_STORAGE_KEY = "hllmr-theme";

export const NAV = [
  { href: "/#featured", label: "Silo" },
  { href: "/#mods", label: "Mods" },
  { href: "/#planned", label: "Planned" },
  { href: "/#contact", label: "Contact" },
] as const;

/** Footer revision: the last commit touching this site or the family packages it shows. */
export const REVISION = revision();
