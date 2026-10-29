# Silo media kit

Logos, profile images, banners and thumbnail frames for Silo, the Farming Simulator 25 mod manager, plus profile copy in [copy.md](copy.md). Silo is a HLLMR GAMING product. It keeps its own mark and colours (ADR-0015).

- **Rendered kit:** `F:\Media Kits\Silo\` on the owner's PC. Its README adds a list of every file with its pixel size.
- **Sources:** `media-kit/silo/` in HLLMR-VENTURES/web. `masters/` holds the SVG masters, `generate.py` draws everything, and `build.sh` runs it. Rendered PNGs are not committed.

Rebuild the kit with `media-kit/silo/build.sh "/f/Media Kits/Silo"`. It needs Docker, and runs in a `node:24-bookworm` container. The fonts are the exact versions the site's lockfile pins, checked against their integrity hashes. The mark is read from `sites/silo/src/assets/brand/`, which is the site's copy of the app's drawing; the build never edits it. Every word is converted to outlines, so no SVG needs a font installed.

## The mark

| Form | What it is | Use it on |
|---|---|---|
| **Tile** | The silo on a field-green rounded square: the app icon | Anything, light or dark |
| **Glyph** | Silo and sun only, no tile | Light grounds, in its colours. On dark grounds, use the one-colour white glyph |
| **Logo** | Tile plus "Silo" in Fraunces 600 (SOFT 50): the website header | Text in ink `#2A2A22` on light, cream `#EDEBE0` on dark |
| **Wordmark** | Glyph plus "Silo": the app's form | Light grounds, or one colour anywhere |

Rules, from Silo's DESIGN.md and ADR-0015:

- **Clear space** around the mark is the height of the silo's dome: 10/64 of the tile's size, or 6/32 of the glyph's. The `-on-dark` and `-on-light` masters already include it.
- **Minimum size:** 16 px for the glyph and 24 px for the tile.
- **Never recolour the mark.** It has fixed colours and looks the same in both themes, and the sun stays gold. The only exception is one-colour use, where the whole glyph takes one colour: the `-mono-ink` and `-mono-white` files. The tile has no one-colour version.
- **Never lock the mark up with the HLLMR arms** or any other HLLMR mark. The connection to HLLMR GAMING is the endorsement line, set as plain text.
- **Don't** stretch, rotate, outline, shadow or crop the mark, or redraw the wordmark in another font.
- **Gold is never text on a light ground.** Gold is Silo's scarce attention colour; use it sparingly.

### Endorsement line

> Silo · a HLLMR GAMING product

Plain text, in Hanken Grotesk, set apart from the logo. Write "a HLLMR", never "an". Where a legal name is needed, it is **HLLMR Ventures LLC**. `endorsement-for-dark` and `endorsement-for-light` are the line as outlines.

## Colours

The mark's fixed colours:

| Role | Hex |
|---|---|
| Field green, tile top | `#4A7330` |
| Forest green, tile bottom | `#395A25` |
| Harvest gold, the sun | `#E3B23C` |
| Cream, the silo | `#F6F3EC` |
| Silo bands | `#E4DECE` |

Grounds and type, from the site's skin (`packages/design/skins/silo.css`, mirrored from the app):

| Role | Light (Daybreak) | Dark (Dusk) |
|---|---|---|
| Background | `#F6F3EC` | `#171A14` |
| Band | `#21361A` | `#13160F` |
| Text | `#2A2A22` | `#EDEBE0` |
| Muted text (the endorsement line) | `#5E5D50` | `#ADAC9C` |
| Gold-toned text | `#8A5F12` | `#F2D26B` |

## Fonts

| Font | Use | Licence |
|---|---|---|
| **Fraunces** (variable: opsz, wght, SOFT, WONK) | The wordmark (600, SOFT 50) and headings | SIL Open Font License 1.1 |
| **Hanken Grotesk** (variable: wght) | UI and body text; the endorsement line (500 here) | SIL Open Font License 1.1 |
| JetBrains Mono | Code, hashes and paths on the site | SIL Open Font License 1.1 |

Both OFL fonts can be used, embedded and shipped freely, but not sold on their own. The kit uses `@fontsource-variable/fraunces` 5.3.0 and `@fontsource-variable/hanken-grotesk` 5.3.0, the versions the site ships.

### Where the launch videos differ

The videos use some colours and a font that aren't Silo's. The owner decides whether to keep them.

| Videos | Silo's nearest | Notes |
|---|---|---|
| Gold `#F2C94C` | `#E3B23C` | The sun in the mark stays `#E3B23C` whatever surrounds it |
| Card text `#F3EFE2`, `#D9D3BF`, `#B8B19B` | `#EDEBE0` text, `#ADAC9C` muted | |
| Card ground: radial `#2B3A1F` to `#141A10`; pad `#141A10` | `#171A14` background, `#13160F` band | Close; no conflict with the mark |
| Captions in Segoe UI Black | Hanken Grotesk | Segoe UI is Microsoft's and comes with Windows. Rendering it into a video is fine, but don't ship the font file |
| Titles in Fraunces 600 | Fraunces | Matches |

## Platforms

Every size was checked against the platform's live help page on 2026-10-28. Priority, per the launch-videos spec: the logo, the endorsement line, the thumbnail frames and Discord. X isn't requested yet; its files are here in case.

| Platform | Item | File | Size | What the page says | Source |
|---|---|---|---|---|---|
| Discord | Server icon | `discord/silo-server-icon-1024.png` | 1024×1024 | **No published size.** Discord's help pages don't give one, so this is a square upload that survives its circle and rounded-square crops | not documented |
| Discord | Server banner | `discord/silo-server-banner-1920x1080.png` | 1920×1080 | 16:9, at least 960×540, and 1920×1080 is resized automatically. Keep the top 48 px (at 540) simple, and avoid a logo or text. Needs Boosting Level 2 | [Server Banners](https://support.discord.com/hc/en-us/articles/360028716472-Server-Banners) |
| Discord | Invite background | `discord/silo-invite-background-1920x1080.png` | 1920×1080 | Must be 1920×1080, JPG or PNG, not animated. The invite pop-up covers the centre, and no logo or text is recommended. Needs Boosting Level 1 | [Server Invite Background](https://support.discord.com/hc/en-us/articles/4415841146391-Server-Invite-Background) |
| X | Profile photo | `x/silo-profile-400.png` | 400×400 | 400×400 recommended; JPG, GIF or PNG under 2 MB; no animated GIFs | [Help with uploading a profile photo](https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo) |
| X | Header | `x/silo-header-1500x500.png` | 1500×500 | 1500×500 recommended. Up to 60 px at the top and bottom may be cropped, so the type stays inside y 60–440 | [How to customize your profile](https://help.x.com/en/managing-your-account/how-to-customize-your-profile), and the page above |
| Reddit | Community icon | `reddit/silo-community-icon-300.png` | 300×300 | "a 300x300px image" | [Community icon](https://support.reddithelp.com/hc/en-us/articles/15484265952660-Community-icon) |
| Reddit | Banner, desktop | `reddit/silo-banner-desktop-2144x256.png` | 2144×256 | At least 1072×128; this is twice that | [Banner](https://support.reddithelp.com/hc/en-us/articles/15484339588884-Banner) |
| Reddit | Banner, mobile | `reddit/silo-banner-mobile-2160x256.png` | 2160×256 | At least 1080×128; this is twice that | [Banner](https://support.reddithelp.com/hc/en-us/articles/15484339588884-Banner) |
| YouTube | Video thumbnail frame | `youtube/silo-thumbnail-frame-1920x1080.png`, `-3840x2160.png` | 1920×1080, 3840×2160 | 3840×2160 for videos, at least 640 px wide, 16:9, JPG or PNG. 2 MB limit on mobile, 50 MB on desktop | [Add video thumbnails](https://support.google.com/youtube/answer/72431?hl=en&co=GENIE.Platform%3DDesktop) |
| YouTube | Shorts thumbnail frame | `youtube/silo-thumbnail-frame-1080x1920.png`, `-2160x3840.png` | 1080×1920, 2160×3840 | 2160×3840 for Shorts, at least 640 px high, 9:16 | the same page |

The thumbnail frames follow the launch videos' layout, so Silo's thumbnails look distinct from HLLMR GAMING's:

- The shot fills the whole frame; everything not covered is transparent. Put the frame over a still and export as JPG or PNG.
- A darkened third in Silo's band colour (`#13160F`, about 90 % opaque, fading into the shot) carries the 3 or 4 huge title words. It's the left third of the landscape frame and the top third of the vertical one, because a left third is too narrow for huge words at 9:16.
- The tile sits bottom right. It is lifted clear of the corner, where YouTube draws the video's length.
- Custom thumbnails need a channel with intermediate features, which means a verified phone number ([feature access](https://support.google.com/youtube/answer/9890437)).

The YouTube channel itself is HLLMR GAMING's, so this kit has no channel icon or banner.

### The live Silo Discord (checked 2026-10-28)

The server's public invite (`silo.hllmr.com/discord`, which is `discord.gg/NpxcYdGHrW`) shows:

- an icon is set, but it's a 180 px image of an older drawing of the mark;
- no banner and no invite background;
- 0 boosts.

`discord/silo-server-icon-1024.png` is the current tile at 1024 px and is meant to **replace** the live icon. The banner and the invite background are ready, but Discord only shows them once the server reaches Boosting Level 2 and Level 1. Changing the icon is a server setting, so the owner does it in Discord.

`masters/png/silo-avatar-1024.png` is a general profile picture for any other platform that takes a square image.

**Skipped**, because Silo is a product, not a company, and none of these is a likely home for it:

- **LinkedIn:** the company page belongs to HLLMR Ventures.
- **Instagram and TikTok:** undecided. If an account is made, start from `silo-avatar-1024.png` and check that platform's live help page first.
- **Facebook, Twitch:** no Silo account is planned.
- **Bluesky:** no published pixel sizes for profile pictures or banners, so nothing could be checked.

## Masters

All the SVGs are in `masters/`, with PNG renders in `masters/png/`. "for-dark" and "for-light" files have a transparent background and are coloured for that ground. "on-dark" and "on-light" files carry the ground and the clear space.

| Master | Ground | Notes |
|---|---|---|
| `silo-tile` | transparent | The app icon. The corners are transparent |
| `silo-tile-on-dark`, `silo-tile-on-light` | `#171A14`, `#F6F3EC` | With clear space |
| `silo-glyph` | transparent | For light grounds |
| `silo-glyph-mono-ink`, `silo-glyph-mono-white` | transparent | One colour, the only recolour allowed |
| `silo-glyph-on-light`, `silo-glyph-on-dark` | `#F6F3EC`, `#171A14` | The dark version uses the white one-colour glyph |
| `silo-logo-for-dark`, `silo-logo-for-light` | transparent | Tile and wordmark: the main logo |
| `silo-logo-on-dark`, `silo-logo-on-light` | `#171A14`, `#F6F3EC` | With clear space |
| `silo-wordmark`, `-mono-ink`, `-mono-white`, `-on-light`, `-on-dark` | as named | The glyph form, as in the app |
| `silo-avatar` | `#171A14` | The tile, sized to survive a circle crop |
| `endorsement-for-dark`, `endorsement-for-light` | transparent | The endorsement line |

The banner and invite art (dusk sky, low sun, field rows) carries no mark and no words, as Discord asks. It is generated in `generate.py` (`field()`), and it isn't part of the mark.
