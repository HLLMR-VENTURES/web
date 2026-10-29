/**
 * dhellmer.com's platforms: personal profiles, not brand pages. YouTube, X, Instagram, TikTok and
 * Bluesky use the same sizes as a brand, so their sizes and sources come from the shared
 * ../platforms.mjs (read on each platform's own help page on 2026-10-28). LinkedIn, Facebook and
 * Reddit differ for a person, so their personal-profile help pages are read and recorded here, on the
 * same day. Where a page gives no figure, the note says the size is ours.
 *
 * Each platform gets the monogram ("mark") and, where the platform takes a picture of the person, the
 * published portrait ("photo"). LinkedIn's personal photo must show the member's likeness, so it gets
 * the photo only.
 */
import { PLATFORMS as SHARED } from "../platforms.mjs";

const MB = 1024 * 1024;
const D = "2026-10-28";

/** The shared asset list with the family-only `only` gates dropped (this kit takes every YouTube extra). */
const shared = (key, notes = {}) =>
  SHARED[key].assets.filter((a) => !a.only || a.only === "youtube-extras").map(({ only, ...a }) => ({ ...a, note: notes[a.file] ?? a.note }));

/** A photo avatar: the published portrait's square crop, at most its native 400 px (never upscaled). */
const photo = (file, w, extra = {}) => ({ file, kind: "photo", w: Math.min(w, 400), h: Math.min(w, 400), ...extra });

export const PLATFORMS = {
  youtube: {
    name: "YouTube",
    sources: SHARED.youtube.sources,
    assets: [
      ...shared("youtube", {
        "profile-800x800.png": "Profile picture, monogram. Renders at 98×98; the page gives no upload size, 800 is ours",
        "watermark-300x300.png": "Video watermark (branding): the monogram on its dark plate, square, over the 150×150 minimum",
        "thumbnail-overlay-1920x1080.png": "Thumbnail template: put the video still under it, type the title on the bottom band beside the monogram",
        "thumbnail-guide-1920x1080.png": "Thumbnail guide: sample title size, safe margin, and the corner the video length covers",
        "shorts-overlay-1080x1920.png": "Shorts thumbnail template: the title goes on the band below the middle",
        "shorts-guide-1080x1920.png": "Shorts thumbnail guide: sample title size and safe margin",
      }).map((a) => (a.file === "profile-800x800.png" ? { ...a, file: "profile-mark-800x800.png" } : a)),
      photo("profile-photo-400x400.png", 400, { maxBytes: 15 * MB, note: "Profile picture, photo (the portrait's native 400 px crop). Renders at 98×98" }),
    ],
  },
  linkedin: {
    name: "LinkedIn (personal profile)",
    sources: [
      {
        url: "https://www.linkedin.com/help/linkedin/answer/a549049",
        says: "Profile photo 400×400 to 7680×4320 px, 8 MB max. Background photo 1584×396 recommended. PNG or JPG; no GIFs.",
        checked: D,
      },
      {
        url: "https://www.linkedin.com/help/linkedin/answer/a566232",
        says: "Background photo JPG or PNG, under 8 MB, 1584×396; it sits behind the profile photo, and how much shows varies with the window.",
        checked: D,
      },
      {
        url: "https://www.linkedin.com/help/linkedin/answer/a1377087",
        says: "The profile photo must be a likeness of the member: logos, words and the like are not allowed.",
        checked: D,
      },
    ],
    assets: [
      photo("profile-photo-400x400.png", 400, { maxBytes: 8 * MB, note: "Profile photo (photo only: LinkedIn requires a likeness, so no monogram here)" }),
      {
        file: "background-1584x396.png",
        kind: "banner",
        w: 1584,
        h: 396,
        safe: { x: 560, y: 36, w: 984, h: 250 },
        maxBytes: 8 * MB,
        line: true,
        note: "Background photo. Content on the right and upper part: the profile photo covers the lower left (our layout choice)",
      },
    ],
  },
  x: {
    name: "X",
    sources: SHARED.x.sources,
    assets: [
      ...shared("x").map((a) => (a.kind === "avatar" ? { ...a, file: "profile-mark-400x400.png", note: "Profile photo, monogram" } : a)),
      photo("profile-photo-400x400.png", 400, { maxBytes: 2 * MB, note: "Profile photo, photo" }),
    ],
  },
  bluesky: {
    name: "Bluesky",
    sources: SHARED.bluesky.sources,
    assets: [
      ...shared("bluesky").map((a) => (a.kind === "avatar" ? { ...a, file: "avatar-mark-1000x1000.png", note: "Avatar, monogram. Size is ours; 1 MB limit" } : a)),
      photo("avatar-photo-400x400.png", 400, { maxBytes: 1000000, note: "Avatar, photo. 1 MB limit" }),
    ],
  },
  instagram: {
    name: "Instagram",
    sources: SHARED.instagram.sources,
    assets: [
      ...shared("instagram").map((a) => ({ ...a, file: "profile-mark-1080x1080.png", note: "Profile picture, monogram (no banner on Instagram). Size is ours; the page gives none" })),
      photo("profile-photo-400x400.png", 400, { note: "Profile picture, photo" }),
    ],
  },
  tiktok: {
    name: "TikTok",
    sources: SHARED.tiktok.sources,
    assets: [
      ...shared("tiktok").map((a) => ({ ...a, file: "profile-mark-1080x1080.png", note: "Profile photo, monogram (no banner on TikTok). Size is ours" })),
      photo("profile-photo-400x400.png", 400, { note: "Profile photo, photo" }),
    ],
  },
  facebook: {
    name: "Facebook (personal profile)",
    sources: [
      { url: "https://www.facebook.com/help/220070894714080", says: "Cover photo: at least 720 px wide; it can be repositioned after upload. No other dimensions.", checked: D },
      { url: "https://www.facebook.com/help/163248423739693", says: "How to add or change the profile picture. No dimensions.", checked: D },
      {
        url: "https://www.facebook.com/help/125379114252045",
        says: "For Pages, not profiles: profile picture 320×320 cropped to a circle; cover 851×315; 16:9 on computers, 2.4:1 on phones. Used here only as guidance for the cover's proportions.",
        checked: D,
        official: false,
      },
    ],
    assets: [
      photo("profile-photo-400x400.png", 400, { note: "Profile picture, photo. The profile page gives no size; 400 is the portrait's native crop" }),
      { file: "profile-mark-400x400.png", kind: "avatar", w: 400, h: 400, note: "Profile picture, monogram. Size is ours" },
      {
        file: "cover-1702x630.png",
        kind: "banner",
        w: 1702,
        h: 630,
        safe: { x: 340, y: 48, w: 1240, h: 500 },
        note: "Cover photo: twice the Pages figure of 851×315, over the 720 px minimum. Content inside the 2.4:1 phone crop and clear of the lower left (our layout choice; the profile page gives no size)",
      },
    ],
  },
  reddit: {
    name: "Reddit (user profile)",
    sources: [
      {
        url: "https://support.reddithelp.com/hc/en-us/articles/360043036152-How-do-I-update-my-avatar-image",
        says: "Steps to upload an avatar image. No dimensions, and no profile banner size.",
        checked: D,
      },
    ],
    assets: [
      { file: "avatar-mark-400x400.png", kind: "avatar", w: 400, h: 400, note: "Avatar, monogram. Size is ours: the page gives none" },
      photo("avatar-photo-400x400.png", 400, { note: "Avatar, photo. Size is ours" }),
    ],
  },
};

/** Platforms the brief listed or the family kits carry, left out of this kit, with the reason. */
export const SKIPPED = [
  ["Discord", "no server is planned for a personal channel; the family kits carry the Discord set"],
  ["Twitch", "no streaming is planned; the channel is commentary on YouTube"],
  ["Reddit banner", "Reddit's help gives no size for a user profile banner, so none is drawn"],
];
