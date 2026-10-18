"""How src/assets/portrait.jpg was graded (variant A-natural, owner's pick 2026-10-18). Not part of the
site build; kept so the edit is reproducible. Input: the clean 1200x1500 crop described in
components/Portrait.astro. Needs Pillow and numpy.

Conservative global regrade of the dhellmer.com portrait: tone and colour only, no local or
generative edits. Writes variants and a side-by-side comparison sheet.
Usage: python -I grade.py <in.jpg> <out-dir>
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
img = Image.open(src).convert("RGB")
a = np.asarray(img).astype(np.float64) / 255.0
flat = a.reshape(-1, 3)


def levels(x, black, white):
    """Per-channel levels: map black->0, white->1."""
    return np.clip((x - black) / (white - black), 0, 1)


def scurve(x, s):
    """Gentle S-curve blended toward smoothstep by s (0 = none)."""
    return (1 - s) * x + s * (x * x * (3 - 2 * x))


def balance_mid(x, target):
    """Per-channel gamma so the luminance-median pixels land on the target neutral."""
    L = x.mean(2)
    m = (L > np.percentile(L, 40)) & (L < np.percentile(L, 60))
    med = x[m].mean(0)
    g = np.log(np.clip(target, 1e-3, 1)) / np.log(np.clip(med, 1e-3, 1))
    return np.clip(x, 0, 1) ** g


def saturation(x, k):
    L = (x * [0.2126, 0.7152, 0.0722]).sum(2, keepdims=True)
    return np.clip(L + (x - L) * k, 0, 1)


def soft_highlights(x, knee=0.9, ceil=0.985):
    """Roll highlights off above the knee so clipped warm areas regain a little shape."""
    y = x.copy()
    hi = x > knee
    t = (x[hi] - knee) / (1 - knee)
    y[hi] = knee + (ceil - knee) * (1 - (1 - t) ** 2)
    return y


black = np.percentile(flat, 0.5, axis=0) * 0.9   # remove most of the matte lift and its teal cast
white = np.percentile(flat, 99.7, axis=0)

base = levels(a, black, white)
base = soft_highlights(base)

variants = {
    "A-natural": saturation(scurve(balance_mid(base, np.array([0.445, 0.430, 0.410])), 0.18), 1.02),
    "B-warm": saturation(scurve(balance_mid(base, np.array([0.470, 0.440, 0.400])), 0.12), 0.95),
}

for name, v in variants.items():
    Image.fromarray((v * 255 + 0.5).astype(np.uint8)).save(f"{out}/portrait-{name}.jpg", "JPEG", quality=90)

# Comparison sheet: original, A, B at display-ish size with labels.
w, h = 440, 550
panels = [("Original (current site)", img)] + [
    (f"{n.split('-')[0]}: {n.split('-')[1]}", Image.open(f"{out}/portrait-{n}.jpg")) for n in variants
]
sheet = Image.new("RGB", (len(panels) * (w + 20) + 20, h + 70), (241, 237, 226))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 20)
except OSError:
    font = ImageFont.load_default()
for i, (label, im) in enumerate(panels):
    x = 20 + i * (w + 20)
    sheet.paste(im.resize((w, h), Image.LANCZOS), (x, 20))
    d.text((x, h + 32), label, fill=(20, 32, 43), font=font)
sheet.save(f"{out}/portrait-compare.jpg", "JPEG", quality=88)

for name, v in variants.items():
    f = (v * 255)[230:420, 470:620].reshape(-1, 3).mean(0).round(0)
    s = (v * 255)[(v.mean(2) < np.percentile(v.mean(2), 10))].mean(0).round(0)
    print(name, "face", f, "shadows", s, "p0.5", np.percentile((v * 255).reshape(-1, 3), 0.5, axis=0).round(0))
