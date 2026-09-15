# Content maintenance

## Videos and posts

Edit `data/site-content.js`. Home, Videos and Blog render from the same registry.

A video needs `id`, `title`, `description`, `year`, `image` and `embed`. Store its cover in `images/videos/<video-id>.jpg`. The `featuredVideoId` controls the leading homepage video. Year filters are automatic.

Create articles in `articles/<lowercase-kebab-case-slug>/index.html`. Article-local cover files are named `cover.png`. Keep the article template's relative asset paths and shared scripts. Then add a post with `id`, `title`, `excerpt`, `date`, `readTime`, `category`, `tags`, `image` and `href` to the registry. Set `featured: true` on one article.

Example paths:
- `image: "articles/linux-server-setup/cover.png"`
- `href: "articles/linux-server-setup/"`

Do not change stable content IDs when only renaming files.

## Works

Edit `data/works.js`, not the gallery rendering code. Each entry has `title`, `category` (photo or video) and `image`. Photography assets live in `images/photography/`; lowercase camera filenames preserve the original shot identifiers. Campaign stills can reuse covers from `images/videos/`.

The gallery renderer and image viewer are in `js/works.js`; its unique layout is in `css/works.css`.

## Shared design and behavior

- `css/site-system.css`: shared colors, glass, radii, focus, code blocks, top navigation and responsive layout.
- `js/site-shell.js`: one shared top navigation, persistent page navigation and history.
- `js/site-theme.js`: system/light/dark preferences and pre-paint theme application.
- `js/content-renderer.js`: shared Home and Blog templates.
- `js/article-nav.js`: article switcher and related posts.
- `css/legacy-pages.css`, `js/legacy-interactions.js`: compatibility styles/controllers still used by supporting pages. Do not duplicate them into new pages.

Use the common monochrome filter component and theme tokens. Image and video overlays blur the background without an opaque black overlay.

## Before publishing

1. Run `node scripts/check-site.mjs` with Node.js 18+.
2. Check Home → Works → image preview and Home → Blog → article.
3. Check light/dark themes and mobile layout.
4. Commit and push to GitHub main, then verify GitHub Pages deployment.

When a page URL changes, keep a redirect at the old path and record it in `data/legacy-routes.json`. The current redirects preserve query strings and anchors when JavaScript is enabled.
