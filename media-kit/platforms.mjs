/**
 * Platform image sizes, read on each platform's own help page on 2026-10-28 (never from memory).
 * Where a page gives no figure, the size chosen here is marked as ours, and the README says so.
 * `safe` is the area every device shows: from the page where it gives one, otherwise our layout
 * choice (noted). Re-check these pages before a rebuild that matters; they change.
 */
const MB = 1024 * 1024;
const D = "2026-10-28";

export const PLATFORMS = {
  youtube: {
    name: "YouTube",
    sources: [
      {
        url: "https://support.google.com/youtube/answer/10456525",
        says: "Profile picture renders at 98×98, JPG/GIF/BMP/PNG, 15 MB max. Banner minimum 2048×1152 (16:9), recommended 2560×1440, safe area 1235×338 at the minimum size, 6 MB max. Watermark minimum 150×150, square, under 1 MB.",
        checked: D,
      },
      {
        url: "https://support.google.com/youtube/answer/72431",
        says: "Thumbnails 3840×2160 for videos, 2160×3840 for Shorts; minimum width (Shorts: height) 640; JPG or PNG; 2 MB on mobile, 50 MB on desktop.",
        checked: D,
      },
      {
        url: "https://support.google.com/youtube/answer/9890437",
        says: "Feature access: custom thumbnails are a feature of the standard tier and up, with a daily limit. No image sizes on this page.",
        checked: D,
      },
    ],
    assets: [
      { file: "profile-800x800.png", kind: "avatar", w: 800, h: 800, maxBytes: 15 * MB, note: "Profile picture. Renders at 98×98; the page gives no upload size, 800 is ours" },
      {
        file: "banner-2560x1440.png",
        kind: "banner",
        w: 2560,
        h: 1440,
        safe: { x: 508, y: 508, w: 1544, h: 423 },
        maxBytes: 6 * MB,
        jpeg: true,
        note: "Channel banner. Content inside 1544×423, the 1235×338 safe area scaled from 2048 to 2560 (our arithmetic)",
      },
      { file: "watermark-300x300.png", kind: "watermark", w: 300, h: 300, maxBytes: 1 * MB, note: "Video watermark (branding). Transparent, square, over the 150×150 minimum" },
      { file: "thumbnail-overlay-1920x1080.png", kind: "thumb-overlay", w: 1920, h: 1080, maxBytes: 2 * MB, only: "youtube-extras", note: "Thumbnail template: put the video still under it, set 3–4 huge words on the dark left third" },
      { file: "thumbnail-guide-1920x1080.png", kind: "thumb-guide", w: 1920, h: 1080, maxBytes: 2 * MB, jpeg: true, only: "youtube-extras", note: "Thumbnail guide: the still's slot, sample word size, and the corner the video length covers" },
      { file: "shorts-overlay-1080x1920.png", kind: "thumb-overlay", w: 1080, h: 1920, maxBytes: 2 * MB, only: "youtube-extras", note: "Shorts thumbnail template: the words go on the dark bottom third" },
      { file: "shorts-guide-1080x1920.png", kind: "thumb-guide", w: 1080, h: 1920, maxBytes: 2 * MB, jpeg: true, only: "youtube-extras", note: "Shorts thumbnail guide" },
    ],
  },
  x: {
    name: "X",
    sources: [
      {
        url: "https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo",
        says: "Profile image 400×400 recommended; JPEG, GIF or PNG; 2 MB max.",
        checked: D,
      },
      {
        url: "https://help.x.com/en/managing-your-account/how-to-customize-your-profile",
        says: "Header 1500×500; up to 60 px may be cropped at the top and bottom. No file size limit stated.",
        checked: D,
      },
    ],
    assets: [
      { file: "profile-400x400.png", kind: "avatar", w: 400, h: 400, maxBytes: 2 * MB, note: "Profile photo" },
      {
        file: "header-1500x500.png",
        kind: "banner",
        w: 1500,
        h: 500,
        safe: { x: 430, y: 60, w: 1010, h: 380 },
        note: "Header. Clear of the 60 px top and bottom crop; the left is left free for the profile photo, which overlaps it (our layout choice)",
      },
    ],
  },
  linkedin: {
    name: "LinkedIn",
    sources: [
      {
        url: "https://www.linkedin.com/help/linkedin/answer/a563309",
        says: "Page logo 400×400 recommended (268×268 minimum); cover 1512×256; PNG or JPEG, 3 MB max; keep key details away from the edges, especially lower right.",
        checked: D,
      },
    ],
    assets: [
      { file: "logo-400x400.png", kind: "avatar", w: 400, h: 400, maxBytes: 3 * MB, note: "Page logo" },
      {
        file: "cover-1512x256.png",
        kind: "banner",
        w: 1512,
        h: 256,
        safe: { x: 300, y: 30, w: 1000, h: 196 },
        maxBytes: 3 * MB,
        line: false,
        note: "Page cover. Away from the edges and the lower right; the left is left free for the logo (our layout choice)",
      },
    ],
  },
  discord: {
    name: "Discord",
    sources: [
      { url: "https://docs.discord.com/developers/resources/guild", says: "Guild icon: 1024×1024 png/jpeg/gif (developer docs; the Help Center gives no size).", checked: D },
      {
        url: "https://support.discord.com/hc/en-us/articles/360028716472-Server-Banners",
        says: "Banner at least 960×540, 16:9; 1920×1080 is resized; keep the top 48 px simple; avoid logos and text. Needs Boost Level 2.",
        checked: D,
      },
      {
        url: "https://support.discord.com/hc/en-us/articles/4415841146391-Server-Invite-Background",
        says: "Invite background must be 1920×1080, JPG or PNG; the invite pop-up covers the centre; no logos or text recommended. Needs Boost Level 1.",
        checked: D,
      },
    ],
    assets: [
      { file: "server-icon-1024x1024.png", kind: "avatar", w: 1024, h: 1024, only: "discord", note: "Server icon" },
      { file: "server-banner-960x540.png", kind: "field", w: 960, h: 540, only: "discord", note: "Server banner (Boost Level 2). Pattern only: Discord advises no logos or text" },
      { file: "server-banner-1920x1080.png", kind: "field", w: 1920, h: 1080, only: "discord", note: "Server banner at 2× (Discord resizes it)" },
      { file: "invite-splash-1920x1080.png", kind: "field", w: 1920, h: 1080, only: "discord", note: "Invite background (Boost Level 1). Pattern only; the invite covers the centre" },
    ],
  },
  instagram: {
    name: "Instagram",
    sources: [
      {
        url: "https://help.instagram.com/557544397610546",
        says: "No dimensions, file size or shape on the page. 320×320 and a circle crop are third-party figures; 1080×1080 is ours.",
        checked: D,
        official: false,
      },
    ],
    assets: [{ file: "profile-1080x1080.png", kind: "avatar", w: 1080, h: 1080, note: "Profile picture (no banner on Instagram). Size is ours; the page gives none" }],
  },
  tiktok: {
    name: "TikTok",
    sources: [{ url: "https://www.tiktok.com/support/faq_detail?id=7581821549855038008", says: "Photos must be at least 20×20. Nothing else stated; 1080×1080 is ours.", checked: D }],
    assets: [{ file: "profile-1080x1080.png", kind: "avatar", w: 1080, h: 1080, note: "Profile photo (no banner on TikTok). Size is ours; the page gives only a 20×20 minimum" }],
  },
  facebook: {
    name: "Facebook",
    sources: [
      {
        url: "https://www.facebook.com/help/125379114252045",
        says: "Page profile picture 320×320, cropped to a circle. Cover loads fastest as 851×315 (minimum 400×150); 16:9 on computers, 2.4:1 on phones; the profile picture overlaps it about 40 px on phones; PNG for logos or text.",
        checked: D,
      },
    ],
    assets: [
      { file: "profile-320x320.png", kind: "avatar", w: 320, h: 320, note: "Page profile picture" },
      {
        file: "cover-851x315.png",
        kind: "banner",
        w: 851,
        h: 315,
        safe: { x: 170, y: 24, w: 620, h: 250 },
        note: "Page cover. Inside the 2.4:1 phone crop and clear of the lower-left overlap (our layout choice)",
      },
    ],
  },
  twitch: {
    name: "Twitch",
    sources: [
      {
        url: "https://help.twitch.tv/s/article/channel-page-setup",
        says: "Profile picture JPEG, PNG or GIF, 10 MB max (no dimensions given; 800×800 is ours). Profile banner 1200×480 recommended, scaled to 480 high; keep graphics on the left.",
        checked: D,
      },
      {
        url: "https://blog.twitch.tv/en/2017/06/22/put-your-channel-page-to-work-while-youre-afk-b1e9b0ffc7b4/",
        says: "Video player (offline) banner 1920×1080, important content near the centre (Twitch blog, 2017; the help page gives no size).",
        checked: D,
      },
    ],
    assets: [
      { file: "profile-800x800.png", kind: "avatar", w: 800, h: 800, maxBytes: 10 * MB, note: "Profile picture. Size is ours; the page gives none" },
      { file: "profile-banner-1200x480.png", kind: "banner", w: 1200, h: 480, safe: { x: 40, y: 60, w: 760, h: 360 }, align: "left", note: "Profile banner. Graphics on the left, as Twitch advises" },
      {
        file: "offline-banner-1920x1080.png",
        kind: "banner",
        w: 1920,
        h: 1080,
        safe: { x: 360, y: 300, w: 1200, h: 480 },
        note: "Video player (offline) banner. Content near the centre (2017 guidance)",
      },
    ],
  },
  bluesky: {
    name: "Bluesky",
    sources: [
      {
        url: "https://github.com/bluesky-social/atproto/blob/main/packages/bsky/lexicons/app/bsky/actor/profile.json",
        says: "Avatar and banner: PNG or JPEG, 1,000,000 bytes max (the profile lexicon). No dimensions anywhere official; 1000×1000 and 1500×500 (3:1) are ours.",
        checked: D,
      },
    ],
    assets: [
      { file: "avatar-1000x1000.png", kind: "avatar", w: 1000, h: 1000, maxBytes: 1000000, jpeg: true, note: "Avatar. Size is ours; 1 MB limit" },
      {
        file: "banner-1500x500.png",
        kind: "banner",
        w: 1500,
        h: 500,
        safe: { x: 430, y: 60, w: 1010, h: 380 },
        maxBytes: 1000000,
        jpeg: true,
        note: "Banner. Size is ours; the left is left free for the avatar, which overlaps it",
      },
    ],
  },
  reddit: {
    name: "Reddit",
    sources: [
      {
        url: "https://support.reddithelp.com/hc/en-us/articles/15484265952660-Community-icon",
        says: "Community icon 300×300. NOT VERIFIED: the page shows a bot check; figure from a search engine's excerpt of it.",
        checked: D,
        official: false,
      },
      {
        url: "https://support.reddithelp.com/hc/en-us/articles/15484339588884-Banner",
        says: "Community banner 1080×128 recommended (desktop at least 1072×128). NOT VERIFIED, as above.",
        checked: D,
        official: false,
      },
    ],
    assets: [
      { file: "community-icon-300x300.png", kind: "avatar", w: 300, h: 300, note: "Community icon (size not verified: see sources)" },
      { file: "community-banner-1080x128.png", kind: "banner", w: 1080, h: 128, safe: { x: 40, y: 14, w: 1000, h: 100 }, line: false, note: "Community banner (size not verified: see sources)" },
    ],
  },
};
