# Content maintenance

The site now uses one content registry:

- `data/content.js`

## Add a video

Add one object to `WWZ_CONTENT.videos`. Required fields:

```js
{
  id: "unique-id",
  title: "Video title",
  description: "Short project type",
  year: "2026",
  image: "images/video/thumbnail.png",
  embed: "https://www.youtube.com/embed/VIDEO_ID"
}
```

Set `featuredVideoId` to the new `id` when it should lead the homepage. The
homepage supporting row and the complete Videos page update automatically.
Use an optimized `.jpg`, `.webp`, or `.avif` thumbnail close to the displayed
16:9 size; avoid adding multi-megabyte PNG screenshots.
The complete Videos page builds its year filters from the `year` values, so a
new year appears automatically.

## Add a post

Create the article folder, then add one object to `WWZ_CONTENT.posts`:

```js
{
  id: "unique-id",
  title: "Article title",
  excerpt: "Short description",
  date: "Jul 2026",
  readTime: "6 min",
  category: "Network",
  tags: ["Network"],
  image: "article/example/image.png",
  href: "article/example/"
}
```

Set `featured: true` on one post to feature it. The homepage Field Notes and
the Blog listing update automatically.
Always include `readTime`; it is shown on Home and Blog automatically.
External post URLs are supported and open in a new tab with safe link
attributes. Blog category filters are generated from non-featured posts.
Use a local article folder in `href` when the post should open inside this
website. Omit `href` only when a post should be a static card without navigation.

## Shared design

- `css/site-system.css` contains the cross-page radius, focus, image, and
  reduced-motion rules.
- `js/site-shell.js` contains the single shared sidebar template, active-page
  logic, mobile menu, and sidebar theme control.
- Cross-document View Transitions in `css/site-system.css` keep the sidebar
  visually fixed while the main content changes between local pages.
- `js/content-renderer.js` contains shared homepage/Blog rendering templates.
- Page-specific layout may stay in each page, but new shared UI rules should
  be added to `css/site-system.css` instead of copied between pages.

## File ownership

- `js/site-shell.js` is the only sidebar renderer. Do not add page-local
  sidebar templates. It also owns persistent same-origin Menu navigation,
  active-route state, history, and theme synchronization.
- `data/content.js` is the only video and article metadata source.
- `js/content-renderer.js` owns reusable homepage and Blog content markup.
- `js/article-nav.js` owns the shared article switcher and related-post cards
  shown on every local Blog detail page.
- Article code blocks, inline code, copy buttons, and copy feedback are styled
  once under the shared article rules in `css/site-system.css`.
- `js/shared.js` is limited to shared interaction controllers used by legacy
  pages; it no longer contains layout templates.
- Keep page-specific CSS only for structures unique to that page. Reusable
  colors, radii, typography, navigation, focus, and motion belong in
  `css/site-system.css`.
- Sidebar dimensions, glass surface, borders, shadow, stacking, and mobile
  behavior are intentionally enforced by `css/site-system.css`; page-level
  styles must not override them.
- The shared shell is the only theme control. Do not add page-level desktop
  or mobile theme buttons.
- Video playback overlays use a transparent `22px` backdrop blur from the
  shared system. Do not reintroduce an opaque black page overlay; black is
  reserved for the video frame itself.
- The shared light/dark background, text, glass, accent, pill, hover, and
  sidebar-shadow tokens also live in `css/site-system.css`. New pages should
  consume these tokens instead of introducing a separate page palette.
