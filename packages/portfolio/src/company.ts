/**
 * The company behind every HLLMR site (ADR-0015 D5): legal text, copyright, privacy controller and
 * structured data always name HLLMR Ventures LLC, whichever site shows them.
 */
import { ORIGINS } from "./urls.ts";

export const COMPANY = {
  /** Legal name. */
  owner: "HLLMR Ventures LLC",
  locality: "Dallas–Fort Worth, Texas",
  founder: "David Hellmer",
  /** The founder's personal site. */
  founderUrl: ORIGINS.dhellmer,
  /** The one contact route (owner decision 2026-10-18): a plain mailto, nothing sent by any site. */
  email: "d@hllmr.com",
  github: "https://github.com/HLLMR",
  /** Source of every HLLMR site. */
  siteSource: "https://github.com/HLLMR/web",
} as const;

/** A mailto link with a subject line (the address stays visible beside it). */
export const mailto = (subject: string): string => `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}`;
