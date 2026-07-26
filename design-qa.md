# Design QA

- Source visual truth: `/Users/wenzhiwang/Documents/Codex/2026-07-26/wangwenzhiwwz-homepage-https-github-com-wangwenzhiwwz/outputs/wwz-homepage-logo-no-background-concept.png`
- Implementation: `http://localhost:4173/`
- Desktop implementation screenshot: `/Users/wenzhiwang/Documents/Codex/2026-07-26/wangwenzhiwwz-homepage-https-github-com-wangwenzhiwwz/work/implementation-hero-v2.png`
- Video section screenshot: `/Users/wenzhiwang/Documents/Codex/2026-07-26/wangwenzhiwwz-homepage-https-github-com-wangwenzhiwwz/work/implementation-films-v2.png`
- Blog section screenshot: `/Users/wenzhiwang/Documents/Codex/2026-07-26/wangwenzhiwwz-homepage-https-github-com-wangwenzhiwwz/work/implementation-notes-v2.png`
- Mobile screenshot: `/Users/wenzhiwang/Documents/Codex/2026-07-26/wangwenzhiwwz-homepage-https-github-com-wangwenzhiwwz/work/implementation-mobile-v2.png`
- Combined comparison: `/Users/wenzhiwang/Documents/Codex/2026-07-26/wangwenzhiwwz-homepage-https-github-com-wangwenzhiwwz/work/design-qa-comparison.png`
- Viewports: desktop `1440 × 1024` CSS px; mobile `390 × 844` CSS px
- Source pixels: `864 × 1821`
- Implementation pixels: desktop `1440 × 1024`; mobile `390 × 844`
- Density normalization: browser device scale factor 1; combined comparison uses contain scaling with top alignment.
- State: light theme for source comparison; dark theme and mobile responsive states also checked.

## Full-view comparison evidence

The combined comparison confirms the intended left rail, oversized three-line hero, logo-led 3D composition, three-part discipline row, dominant featured film, supporting-film strip, editorial Field Notes hierarchy, warm accent, and restrained card treatment. The implementation intentionally uses the original favicon pixels as a luminance-derived transparent asset rather than redrawing the mark.

## Focused region evidence

- Hero: the original logo's two diagonal rounded strokes and separate dot render without the black circular field. External glass planes, orbit, float, shine, and pointer parallax do not alter the logo geometry.
- Featured Motion Work: one dominant 16:9 film, contextual description, and three supporting works match the selected hierarchy.
- Field Notes: one lead story and two compact rows use dividers and typography instead of equal-weight cards.
- Mobile: hero copy, actions, animated logo, disciplines, navigation, and content stacking fit at `390 × 844`.

## Required fidelity surfaces

- Fonts and typography: system sans uses heavy display weights and compact tracking consistent with the visual target; hierarchy and wrapping remain readable at both checked viewports.
- Spacing and layout rhythm: sidebar, hero, discipline row, film hierarchy, and editorial list align to a consistent grid with clear section separation.
- Colors and visual tokens: off-white/near-black themes, muted copy, fine dividers, glass opacity, and restrained amber accents match the selected direction.
- Image quality and asset fidelity: all visible work/article imagery uses supplied repository assets. The hero mark is derived directly from `favicon.png`; no approximation, custom SVG, or replacement glyph is used.
- Copy and content: supplied real project, article, role, and contact copy is retained.

## Interaction checks

- Featured video modal opens with the expected YouTube URL and closes correctly.
- Theme switching updates the document theme and persisted preference.
- Mobile menu opens, reports `aria-expanded="true"`, and exposes the sidebar.
- Section navigation highlights and scroll targets are wired.
- Logo float/orbit animation, pointer parallax, and reduced-motion fallback are present.
- Browser console errors checked: none.

## Comparison history

1. P1: the first implementation used the favicon alpha channel as a mask, which exposed the entire circular field and made the white logo disappear against the light hero.
2. Fix: replaced the alpha mask with deterministic luminance extraction from the original favicon at runtime. Black pixels become transparent; original white/antialiased pixels retain their exact positions and proportions.
3. Post-fix evidence: `implementation-hero-v2.png` and `design-qa-comparison.png` show the two original diagonal strokes and separate dot without the black background.
4. P2: the initial motion pass moved too continuously, the floating objects read flatter than intended, and media/tool corner radii did not share one system.
5. Fix: extended the logo, orbit, glass, shine, and sphere cycles to `11–24s`; introduced held keyframe ranges for a breathing rhythm; reduced pointer tilt; added layered directional shadows and highlights; unified featured video, supporting video, article, and tool surfaces on a `20px` radius token.
6. Post-fix evidence: computed browser styles report `11s` logo, `24s` orbit, `15s` glass, and `20px` across the checked module surfaces; the desktop viewport remains free of horizontal overflow.
7. P2: the motion mark still dominated the composition, the rectangular shine was visible outside the logo silhouette, the orbit read as a flat line, animated layers could be clipped, and the main video radius was unreliable because its media wrapper remained inline.
8. Fix: reduced the desktop mark to a maximum `350px` (`250px` mobile), masked the narrower shine to the exact logo pixels, tilted and relit the orbit in 3D, moved the satellite to a shaded radial treatment, allowed the stage to overflow safely, and made every media wrapper a composited block with the shared `20px` radius.
9. Content/action fix: promoted RugOne Xever 7 to the featured position, moved Ulefone Armor 34 Pro into the supporting row, and converted both “View all films” and “Read all notes” into accented pill actions.
10. Post-fix evidence: browser inspection reports the featured title as `RugOne Xever 7`, a `20px` featured-media radius, visible stage overflow, a `28s` 3D orbit, and no desktop horizontal overflow.
11. Selected redesign target: the second generated concept, Layered Lens Chamber (`call_HmvhwFilIGJupGk3pYBtTCZR.png`).
12. Implementation: replaced the former card/satellite composition with three optical lens planes at independent Z depths. The vertical lenses counter-rotate on `24s` and `29s` breathing cycles; the amber-edged horizontal lens rotates over `32s`; the original transparent logo floats independently over `14s`.
13. Fidelity adjustment: desktop lens diameter was increased to `347px` and the exact-proportion logo to `231px`, matching the selected concept’s visual balance while retaining safe motion clearance.
14. Post-fix evidence: browser capture shows the three-lens composition, precise central mark, amber perimeter light point, grounded caustic-style shadow, and no horizontal overflow at the checked desktop viewport.
15. P2 refinement: the first lens implementation used angles that were too symmetrical and produced limited lighting variation during the breathing cycle.
16. Fix: each lens now uses a distinct compound X/Y/Z axis, offset position, depth, size, and counter-rotation. Conic refraction, stronger edge highlights, warm back-volume light, intersection shadows, and a responsive ground caustic create visible light changes without reintroducing a logo sweep.
17. Post-fix evidence: browser capture confirms asymmetric lens silhouettes, increased overlap depth, `24s / 29s / 34s` motion layers, and zero horizontal overflow.
18. User constraint: no lens may settle into a visibly vertical or horizontal angle.
19. Fix: removed the full-turn orbital rotation and constrained all three lenses to diagonal compound-axis ranges. Their Z angles now breathe within `34–42°`, `-37–-46°`, and `43–51°`, with simultaneous X/Y/depth changes.
20. Post-fix evidence: the checked animation state shows three diagonal ellipses and browser measurements confirm zero horizontal overflow.
21. Selected redesign target: the second gradient-glass concept (`call_yTLtIJuP13rRsVDlZbWxYFml.png`), grounded in the supplied blue glass material reference.
22. Asset implementation: extracted the selected glass WWZ mark as a dedicated transparent `840 × 920` PNG, preserving the blue/cyan/violet volume gradient, polished bevels, internal refraction, and multicolor caustic shadow.
23. Motion implementation: removed all lens markup and replaced it with a single glass-logo object on a `16s` held breathing loop with small diagonal X/Y rotation and Z-depth change. Ambient light and the secondary caustic breathe on the same cycle.
24. Post-fix evidence: browser capture confirms the glass asset loads at full intrinsic resolution, the animation duration is `16s`, and the desktop viewport has zero horizontal overflow.
25. Motion refinement: reduced the desktop rendered asset from roughly `347px` to `294px`, shifted its anchor to `54% / 55%` for better visual centering, and increased the loop to `18s`.
26. The expanded cycle now travels `21px` horizontally, `48px` vertically, and `86px` in Z-depth, with larger compound-axis rotation while retaining held breathing phases.
27. Post-fix evidence: browser inspection reports a `293.648px` desktop width, the new centered anchor, an `18s` cycle, and zero horizontal overflow.
28. Architecture pass: moved all video and post metadata into `data/content.js`; homepage video/notes, the complete Videos grid, and the Blog feature/grid now resolve from this registry.
29. Shared visual rules: `css/site-system.css` is loaded by the homepage, listing pages, portfolio/about/team/styles pages, and all current article detail pages, centralizing the `20px` radius, focus treatment, image behavior, timing curve, and reduced-motion fallback.
30. Post-fix evidence: browser checks report the same `RugOne Xever 7` lead item on Home and Videos, `18` Videos cards, the same `3` posts across Home and Blog, a working shared-data video modal, and no missing image source attributes.
31. Sidebar system: all checked top-level, listing, portfolio, and article-detail routes now mount the same `js/site-shell.js` template and use the same local `favicon.png`, active-page logic, mobile menu, and theme control.
32. Readability/load refinement: desktop sidebar width is standardized at `266px`; nav copy is `16px`; the brand title is `20.16px`. Replacing the remote sidebar avatar with the local favicon removes a cross-origin image request, and the homepage no longer ships duplicate sidebar markup.
33. Post-fix evidence: Home, Videos, Blog, Works, and a nested article route each render seven shared navigation links with the correct relative logo path and active state; all checked routes report zero positive horizontal overflow.
34. Cross-page continuity: the shared stylesheet assigns stable `wwz-sidebar` and `wwz-content` View Transition names. The sidebar snapshot does not animate or blend between same-origin documents; only the content region receives a short fade/vertical transition.
35. Base-style alignment: all connected pages now inherit one system font stack, page-background mapping, heading tracking, pill-button shape, `20px` surface radius, focus ring, and common motion curve.
36. Post-fix evidence: Home and Videos both report the same `wwz-sidebar`/`wwz-content` transition identities, seven navigation entries, shared font stack, correct active state, and no horizontal overflow.
37. Cleanup pass: removed five unreferenced legacy bundles (`style.css`, `css/vendor.css`, `js/main.js`, `js/plugins.js`, and `js/script.js`) plus four obsolete sidebar generators that were being replaced at runtime by `js/site-shell.js`.
38. Post-cleanup evidence: static JavaScript checks pass; Home still renders four featured films and three notes, Videos renders 18 cards, Blog renders the same three article links, and Home/Videos/Blog/Works/article detail routes retain the shared sidebar and correct active state.
39. Mobile system fix: the shared sidebar now enforces fixed positioning and border-box sizing below `760px`, preventing legacy page positioning rules from creating a 12px horizontal overflow. The checked `377px` viewport now renders a `353px` sidebar between the intended `12px` insets with zero overflow.
40. Sidebar consistency pass: Home, Videos, Blog, Works, Team, Styles, About, and a nested article now compute the same desktop sidebar geometry (`266px`, `24px` insets, `28px` radius, `28px 22px` padding), glass surface, border, shadow, foreground, and stacking level. Their mobile headers likewise share the same `18px` radius and surface tokens.
41. Persistent navigation: same-origin Menu links now switch content inside a route frame while the top-level sidebar DOM remains mounted. URL, current-page state, theme, embedded content links, and Back/Forward history stay synchronized; external resources retain normal navigation.
42. Post-fix evidence: Home → Videos → Blog uses one route frame and seven persistent top-level nav links; Back restores Videos without a document reload. At `390 × 844`, the menu opens, closes after selection, places content below the `74px` shell, and reports zero horizontal overflow.
43. Palette alignment: the shared system now overrides legacy page gradients and individual white/black/blue-gray bases with the homepage background pair (`#f7f7f5` light, `#0b0b0a` dark). Text, glass, border, pill, hover, and accent tokens are likewise shared; the accent is consistently `#ee7b2d`.
44. Shadow refinement: the sidebar uses a single restrained `0 8px 24px` shadow at `7%` opacity in light mode and `22%` in dark mode, replacing the previous wide floating shadow.
45. Post-fix evidence: Home, Videos, Blog, Works, Team, Styles, About, and a nested article all compute the same light background with no background image. Dark persistent navigation keeps both the shell and embedded Videos content at `#0b0b0a`, with zero horizontal overflow.
46. Mobile navigation polish: the menu now uses a 97% opaque shared surface, a blurred page scrim, viewport-bounded internal scrolling, document scroll lock, outside-click dismissal, and Escape-key dismissal. The checked `390 × 844` state has no content bleed or horizontal overflow.
47. Control cleanup: legacy page theme buttons are hidden in favor of the shared shell control, while redundant embedded Back links are suppressed. The Videos view now presents one theme control and begins directly with the page heading.
48. Media optimization: 17 referenced video PNG screenshots were converted to quality-82 JPEGs, reducing their combined size from roughly 24MB to 4.2MB. Home, Videos, and Works references now use the compressed assets; list images use lazy loading, asynchronous decoding, and explicit dimensions on the complete Videos page.
49. Hero rhythm: desktop minimum height was reduced from `690px` to `620px`, bringing Featured Motion Work further into the first viewport without changing the selected hero composition.
50. Post-fix evidence: Videos still renders 18 cards, the optimized visible thumbnails load, Works reports no broken images, duplicate theme controls are not visible, and both checked desktop routes report zero horizontal overflow.
51. Player overlay refinement: Home and Videos playback layers now use transparent `22px` background blur with no black page wash. The video iframe retains its black canvas, a restrained frame shadow, and a theme-aware glass close control.
52. Post-fix evidence: Home reports an open transparent modal with `blur(22px) saturate(.9)`; the Bootstrap Videos player reports a fully transparent backdrop, one blur layer, no modal-level blur stacking, and a black iframe canvas.
53. Collection UX: Videos now builds accessible year filters directly from shared content metadata. The checked controls are All, 2025, 2024, 2023, and 2021; selecting 2025 sets `aria-pressed="true"` and shows the expected three works.
54. Blog metadata: the shared post registry now includes reading time, rendered consistently in Home notes, the featured Blog article, and Blog cards.
55. Legacy cleanup: the Videos page no longer ships its hidden desktop-theme control or duplicate theme/mobile-menu event logic; the persistent shell remains the only controller.
56. Work-image optimization: the 11 source photos in `images/work` were resized to a maximum 2200px edge and recompressed at JPEG quality 84, reducing the folder from roughly 20MB to 10MB while retaining portfolio display resolution.
57. Post-fix evidence: Blog exposes all three reading times, Works renders nine images with zero broken sources, Videos has no legacy theme element, and all checked views report zero horizontal overflow and no console errors.
58. External Blog addition: added “安装ShellCrash科学上网” with its 2025-11-12 source date, one-minute reading time, Network category, Router/SSH tags, concise BE6500 summary, and canonical external URL.
59. Blog discovery: category buttons now derive from shared non-featured post data, expose `aria-pressed`, and filter cards without a page reload. External article links open in a new tab with `noopener noreferrer`.
60. Post-fix evidence: Home retains the featured server guide first and includes the new ShellCrash article second; Blog shows the new article first in the grid. Network filtering returns the ShellCrash and Hysteria 2 posts while hiding Server, with zero horizontal overflow.
61. ShellCrash cover: replaced the placeholder favicon with the supplied local `1366 × 768` ShellCrash artwork, shared by Home and Blog from the central content registry.
62. Navigation behavior: ShellCrash links to `article/BE6500-SSH/`, a first-party detail page that reuses the shared sidebar, palette, cover artwork, code blocks, and responsive article layout; Home and Blog no longer send visitors to `blog.wwz.im`.
63. Article system: all four local Blog detail pages load one shared article discovery controller, with a fixed quick-switch selector and three related-article cards generated from `data/content.js`.
64. Style alignment: article hero surfaces, headline scale, reading width, switcher glass treatment, related-card radius, hover, and mobile stacking now resolve from `css/site-system.css`.
65. Switcher placement: moved the Blog selector from the fixed top-right layer into each article's content flow above the hero, eliminating overlap with headings, reading content, and legacy/shared theme controls.
66. Code language: every local article now shares the same `16px` code surface, header markers, monospace scale, inline-code pills, copy control, feedback treatment, and mobile code sizing from the central stylesheet.
67. Code palette refinement: replaced the near-black terminal treatment with a theme-aware minimal palette—soft blue-gray in light mode and restrained graphite in dark mode—plus neutral header dots, lower-contrast controls, and a lighter shadow.

## Follow-up polish

- P3: the implementation headline is slightly larger than the generated mock at the desktop comparison scale; this improves first-screen impact without changing the information hierarchy.
- P3: the orbit continuously changes angle, so still captures will not always match the mock's exact keyframe.

final result: passed
