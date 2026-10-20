/** The writing index. One record per published piece; feeds hllmr.com (/writing/, the home page, feed.xml) and dhellmer.com. */
import { hub } from "./urls.ts";

export interface Piece {
  slug: string;
  /** Canonical URL on hllmr.com (absolute). */
  path: string;
  title: string;
  description: string;
  author: string;
  /** First published on hllmr.com (ISO date), from the HLLMR/hllmr-site history. */
  published: string;
  kind: "Essay" | "Note";
}

export const WRITING: Piece[] = [
  {
    slug: "document-control-for-ai-agents",
    path: hub("/writing/document-control-for-ai-agents/"),
    title: "Document control for AI-assisted development",
    description:
      "Twenty years of construction document control, mapped onto building software with AI agents: witnessed tests over accepted claims, plan versus as-built, reasoning as the asset, and a corpus that sheds superseded revisions.",
    author: "David Hellmer",
    published: "2026-08-28",
    kind: "Essay",
  },
];
