# HLLMR GAMING media kit

Everything needed to set up HLLMR GAMING's social accounts so they match gaming.hllmr.com. The marks are
drawn from the same brand package as the site (`packages/brand` in HLLMR-VENTURES/web), so they match it
exactly.

- **Rebuild:** `node media-kit/build.mjs hllmr-gaming --out "F:\Media Kits"` in HLLMR-VENTURES/web, after
  `npm ci`. It needs Edge or Chrome on the machine. The SVG masters are kept in the repo; the PNGs here are
  rendered from them and are not.
- **Copy:** display name, handle ideas, bio, about text and links are in `copy.md`.

## The brand in one paragraph

HLLMR GAMING is a division of HLLMR Ventures LLC: games, mods and the tools that make them easier to play.
Its arms are **Vert, a saltire Or** (green with a gold diagonal cross). Its name is the HLLMR wordmark with
the descriptor GAMING beside it. HLLMR is said "HELLmer", so it is always "a HLLMR division", never "an".

- **Endorsement line** (where the division needs to name its parent): `Gaming · a division of HLLMR Ventures LLC`,
  as on gaming.hllmr.com. Say "division"; never call GAMING a company or an LLC.
- **Silo's line** (where Silo appears on GAMING's accounts): `Silo · a HLLMR GAMING product`, as plain
  text. Silo's own mark is never recoloured and never set next to the HLLMR arms or wordmark.

## Marks

| Master | Use |
|---|---|
| `masters/avatar-dark.svg` | Profile pictures (all platform exports use this one). The shield sits inside the circle most platforms crop to. |
| `masters/avatar-light.svg` | The same on a light ground, where a platform shows the picture on white. |
| `masters/avatar-white.svg`, `avatar-black.svg` | One colour, transparent: the shield solid, the saltire cut out. For stamps, embroidery, single-colour print. |
| `masters/lockup-light.svg` | The horizontal lockup (arms, HLLMR, rule, GAMING) for light grounds. |
| `masters/lockup-dark.svg` | The same for dark grounds. |
| `masters/lockup-white.svg`, `lockup-black.svg` | One-colour lockups. |

The masters are vector and scale to any size. `masters/png/` has a PNG of each for tools that don't open
SVG. The lockup's GAMING is set in Archivo, embedded in the SVG; an editor that ignores embedded fonts
(some do) shows it in a fallback face, so use the PNG there.

### Rules

- **Clear space:** keep at least one wordmark cap height (the height of the H) empty on every side of the
  lockup.
- **Minimum size:** the lockup no smaller than 130 px wide on screen (wordmark cap height 12 px). Below
  about 48 px the shield's detail goes; the sites switch to the square banner form there, as in the
  favicon at https://gaming.hllmr.com/favicon.svg.
- **Do:** use the files as they are; put the dark masters on dark grounds and the light ones on light;
  give the arms room.
- **Don't:**
  - recolour the arms, or swap Vert and Or;
  - stretch, rotate, outline or shadow any mark;
  - reset GAMING in another typeface, or change the space and rule between it and the wordmark;
  - spread the saltire across a whole background as a field: across a full canvas it reads as a flag,
    not as arms (the banners use a small repeating saltire pattern instead);
  - put the Silo mark next to the HLLMR arms or wordmark;
  - add photos or personal details of the owner.

## Colours

| Name | Hex | Use |
|---|---|---|
| Vert | `#36602a` | GAMING's field: the shield, frames, the foot band |
| Or | `#e3b23c` | GAMING's charge: the saltire, hairlines. Never as text on a light ground |
| Sable | `#14161a` | Ink on light grounds; the arms' outline on light |
| Argent | `#f3f4f5` | The arms' outline on dark; text on Vert |
| Dark ground | `#0e1013` | Backgrounds of the banners, avatars and thumbnail band |
| Dark ink | `#eceef1` | Text on the dark ground |
| Dark muted | `#9ba3ae` | The line ("More playing, less fixing.") on dark |
| Light ground | `#e9ecef` | Light backgrounds |
| Light muted | `#525a66` | Secondary text on light |
| Vert, light tint | `#9ccb8c` | GAMING's accent colour as text on dark (the site's dark theme) |

## Typefaces

All three are free under the SIL Open Font License 1.1: they can be used commercially, in images, video
and print, and embedded in files. The one thing the licence forbids is selling the fonts themselves.
Download them from Google Fonts or Fontsource; the kit uses the @fontsource packages already in the web repo.

| Typeface | Use |
|---|---|
| Bodoni Moda (italic for the line) | Display: the line on banners. At 28 px and up only |
| Archivo (variable: width 125%, weight 500 for GAMING; width 112%, weight 800 for thumbnail titles) | The descriptor, labels and thumbnail titles |
| IBM Plex Mono | Codes and hex values, if ever needed |

## GAMING and Silo on one channel

The channel is HLLMR GAMING: its profile picture, banner and watermark are GAMING's. Silo is its first
product, and the channel trailer is Silo's showcase.

- **Silo's videos keep Silo's look,** made for the launch videos: background `#141a10`, gold `#F2C94C`,
  Fraunces for titles and Segoe UI Black for captions, with Silo's own mark. Their thumbnails follow that
  look, not this kit's template.
- **Everything else** (mods, channel news, what comes next) uses this kit's thumbnail template.
- **The two golds** are close but not the same (GAMING's Or `#e3b23c`, Silo's gold `#F2C94C`). Don't use
  them side by side in one graphic: a Silo graphic uses Silo's gold, a GAMING graphic uses Or.
- **Watermark:** GAMING's shield. It is small, sits in a corner, and stays off the Silo mark.

## Platform files

Every image below was rendered by the build, which checked its pixel size and the platform's file-size
limit. Notes:

- Instagram and TikTok have no banner, so those folders hold only a profile picture.
- Discord's server banner needs Boost Level 2 and the invite background Boost Level 1. Discord advises no
  logos or text on either, so both are pattern only.
- Reddit's figures could not be checked on Reddit's own page (it showed a bot check), so its sizes rest on
  a search engine's excerpt of that page. Check them when you set the community up.
- "Ours" in a note means the platform's page gives no figure and the size is our choice.

{{FILES}}

## Where the sizes come from

Each platform's own help page, read on 2026-10-28. Pages change: re-check before relying on a size for
something new.

{{SOURCES}}
