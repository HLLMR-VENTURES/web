/** Site constants for live.hllmr.com (HLLMR LIVE, a division of HLLMR Ventures LLC; ADR-0015). */
import { revision } from "@hllmr/brand/revision";
import { divisionSite } from "@hllmr/portfolio";

export const SITE = divisionSite("live");
export const THEME_STORAGE_KEY = "hllmr-theme";

export const NAV = [
  { href: "/#bookings", label: "Bookings" },
  { href: "/#media", label: "Media" },
  { href: "/#contact", label: "Contact" },
] as const;

/** Footer revision: the last commit touching this site or the family packages it shows. */
export const REVISION = revision();
