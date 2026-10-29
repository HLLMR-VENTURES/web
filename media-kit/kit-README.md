# {{NAME}} media kit

Everything needed to set up {{NAME}}'s social accounts so they match {{SITE}}. The marks are drawn from the
same brand package as the site (`packages/brand` in HLLMR-VENTURES/web), so they match it exactly.

- **Rebuild:** `node media-kit/build.mjs {{KEY}} --out "F:\Media Kits"` in HLLMR-VENTURES/web, after
  `npm ci`. It needs Node 22.18 or newer and Edge or Chrome. The SVG masters are kept in the repo; the PNGs
  here are rendered from them and are not.
- **Copy:** display name, handle ideas, bio, about text and links are in `copy.md`.

## The brand in one paragraph

{{ABOUT}} Its arms are **{{BLAZON}}** ({{PLAIN}}). Its name is the HLLMR wordmark with the descriptor
{{DESCRIPTOR}} beside it. HLLMR is said "HELLmer", so it is always "a HLLMR", never "an".

- **Endorsement line:** {{ENDORSE}}

## Marks

| Master | Use |
|---|---|
| `masters/avatar-dark.svg` | Profile pictures (all platform exports use this one). The shield sits inside the circle most platforms crop to. |
| `masters/avatar-light.svg` | The same on a light ground, where a platform shows the picture on white. |
| `masters/avatar-white.svg`, `avatar-black.svg` | One colour, transparent: the shield solid, the charge cut out. For stamps, embroidery, single-colour print. |
| `masters/lockup-light.svg` | The horizontal lockup (arms, HLLMR, rule, {{DESCRIPTOR}}) for light grounds. |
| `masters/lockup-dark.svg` | The same for dark grounds. |
| `masters/lockup-white.svg`, `lockup-black.svg` | One-colour lockups. |

The masters are vector and scale to any size. `masters/png/` has a PNG of each for tools that don't open
SVG. The lockup's {{DESCRIPTOR}} is set in Archivo, embedded in the SVG; an editor that ignores embedded
fonts (some do) shows it in a fallback face, so use the PNG there.

### Rules

- **Clear space:** keep at least one wordmark cap height (the height of the H) empty on every side of the
  lockup.
- **Minimum size:** the lockup no smaller than 130 px wide on screen (wordmark cap height 12 px). Below
  about 48 px the shield's detail goes; the sites switch to the square banner form there, as in the
  favicon at {{SITE_URL}}favicon.svg.
- **Do:** use the files as they are; put the dark masters on dark grounds and the light ones on light;
  give the arms room.
- **Don't:**
  - recolour the arms, or swap their colours;
  - stretch, rotate, outline or shadow any mark;
  - reset {{DESCRIPTOR}} in another typeface, or change the space and rule between it and the wordmark;
  - spread the arms' ordinary across a whole background as a field: across a full canvas it reads as a
    flag, not as arms (the banners use a small repeating pattern of it instead);
  - put a product's own mark (Silo's, for one) next to the HLLMR arms or wordmark;
  - add photos or personal details of the owner.

## Colours

{{COLOURS}}

## Typefaces

All three are free under the SIL Open Font License 1.1: they can be used commercially, in images, video
and print, and embedded in files. The one thing the licence forbids is selling the fonts themselves.
Download them from Google Fonts or Fontsource; the kit uses the @fontsource packages already in the web repo.

| Typeface | Use |
|---|---|
| Bodoni Moda (italic for the line) | Display: the line on banners. At 28 px and up only |
| Archivo (variable: width 125%, weight 500 for the descriptor; weight 800 for the huge words on thumbnails) | The descriptor, labels and thumbnail words |
| IBM Plex Mono | Codes and hex values, if ever needed |
{{NOTES}}
## Platform files

Every image below was rendered by the build, which checked its pixel size and the platform's file-size
limit. Notes:

{{PLATFORM_NOTES}}
- "Ours" in a note means the platform's page gives no figure and the size is our choice.

{{FILES}}

## Where the sizes come from

Each platform's own help page, read on 2026-10-28. Pages change: re-check before relying on a size for
something new.

{{SOURCES}}
