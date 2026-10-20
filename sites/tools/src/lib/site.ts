/** (Test pre-release branch for infra's switch-back exercise; never merged.) Site constants for tools.hllmr.com (HLLMR TOOLS, a division of HLLMR Ventures LLC; ADR-0015). */
import { revision } from "@hllmr/brand/revision";
import { divisionSite } from "@hllmr/portfolio";

export const SITE = divisionSite("tools");
export const THEME_STORAGE_KEY = "hllmr-theme";

export const NAV = [
  { href: "/#available", label: "Available" },
  { href: "/#development", label: "In development" },
  { href: "/#approach", label: "Approach" },
  { href: "/#contact", label: "Contact" },
] as const;

/** Footer revision: the last commit touching this site or the family packages it shows. */
export const REVISION = revision();
