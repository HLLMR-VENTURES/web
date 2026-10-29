# Media kits

Brand kits for setting up social accounts (profile pictures, banners, watermarks, thumbnail templates and
account copy), one per HLLMR brand. The rendered kits live on the owner's PC, in `F:\Media Kits\<Brand>\`.
This directory holds what rebuilds them: the generator, each brand's settings, its SVG masters and its
account copy.

## Layout

Every kit has the same folders, so the brands line up:

```
F:\Media Kits\<Brand>\
  README.md        colours, fonts, rules, every file with its pixel size, where each size came from
  copy.md          display name, handle ideas, bio, about text, links
  masters\         SVG masters (light, dark, one-colour white and black); masters\png\ has a PNG of each
  youtube\  x\  linkedin\  discord\  instagram\  tiktok\  facebook\  twitch\  bluesky\  reddit\
```

A platform with no banner (Instagram, TikTok) gets only a profile picture. Discord is only for the brands
that run a server.

## Building a kit

```
npm ci
node media-kit/build.mjs hllmr-gaming --out "F:\Media Kits"
```

The family brands are `hllmr-ventures`, `hllmr-tools`, `hllmr-upgrade`, `hllmr-live` and `hllmr-gaming`.
Silo builds with its own script (see below).

- **Needs:** Node 22.18 or newer (it imports the brand package's TypeScript directly), Edge or Chrome, found automatically (set `MEDIA_KIT_BROWSER` to point at another one), and
  `npm ci` for the brand fonts and `sharp`, which are already in the lockfile.
- **Adds no npm dependency.** A lockfile change would fire every site's release.
- **What it writes:** the SVG masters, into `media-kit/<brand>/masters/` (committed) and the kit, and every
  platform image into the kit only. It checks each image's pixel size and the platform's file-size limit,
  and fails rather than write a file that breaks either.
- **Without `--out`** it writes to `media-kit/out/`, which is ignored by Git.

## Files

| Path | What |
|---|---|
| `build.mjs` | The generator |
| `platforms.mjs` | Every platform's sizes, safe areas and limits, with the help page each came from and the date it was read |
| `lib/marks.mjs` | The arms (imported from `packages/brand/src/arms.ts`) and the wordmark (checked against `Wordmark.astro` on every run) |
| `lib/layouts.mjs` | The canvases: avatar, lockup, banner, pattern field, watermark, thumbnail templates |
| `lib/render.mjs` | Headless Edge or Chrome over the DevTools protocol, the same browser the sites' og.png cards are rendered with |
| `<brand>/brand.mjs` | The brand's arms, descriptor, colours, line and platform extras |
| `kit-README.md` | The kit README template: the build fills in the brand, its colours, file list and sources |
| `<brand>/copy.md` | The brand's account copy, copied into the kit |
| `<brand>/notes.md` | Optional: a brand-specific README section (GAMING's: how it shares a channel with Silo) |
| `<brand>/masters/` | The SVG masters the build writes |

## Who owns what

- **The family kits** (HLLMR VENTURES, TOOLS, UPGRADE, LIVE, GAMING), this README and the generator:
  the hllmr.com site agent.
- **`media-kit/silo/`**: the Silo site agent. Silo has its own build (`media-kit/silo/build.sh`, which
  runs `generate.py` in Docker) and its own README. Silo's mark keeps its own rules: it is never recoloured
  and never locked up with the HLLMR arms.

## Rules every kit follows

- **The marks come from the brand package**, never redrawn: `packages/brand` is the one source, and the build
  reads it rather than copying it.
- **Platform sizes come from each platform's own help page,** read on the day and recorded with its URL in
  `platforms.mjs`. Never size from memory; where a page gives no figure, say the size is ours.
- **Copy uses only what the live sites say:** no invented claims, dates or numbers.
- **Brand rules:**
  - a division is a "division", never a company or LLC, and the legal name is HLLMR Ventures LLC;
  - "a HLLMR", never "an";
  - VNTRS is for display only, and its accessible label is "Ventures";
  - no photos or personal details of the owner.
- **Release safety:** nothing here is under `sites/`, `packages/`, `deploy/` or `tests/url-contract/`, and the
  lockfile is untouched, so no site release fires. Reading `packages/brand` doesn't change it.
