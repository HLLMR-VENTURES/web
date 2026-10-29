# David Hellmer: personal media kit

Everything needed to set up David Hellmer's own accounts (a YouTube channel for commentary and opinion,
LinkedIn, and the rest) so they match dhellmer.com. Everything is drawn from the site itself: its favicon
mark, its typefaces and colours, its published portrait and its live copy.

- **Rebuild:** `node media-kit/dhellmer/build.mjs --out "F:\Media Kits"` in HLLMR-VENTURES/web, after
  `npm ci`. It needs Node 22 or newer and Edge or Chrome. The SVG masters are kept in the repo
  (`media-kit/dhellmer/masters/`); the PNGs here are rendered from them and are not.
- **Copy:** display name, handle ideas, bio, about text and links are in `copy.md`.

## The personal brand in one paragraph

dhellmer.com is a person's site, not a company's: engineer, DJ and builder of businesses, in
Dallas–Fort Worth. It is quiet and typographic: graphite and warm off-white with one copper accent, a
condensed uppercase name, and mono labels. It carries **no HLLMR arms or wordmark** (ADR-0015): HLLMR
Ventures is linked in text only ("Founder, HLLMR Ventures", hllmr.com), never shown as a logo here.

## Marks

| Master | Use |
|---|---|
| `masters/avatar-dark.svg` | The monogram: "DH" over a short copper bar, from the site's favicon (its full-width copper base, shortened so a circle crop keeps it). All the monogram profile pictures use this one. It sits inside the circle most platforms crop to. |
| `masters/avatar-light.svg` | The same on the light ground, where a platform shows the picture on white. |
| `masters/avatar-white.svg`, `avatar-black.svg` | One colour, transparent: letters and bar in one ink. For stamps, overlays, single-colour print. |
| `masters/lockup-light.svg` | The name lockup (DAVID HELLMER, a copper rule, DHELLMER.COM in mono) for light grounds. |
| `masters/lockup-dark.svg` | The same for dark grounds. |
| `masters/lockup-white.svg`, `lockup-black.svg` | One-colour lockups. |

The masters are vector and scale to any size. `masters/png/` has a PNG of each for tools that don't open
SVG. The SVGs embed their fonts; an editor that ignores embedded fonts (some do) shows a fallback face, so
use the PNG there.

### The photo

Every `*-photo-*` file is the portrait dhellmer.com already publishes, `sites/dhellmer/src/assets/portrait.jpg`
(1200×1500, no metadata), cropped square on the face ({{CROP}}) so it reads inside a circle at 98 px, and
toned as the site shows it (greyscale, contrast 1.06). No other photo is used. The crop is 400 px, so the
photo files are 400×400 and never upscaled; every platform here accepts that size.

Which to use: **LinkedIn takes the photo only** (its rules require a likeness). Elsewhere, the photo is the
personal choice and the monogram the quieter one; use the same one everywhere so the accounts read as one
person.

### Rules

- **Clear space:** keep at least the height of the name's capitals empty around the lockup, and leave the
  monogram on its square ground.
- **Minimum size:** the lockup no smaller than 160 px wide on screen. The monogram reads down to 16 px (it
  is the site's favicon).
- **Don't:**
  - add the HLLMR arms or wordmark, or any division's mark, to these files;
  - recolour the copper, stretch, rotate, outline or shadow any mark;
  - reset the name in another typeface;
  - use another photo, or add personal details the site doesn't publish (no email, phone, address or
    employer branding).

## Colours

The site's own tokens (`sites/dhellmer/src/styles/tokens.css`).

| Name | Dark theme | Light theme | Use |
|---|---|---|---|
| Ground | `#0f0f10` | `#e9e7e2` | Backgrounds: banners, monogram, thumbnail band |
| Surface | `#19191b` | `#dfdcd5` | Panels on the ground |
| Rule | `#2a2a2c` | `#c8c4bb` | Hairlines and the banners' column grid |
| Ink | `#ecebe6` | `#141414` | Text |
| Muted | `#9c9a94` | `#5a5852` | Secondary text, the domain |
| Copper | `#c97a46` | `#92461e` | The one accent: the bar, the rule, "Builder of businesses." Never more than one accent per image |

## Typefaces

Both are free under the SIL Open Font License 1.1: usable commercially, in images, video and print, and
embeddable. The licence forbids only selling the fonts themselves. The kit uses the @fontsource packages
already in the web repo.

| Typeface | Use |
|---|---|
| Instrument Sans (variable; width 75%, weight 700, uppercase) | The name, the monogram, thumbnail titles |
| Instrument Sans (width 85%, weight 600, uppercase) | The positioning line on banners |
| IBM Plex Mono (400, tracked 0.14em, uppercase) | Labels and the domain |

## Platform files

Every image below was rendered by the build, which checked its pixel size and the platform's file-size
limit. "Ours" in a note means the platform's page gives no figure and the size is our choice.

Left out of this kit:

{{SKIPPED}}

YouTube thumbnails: the **overlay** files are transparent; lay them over a frame grab and type the title on
the band. The **guide** files show the sample title size, a 5% safe margin and, on landscape, the bottom-right
corner YouTube covers with the video length. Keep titles to two lines.

{{FILES}}

## Where the sizes come from

Each platform's own help page, read on 2026-10-28. Pages change: re-check before relying on a size for
something new.

{{SOURCES}}
