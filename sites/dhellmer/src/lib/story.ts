/**
 * The About page's short bio and the life-story chapters (redesign brief v0.1, 2026-10-19).
 *
 * SHORT_BIO is third person, reusable for introductions and press, built only from facts the owner
 * has already published (LinkedIn export, founder note). The owner approves it at merge.
 *
 * CHAPTERS is a scaffold, not a chronology: themes from the brief, in no claimed order, each marked
 * with its real state. A chapter is written from an interview with the owner and published only
 * when he approves it. Unknown is shown as unknown; nothing is inferred. The private master
 * chronology lives outside this public repository.
 */

export const SHORT_BIO =
  "David Hellmer is an engineer, DJ and entrepreneur in Dallas–Fort Worth. Trained at the U.S. Navy's Nuclear Power Training Command, he spent two decades in building automation and low-voltage systems, from field technician to building automation department head, and has founded businesses including a freeze-dried food manufacturer he grew to national distribution. In 2025 he founded HLLMR Ventures, where he builds software with AI coding agents. He has been DJing for thirty years.";

export type ChapterState = "Written" | "In progress" | "Not yet written";

export interface Chapter {
  title: string;
  /** Years when known; empty when not yet established. Approximate dates say so. */
  years: string;
  line: string;
  state: ChapterState;
  /** Page of the published chapter, once there is one. */
  href?: string;
}

export const CHAPTERS: Chapter[] = [
  { title: "Origins", years: "", line: "Where I come from and what shaped me. To be written from an interview.", state: "Not yet written" },
  { title: "Navy nuclear power training", years: "1998–2000", line: "Where I learned to assume nothing works until I have watched it work.", state: "Not yet written" },
  { title: "Low voltage to building automation", years: "2004–2017", line: "From security and fire installs to leading a building automation division.", state: "Not yet written" },
  { title: "Music", years: "", line: "Thirty years behind the decks: a parallel pursuit, not a footnote.", state: "Not yet written" },
  { title: "Businesses", years: "2007–", line: "Five businesses, what worked, what didn't and what each one taught me.", state: "Not yet written" },
  { title: "Software and AI", years: "2025–", line: "From controls engineering to building software with AI agents.", state: "Not yet written" },
  { title: "Now, and what's unfinished", years: "", line: "What I'm working on and what I still mean to do.", state: "Not yet written" },
];
