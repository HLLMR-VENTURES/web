/** (Test pre-release branch for infra's switch-back exercise; never merged.) Site constants for upgrade.hllmr.com (HLLMR UPGRADE, a division of HLLMR Ventures LLC; ADR-0015). */
import { revision } from "@hllmr/brand/revision";
import { divisionSite } from "@hllmr/portfolio";

export const SITE = divisionSite("upgrade");
export const THEME_STORAGE_KEY = "hllmr-theme";

export const NAV = [
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "How it works" },
  { href: "/#ownership", label: "Ownership" },
  { href: "/#contact", label: "Contact" },
] as const;

/** Footer revision: the last commit touching this site or the family packages it shows. */
export const REVISION = revision();
