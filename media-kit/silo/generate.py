"""Silo media kit generator. Run through build.sh, which supplies the fonts and tools.

    python3 generate.py REPO FONTS OUT

Reads the Silo mark from the site's brand sources (never edited here), sets every word as outlined
paths shaped by HarfBuzz from the lockfile-pinned fonts, writes SVG masters and composed platform
SVGs, and renders each to PNG with rsvg-convert. All sizes come from PLATFORMS below; the README
records where each one was checked.
"""

import json
import os
import re
import subprocess
import sys

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

REPO, FONTS, OUT = sys.argv[1:4]
BRAND = os.path.join(REPO, "sites/silo/src/assets/brand")

# Silo's own colours (packages/design/skins/silo.css, mirrored from the app). The mark itself keeps
# its fixed colours; these are grounds and type only.
INK = "#2A2A22"  # --text, light theme
CREAM = "#EDEBE0"  # --text, dark theme
MUTED_LIGHT = "#5E5D50"  # --muted, light theme
MUTED_DARK = "#ADAC9C"  # --muted, dark theme
LINEN = "#F6F3EC"  # --bg, light theme (Daybreak)
LOAM = "#171A14"  # --bg, dark theme (Dusk)
BAND = "#13160F"  # --band, dark theme
FRAME_EDGE = "#39402F"  # --border, dark theme
WHITE = "#FFFFFF"

ENDORSEMENT = "Silo · a HLLMR GAMING product"


# --- Type -------------------------------------------------------------------------------------

class Face:
    """One variable font pinned at one location: shaped by hb-shape, drawn by fontTools."""

    def __init__(self, woff2, location):
        font = TTFont(woff2)
        font.flavor = None
        self.ttf = os.path.join("/tmp", os.path.basename(woff2).replace(".woff2", ".ttf"))
        font.save(self.ttf)
        self.variations = ",".join(f"{k}={v}" for k, v in location.items())
        inst = instancer.instantiateVariableFont(TTFont(self.ttf), location)
        self.glyphs = inst.getGlyphSet()
        self.order = inst.getGlyphOrder()
        self.upm = inst["head"].unitsPerEm
        os2, hhea = inst["OS/2"], inst["hhea"]
        if os2.fsSelection & (1 << 7):  # USE_TYPO_METRICS
            self.ascent, self.descent = os2.sTypoAscender, -os2.sTypoDescender
        else:
            self.ascent, self.descent = hhea.ascent, -hhea.descent

    def shape(self, text):
        out = subprocess.run(
            ["hb-shape", "--font-file", self.ttf, "--variations", self.variations,
             "--output-format=json", "--no-glyph-names", text],
            check=True, capture_output=True, text=True).stdout
        return json.loads(out)

    def width(self, text, size):
        return sum(g["ax"] for g in self.shape(text)) * size / self.upm

    def path(self, text, size, x, baseline, fill):
        """The text as one outlined <path>, its baseline starting at (x, baseline)."""
        scale = size / self.upm
        pen = SVGPathPen(self.glyphs)  # composite glyphs (accents, the middle dot) look parts up here
        cursor = 0
        for g in self.shape(text):
            name = self.order[g["g"]]
            dx, dy = (cursor + g["dx"]) * scale, g["dy"] * scale
            self.glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x + dx, baseline - dy)))
            cursor += g["ax"]
        d = re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.2f}".rstrip("0").rstrip("."), pen.getCommands())
        return f'<path fill="{fill}" d="{d}"/>'

    def centred_baseline(self, size, box_top, box_height):
        """Baseline for a line-height:1 line box of this size, centred in a box (CSS flex centring)."""
        content = (self.ascent + self.descent) * size / self.upm
        line_top = box_top + (box_height - size) / 2
        return line_top + (size - content) / 2 + self.ascent * size / self.upm


# The wordmark: Fraunces 600, SOFT 50 (DESIGN.md). opsz follows the size the site and app set it at
# (24 px), so the drawn letters match what people see there. WONK stays at its default, off.
WORD = Face(os.path.join(FONTS, "@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2"),
            {"opsz": 24, "wght": 600, "SOFT": 50, "WONK": 0})
# UI text (the endorsement line): Hanken Grotesk, the site's and app's UI face.
UI = Face(os.path.join(FONTS, "@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2"),
          {"wght": 500})


# --- The mark ---------------------------------------------------------------------------------

def _inner(name):
    src = open(os.path.join(BRAND, name), encoding="utf-8").read()
    return re.search(r"<svg[^>]*>(.*)</svg>", src, re.S).group(1).strip()


TILE, GLYPH = _inner("silo-tile.svg"), _inner("silo-glyph.svg")
TILE_DOME = 10 / 64  # dome height as a share of the tile: the clear space (DESIGN.md)
GLYPH_DOME = 6 / 32


def tile(x, y, size):
    return f'<svg x="{x:g}" y="{y:g}" width="{size:g}" height="{size:g}" viewBox="0 0 64 64">{TILE}</svg>'


def glyph(x, y, size, mono=None):
    """The glyph in its colours, or wholly one colour (DESIGN.md: the only recolour allowed)."""
    body = GLYPH
    if mono:
        body = body.replace('fill="#E3B23C"', f'fill="{mono}"').replace('fill="#4A7330"', f'fill="{mono}"')
    return f'<svg x="{x:g}" y="{y:g}" width="{size:g}" height="{size:g}" viewBox="0 0 32 32">{body}</svg>'


def doc(w, h, body, bg=None, label="Silo"):
    ground = f'<rect width="{w:g}" height="{h:g}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" width="{w:g}" '
            f'height="{h:g}" role="img" aria-label="{label}">{ground}{body}</svg>\n')


def logo(x, y, t, text_fill):
    """Tile + "Silo", as the site header sets it: gap 0.3 T, type 0.72 T, centred on the tile."""
    size = 0.72 * t
    base = WORD.centred_baseline(size, y, t)
    tx = x + 1.3 * t
    return tile(x, y, t) + WORD.path("Silo", size, tx, base, text_fill), 1.3 * t + WORD.width("Silo", size)


def wordmark(x, y, g, text_fill, mono=None):
    """Glyph + "Silo", the app's silo-wordmark.svg geometry: text at x 34, baseline 25, 24 on 32."""
    k = g / 32
    body = glyph(x, y, g, mono) + WORD.path("Silo", 24 * k, x + 34 * k, y + 25 * k, mono or text_fill)
    return body, 34 * k + WORD.width("Silo", 24 * k)


def endorsement(x, baseline, size, fill):
    return UI.path(ENDORSEMENT, size, x, baseline, fill), UI.width(ENDORSEMENT, size)


# --- Output -----------------------------------------------------------------------------------

made = []  # (relative path, width, height) for the README file list


def write(rel, svg_text, renders=()):
    """Write an SVG, then each (png_rel, width, height) render of it."""
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(svg_text)
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', svg_text).group(1).split()]
    made.append((rel, vb[2], vb[3]))
    for png_rel, w, h in renders:
        png = os.path.join(OUT, png_rel)
        os.makedirs(os.path.dirname(png), exist_ok=True)
        subprocess.run(["rsvg-convert", "-w", str(w), "-h", str(h), "-o", png, path], check=True)
        made.append((png_rel, w, h))


def masters():
    m = "masters/"
    p = "masters/png/"
    # Tile: its own ground, so it works on anything.
    write(m + "silo-tile.svg", doc(64, 64, tile(0, 0, 64)),
          [(p + "silo-tile-1024.png", 1024, 1024), (p + "silo-tile-512.png", 512, 512)])
    c = 64 * TILE_DOME
    for name, bg in (("on-dark", LOAM), ("on-light", LINEN)):
        write(m + f"silo-tile-{name}.svg", doc(64 + 2 * c, 64 + 2 * c, tile(c, c, 64), bg),
              [(p + f"silo-tile-{name}-1024.png", 1024, 1024)])

    # Glyph: colour on light grounds only; one colour anywhere.
    c = 32 * GLYPH_DOME
    write(m + "silo-glyph.svg", doc(32, 32, glyph(0, 0, 32)), [(p + "silo-glyph-1024.png", 1024, 1024)])
    for name, ink in (("mono-ink", INK), ("mono-white", WHITE)):
        write(m + f"silo-glyph-{name}.svg", doc(32, 32, glyph(0, 0, 32, ink)),
              [(p + f"silo-glyph-{name}-1024.png", 1024, 1024)])
    write(m + "silo-glyph-on-light.svg", doc(32 + 2 * c, 32 + 2 * c, glyph(c, c, 32), LINEN),
          [(p + "silo-glyph-on-light-1024.png", 1024, 1024)])
    write(m + "silo-glyph-on-dark.svg", doc(32 + 2 * c, 32 + 2 * c, glyph(c, c, 32, WHITE), LOAM),
          [(p + "silo-glyph-on-dark-1024.png", 1024, 1024)])

    # Logo: tile + wordmark, the site header lockup.
    t = 64
    c = t * TILE_DOME
    for name, fill, bg in (("for-dark", CREAM, None), ("for-light", INK, None),
                           ("on-dark", CREAM, LOAM), ("on-light", INK, LINEN)):
        pad = c if bg else 0
        body, w = logo(pad, pad, t, fill)
        W, H = w + 2 * pad, t + 2 * pad
        write(m + f"silo-logo-{name}.svg", doc(W, H, body, bg),
              [(p + f"silo-logo-{name}-2048w.png", 2048, round(2048 * H / W))])

    # Wordmark: glyph + "Silo", the app's form. Colour on light only; one colour anywhere.
    g = 32
    c = g * GLYPH_DOME
    for name, fill, mono, bg in (("", INK, None, None), ("-mono-ink", None, INK, None),
                                 ("-mono-white", None, WHITE, None), ("-on-light", INK, None, LINEN),
                                 ("-on-dark", None, WHITE, LOAM)):
        pad = c if bg else 0
        body, w = wordmark(pad, pad, g, fill, mono)
        W, H = w + 2 * pad, g + 2 * pad
        write(m + f"silo-wordmark{name}.svg", doc(W, H, body, bg),
              [(p + f"silo-wordmark{name}-2048w.png", 2048, round(2048 * H / W))])

    # The endorsement line (ADR-0015 D4): plain text, never locked up with any HLLMR mark.
    size = 32
    for name, fill in (("for-dark", MUTED_DARK), ("for-light", MUTED_LIGHT)):
        body, w = endorsement(0, size * 0.95, size, fill)
        W, H = w, size * 1.25
        write(m + f"endorsement-{name}.svg", doc(W, H, body, label=ENDORSEMENT),
              [(p + f"endorsement-{name}-2048w.png", 2048, round(2048 * H / W))])


def thumbnail_frames():
    """Video thumbnail frames: a transparent slot for the shot, a band with the lockup and the line."""
    # Landscape 1280 x 720: the shot fills the top, a band along the bottom carries the type.
    W, H, band = 1280, 720, 132
    t = 72
    body, _ = logo(48, H - band + (band - t) / 2, t, CREAM)
    lw = endorsement(0, 0, 26, MUTED_DARK)[1]
    line, _ = endorsement(W - 48 - lw, H - band / 2 + 9, 26, MUTED_DARK)
    svg = doc(W, H, f'<rect y="{H - band}" width="{W}" height="{band}" fill="{BAND}"/>'
                    f'<rect y="{H - band}" width="{W}" height="2" fill="{FRAME_EDGE}"/>' + body + line)
    write("youtube/silo-thumbnail-frame-1280x720.svg", svg,
          [("youtube/silo-thumbnail-frame-1280x720.png", W, H)])

    # Vertical 1080 x 1920: the type sits in a top band, clear of the player's bottom and side controls.
    W, H, band = 1080, 1920, 300
    t = 104
    lw = logo(0, 0, t, CREAM)[1]
    body, _ = logo((W - lw) / 2, 64, t, CREAM)
    ew = endorsement(0, 0, 34, MUTED_DARK)[1]
    line, _ = endorsement((W - ew) / 2, 64 + t + 76, 34, MUTED_DARK)
    svg = doc(W, H, f'<rect width="{W}" height="{band}" fill="{BAND}"/>'
                    f'<rect y="{band - 2}" width="{W}" height="2" fill="{FRAME_EDGE}"/>' + body + line)
    write("youtube/silo-thumbnail-frame-1080x1920.svg", svg,
          [("youtube/silo-thumbnail-frame-1080x1920.png", W, H)])


def avatar(rel, px, png_rel=None, ground=LOAM):
    """Profile picture: the whole tile on Silo's dark ground, small enough to survive a circle crop.

    The tile's farthest corner sits 0.617 of its side from the centre, so a tile of 0.74 of the
    canvas stays inside the circle with a margin. The mark is never cropped or redrawn."""
    s = 0.74 * px
    write(rel + ".svg", doc(px, px, tile((px - s) / 2, (px - s) / 2, s), ground),
          [((png_rel or rel) + ".png", px, px)])


def banner(rel, w, h, safe, t, line_size=None):
    """Header image: Silo's dark ground, the logo (and optionally the line) centred in the safe box.

    safe = (x, y, width, height) of the area no platform crop or overlay covers."""
    sx, sy, sw, sh = safe
    lw = logo(0, 0, t, CREAM)[1]
    block = t + (line_size * 2.2 if line_size else 0)
    top = sy + (sh - block) / 2
    body, _ = logo(sx + (sw - lw) / 2, top, t, CREAM)
    if line_size:
        ew = endorsement(0, 0, line_size, MUTED_DARK)[1]
        body += endorsement(sx + (sw - ew) / 2, top + t + line_size * 1.9, line_size, MUTED_DARK)[0]
    write(rel + ".svg", doc(w, h, body, LOAM), [(rel + ".png", w, h)])


def field(w, h, uid, horizon=0.64, sun_x=0.76):
    """Background art with no mark and no words: a dusk sky, a low gold sun, field rows.

    Discord asks for banner and invite art without a logo or text, so those use this alone."""
    hy = horizon * h
    rows, y, step = [], hy, (h - hy) * 0.06
    shades = ("#2F4A1F", "#395A25", "#33521F", "#4A7330")
    i = 0
    while y < h:
        rows.append(f'<rect y="{y:.1f}" width="{w}" height="{min(step, h - y) + 1:.1f}" fill="{shades[i % 4]}"/>')
        y += step
        step *= 1.32
        i += 1
    r = 0.13 * h
    return (f'<defs><linearGradient id="sky-{uid}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{BAND}"/><stop offset="{horizon}" stop-color="#2B3F1E"/></linearGradient>'
            f'<radialGradient id="glow-{uid}" cx="{sun_x * w:.1f}" cy="{hy:.1f}" r="{0.75 * h:.1f}" gradientUnits="userSpaceOnUse">'
            f'<stop offset="0" stop-color="#E3B23C" stop-opacity="0.5"/><stop offset="1" stop-color="#E3B23C" stop-opacity="0"/>'
            f'</radialGradient></defs>'
            f'<rect width="{w}" height="{h}" fill="url(#sky-{uid})"/>'
            f'<rect width="{w}" height="{hy:.1f}" fill="url(#glow-{uid})"/>'
            f'<circle cx="{sun_x * w:.1f}" cy="{hy:.1f}" r="{r:.1f}" fill="#E3B23C"/>' + "".join(rows))


def art(rel, w, h, **kw):
    write(rel + ".svg", doc(w, h, field(w, h, "a", **kw), label="Silo background art"), [(rel + ".png", w, h)])


def generic_avatar():
    avatar("masters/silo-avatar", 1024, "masters/png/silo-avatar-1024")


def discord():
    # Server icon: Discord publishes no size; a square upload is cropped to its icon shape.
    avatar("discord/silo-server-icon-1024", 1024)
    # Banner: 16:9, at least 960x540, 1920x1080 is resized; top 48 px (of 540) kept simple; no logo or text.
    art("discord/silo-server-banner-1920x1080", 1920, 1080, horizon=0.66)
    # Invite background: must be 1920x1080, JPG or PNG; the invite pop-up covers the centre; no logo or text.
    art("discord/silo-invite-background-1920x1080", 1920, 1080, horizon=0.7, sun_x=0.84)


def x():
    avatar("x/silo-profile-400", 400)
    # Header 1500x500; up to 60 px top and bottom may be cropped, so the type stays in y 60..440.
    # The profile photo overlaps the lower left, so the type starts right of it.
    w, h = 1500, 500
    t = 104
    left = 560
    body = field(w, h, "x", horizon=0.78, sun_x=0.9)
    body += logo(left, 150, t, CREAM)[0]
    body += endorsement(left, 150 + t + 62, 30, MUTED_DARK)[0]
    write("x/silo-header-1500x500.svg", doc(w, h, body), [("x/silo-header-1500x500.png", w, h)])


def reddit():
    avatar("reddit/silo-community-icon-300", 300)
    # Banners: desktop at least 1072x128, mobile at least 1080x128. Made at twice that for sharp screens.
    art("reddit/silo-banner-desktop-2144x256", 2144, 256, horizon=0.6, sun_x=0.82)
    art("reddit/silo-banner-mobile-2160x256", 2160, 256, horizon=0.6, sun_x=0.82)


def youtube_large():
    # YouTube Help now recommends 3840x2160 for videos and 2160x3840 for Shorts: the same frames, larger.
    for src, w, h in (("youtube/silo-thumbnail-frame-1280x720.svg", 3840, 2160),
                      ("youtube/silo-thumbnail-frame-1080x1920.svg", 2160, 3840)):
        png = f"youtube/silo-thumbnail-frame-{w}x{h}.png"
        subprocess.run(["rsvg-convert", "-w", str(w), "-h", str(h), "-o", os.path.join(OUT, png),
                        os.path.join(OUT, src)], check=True)
        made.append((png, w, h))


PLATFORMS = [generic_avatar, discord, x, reddit, youtube_large]


def main():
    masters()
    thumbnail_frames()
    for make in PLATFORMS:
        make()
    kit = os.path.dirname(os.path.abspath(__file__))
    readme = open(os.path.join(kit, "README.md"), encoding="utf-8").read()
    rows = "\n".join(f"| `{r}` | {'vector, ' if r.endswith('.svg') else ''}{w:g}×{h:g} |" for r, w, h in sorted(made))
    with open(os.path.join(OUT, "README.md"), "w", encoding="utf-8") as f:
        f.write(readme + "\n## Files\n\nEvery file in this folder, with its size in pixels "
                "(for an SVG, its drawing size; it scales to any size).\n\n| File | Size |\n|---|---|\n" + rows + "\n")
    with open(os.path.join(kit, "copy.md"), encoding="utf-8") as src, \
            open(os.path.join(OUT, "copy.md"), "w", encoding="utf-8") as dst:
        dst.write(src.read())
    for r, w, h in made:
        print(f"{r}  {w:g}x{h:g}")


main()
