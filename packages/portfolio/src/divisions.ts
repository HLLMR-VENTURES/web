/**
 * The HLLMR sites (ADR-0015 D1): HLLMR Ventures, shown as VNTRS, the parent and holding company
 * that owns the brand, and the four divisions under it. A division is not a separate company
 * until an LLC exists (D5): copy says "division", and legal text names HLLMR Ventures LLC.
 */
import type { Division } from "./projects.ts";
import { ORIGINS } from "./urls.ts";

export interface DivisionSite {
  key: Division;
  /** Display name. */
  name: string;
  /** The descriptor set beside the HLLMR wordmark, in capitals. */
  descriptor: string;
  /** Accessible name for the descriptor ("VNTRS" is read as "Ventures"). */
  label: string;
  /** Site origin, without a trailing slash. */
  origin: string;
  /** Key into the armory (@hllmr/brand, src/arms.ts). */
  coat: "house" | "tools" | "upgrade" | "live" | "gaming";
  /** The field it works in, in one or two words. */
  field: string;
  /** One line for cards and the cross-site bar's title. */
  line: string;
  /** Subject line for this site's mailto contact. */
  subject: string;
}

export const DIVISION_SITES: DivisionSite[] = [
  {
    key: "vntrs",
    name: "HLLMR Ventures",
    descriptor: "VNTRS",
    label: "Ventures",
    origin: ORIGINS.vntrs,
    coat: "house",
    field: "Parent company",
    line: "The company behind HLLMR. It owns the name and the work, and runs four divisions.",
    subject: "HLLMR Ventures",
  },
  {
    key: "tools",
    name: "HLLMR TOOLS",
    descriptor: "TOOLS",
    label: "Tools",
    origin: ORIGINS.tools,
    coat: "tools",
    field: "Software",
    line: "Useful software, built with purpose.",
    subject: "Tools question",
  },
  {
    key: "upgrade",
    name: "HLLMR UPGRADE",
    descriptor: "UPGRADE",
    label: "Upgrade",
    origin: ORIGINS.upgrade,
    coat: "upgrade",
    field: "Business systems",
    line: "Your business deserves more than a website.",
    subject: "Upgrade enquiry",
  },
  {
    key: "live",
    name: "HLLMR LIVE",
    descriptor: "LIVE",
    label: "Live",
    origin: ORIGINS.live,
    coat: "live",
    field: "Media",
    line: "HLLMR behind the decks, on camera and on stage.",
    subject: "Booking enquiry",
  },
  {
    key: "gaming",
    name: "HLLMR GAMING",
    descriptor: "GAMING",
    label: "Gaming",
    origin: ORIGINS.gaming,
    coat: "gaming",
    field: "Gaming",
    line: "More playing, less fixing.",
    subject: "Gaming question",
  },
];

/** The site record for a division key. */
export const divisionSite = (key: Division): DivisionSite => DIVISION_SITES.find((d) => d.key === key)!;
