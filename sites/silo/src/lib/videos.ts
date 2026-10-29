/**
 * The Silo launch videos on the HLLMR GAMING YouTube channel, shown with VideoFacade (nothing loads
 * from YouTube until a visitor presses play). Thumbnails are the channel's own, resized and served
 * from this site.
 *
 * List a video only once it is public. Scheduled Shorts go live at 11:00 America/Chicago on their
 * date; a page must never embed one before then, so they are added in a later release.
 */
import type { ImageMetadata } from "astro";
import showcase from "../assets/videos/showcase.jpg";
import howToCrashLog from "../assets/videos/how-to-crash-log.jpg";
import crashPark from "../assets/videos/crash-park.jpg";
import conflicts from "../assets/videos/conflicts.jpg";
import shareSet from "../assets/videos/share-set.jpg";

export interface Video {
  /** YouTube video id. */
  id: string;
  title: string;
  thumb: ImageMetadata;
  short?: boolean;
  duration?: string;
  /** Help topic (src/content/help/<id>.md) the video is shown on, in list order. */
  help?: string;
}

export const SHOWCASE: Video = {
  id: "JE-sVn1OI4g",
  title: "Silo in two minutes",
  thumb: showcase,
};

export const VIDEOS: Video[] = [
  {
    id: "-7QD-RVu1vw",
    title: "How to find the mod that crashed FS25 in log.txt",
    thumb: howToCrashLog,
    duration: "1:23",
    help: "crash-triage",
  },
  { id: "9E6CSWyU1L4", title: "FS25 crashed? Silo names the likely mod", thumb: crashPark, short: true, help: "crash-triage" },
  { id: "EU4qLxqUPh4", title: "Catch a mod conflict before you launch", thumb: conflicts, short: true, help: "conflicts" },
  { id: "sQ-QugiebJE", title: "Share your exact mod list with friends", thumb: shareSet, short: true, help: "collections" },
];
