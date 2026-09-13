# Navigation QA — 2026-09-09

final result: passed

## Scope and source

Navigation-only adaptation of the supplied screenshots, preserving the GitHub page content. Blue is intentionally replaced with grayscale and opaque surfaces with frosted glass, as requested.

- Desktop source: `/Users/wenzhiwang/Desktop/Screenshot 2026-09-09 at 22.54.53.png` (1754 × 322 crop).
- Mobile source: `/Users/wenzhiwang/Desktop/Screenshot 2026-09-09 at 22.55.40.png` (654 × 118 crop).
- Implementation: `http://localhost:4175/`.
- Screenshots: `.qa/glass-desktop.png`, `.qa/glass-dark.png` (1280 × 720); `.qa/glass-mobile.png` (390 × 844).
- Browser screenshots use CSS-pixel dimensions. Reference crops have no viewport metadata; comparison is component-relative, not a claim of pixel-exact full-page cloning. Source pill height 135 px versus implementation 66 px; mobile source pill approximately 80 px versus implementation 46 px.

## Comparison

Both supplied references and corresponding browser captures were displayed together in the same comparison inputs. The navigation is legible at full capture size, so no additional focused crop was needed. Desktop selected state and mobile closed Menu state were compared. The reference has six Dutch destinations; the site retains five existing English destinations and original brand.

- Typography: regular sans-serif weight, no bold active text or underline; 17–21 px desktop and 18 px mobile. Existing Inter/system stack retained rather than adding a new font dependency.
- Layout: long outer capsule, fully rounded inner selected pill, inset padding, centered desktop track, separate mobile Menu capsule. Existing responsive brand and theme controls retained.
- Colors: grayscale foreground, transparent white/charcoal glass, gray selection. Computed backdrop filter verified as `blur(24px) saturate(0)`.
- Assets: references contain native navigation text and surfaces, no raster assets to generate. Existing logo retained without distortion; no new artwork.
- Content: Home, Videos, Blog, Works, Contact and Resources retained. Mobile Menu changes to Close when expanded.

## Findings and history

No actionable P0/P1/P2 visual findings in the rendered comparison. The color, destination count and scale differences are intentional adaptations. Invalid font shorthand was cleaned up without changing the already explicit mobile font rules.

## Checks

- Mobile Menu opens; choosing Blog closes it and restores Menu text.
- Active Blog state updates; embedded page's duplicate navigation remains hidden.
- Light/dark theme toggle works; both navigation states captured.
- Mobile page has no horizontal overflow.
- Captured browser error log is empty.
- JavaScript syntax and git whitespace checks pass.

## Follow-up polish

Reference screenshots do not specify hover, keyboard focus, open menu, or dark states; these use the site's existing interaction model with grayscale focus and hover treatment. No deployment performed.

## Release regression — 2026-09-13

- Checked all 11 HTML pages: local asset links and inline JavaScript syntax pass; all 6 shared scripts parse using Node 22+ (`node scripts/check-site.mjs`).
- At 390 × 844, every page has one shared top navigation and one Resources footer, with no document-level horizontal overflow.
- Verified mobile Menu → Blog → ShellCrash article → Blog, and brand → Home without replacing the outer navigation.
- Verified desktop 1280 × 800 light/dark switching and the dedicated smooth dark-mode logo asset. Browser error log was empty during these checks.
- Added malformed navigation-message/hash handling, stable relative asset URLs, accessible menu state, and removed the missing Sony article destination from fallback markup.
- QA output and local dependency directories are ignored by Git. No abandoned redesign worktree is included.
- These are scoped regression checks, not a guarantee against every browser/device or third-party video outage. GitHub deployment status is separate from source verification.
