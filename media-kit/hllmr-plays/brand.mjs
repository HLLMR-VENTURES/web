/**
 * HLLMR PLAYS: the owner's let's-play channel, a sub-brand of HLLMR LIVE (owner, 2026-10-28: "Put
 * PLAYS under LIVE"). It bears LIVE's arms and skin; only the descriptor differs. No site of its
 * own yet, so its link is live.hllmr.com and its kit carries no line.
 * YouTube first, plus Twitch for streams; the other platforms are left out until the owner asks.
 */
export default {
  folder: "HLLMR PLAYS",
  name: "HLLMR PLAYS",
  coat: "live",
  descriptor: "PLAYS",
  site: "https://live.hllmr.com/",
  // No published line for PLAYS yet: banners carry the lockup alone (bannerPage needs a string).
  line: "",
  about:
    "HLLMR PLAYS is HLLMR's let's-play channel, part of HLLMR LIVE, which is a division of HLLMR Ventures LLC. It bears LIVE's arms; only the descriptor changes.",
  endorse: "`Plays · part of HLLMR LIVE`. PLAYS is a channel, not a division: never call it a company or an LLC.",
  accentDark: "#e59a9c",
  pattern: { color: "#a3262a", opacity: 0.5 },
  theme: "dark",
  extras: ["youtube-extras"],
  platforms: { x: null, linkedin: null, discord: null, instagram: null, tiktok: null, facebook: null, bluesky: null, reddit: null },
};
