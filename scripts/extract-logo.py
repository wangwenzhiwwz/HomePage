"""Extract the existing glass mark without redrawing or changing its proportions.

Requires Pillow and NumPy. Run from any directory; originals stay untouched.
"""
from pathlib import Path
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
source = Image.open(ROOT / 'images/hero-glass-logo-dark.png').convert('RGB')
rgb = np.asarray(source).copy()
# Original backdrop is near-black; all three glass silhouettes are luminous.
mask = rgb.max(axis=2) > 48
h, w = mask.shape
seen = np.zeros_like(mask)
components = []
for y, x in zip(*np.where(mask)):
    if seen[y, x]:
        continue
    queue = deque([(y, x)])
    seen[y, x] = True
    points = []
    while queue:
        py, px = queue.popleft()
        points.append((py, px))
        for ny, nx in ((py-1, px), (py+1, px), (py, px-1), (py, px+1)):
            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                queue.append((ny, nx))
    components.append(points)
components.sort(key=len, reverse=True)
assert len(components) >= 3, 'Expected three separate logo pieces'
clean = np.zeros_like(mask)
for points in components[:3]:
    ys, xs = zip(*points)
    clean[ys, xs] = True
# Close tiny pinholes, then soften only the contour by less than one pixel.
matte = Image.fromarray(clean.astype('uint8') * 255)
matte = matte.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
alpha = np.asarray(matte.filter(ImageFilter.GaussianBlur(.65))).copy()
alpha[alpha < 3] = 0
alpha[alpha > 252] = 255
# Extend clean foreground color underneath the antialias band, avoiding a black halo.
color = rgb.astype('float32')
known = np.asarray(matte.filter(ImageFilter.MinFilter(3))) == 255
for _ in range(5):
    sums = np.zeros_like(color)
    counts = np.zeros((h, w), dtype='float32')
    for dy, dx in ((-1,0),(1,0),(0,-1),(0,1)):
        valid = np.roll(known, (dy, dx), (0, 1))
        sums += np.roll(color, (dy, dx), (0, 1)) * valid[..., None]
        counts += valid
    band = (~known) & (counts > 0) & (alpha > 0)
    color[band] = sums[band] / counts[band, None]
    known |= band
rgba = np.dstack((np.clip(color, 0, 255).astype('uint8'), alpha))
rgba[alpha == 0, :3] = 0
result = Image.fromarray(rgba)
target = ROOT / 'images/hero-glass-logo-transparent.png'
result.save(target, optimize=True)
qa = ROOT / '.qa'
qa.mkdir(exist_ok=True)
for name, background in [('white', '#ffffff'), ('black', '#0b0b0a')]:
    canvas = Image.new('RGBA', result.size, background)
    canvas.alpha_composite(result)
    canvas.convert('RGB').save(qa / f'logo-{name}.png')
assert result.mode == 'RGBA' and alpha[0, 0] == 0
print(f'{target}: {w}x{h}, RGBA; {int((alpha == 0).sum())} fully transparent pixels; 3 preserved components')
