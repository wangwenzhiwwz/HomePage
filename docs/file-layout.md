# File layout and naming

Use lowercase English names with hyphens for new files and folders. Avoid spaces, timestamps as content names, and presentation-specific page names.

```text
index.html                  Home
works.html                  Works gallery
blog.html                   Blog listing
videos/index.html           Videos
articles/                   Article details, one folder per article
  be6500-ssh/
  linux-server-setup/
  3x-ui/
  hysteria-2/
data/
  site-content.js           Videos and posts
  works.js                  Works metadata
  legacy-routes.json        Old-to-new public page routes
css/
  site-system.css           Shared visual foundation
  works.css                 Works-only layout
  legacy-pages.css          Existing supporting page styles
js/
  site-shell.js             Shared top navigation and page routing
  site-theme.js             Theme preference
  content-renderer.js        Home/Blog rendering
  article-nav.js            Article navigation
  works.js                  Gallery interactions
  legacy-interactions.js    Supporting-page controllers
images/
  videos/                   Named by video ID
  photography/              Lowercase original shot IDs
  blog/                     Shared blog covers
scripts/                    Validation and asset tooling
docs/                       Maintenance and design documentation
```

## Compatibility

- `portfolio-masonry.html` → `works.html`
- `article.html` → `blog.html`
- `styles.html` → `design-system.html`
- Old `article/<name>/` pages → normalized `articles/<slug>/` pages

These small HTML files are intentional redirects, not duplicate content.

The root verification text file, favicon names and `sites-worker.js` are preserved because external services may depend on them. Existing legacy image assets are retained; this reorganization does not delete potentially useful originals or redesign supporting pages. QA artifacts and the one-time migration script stay under ignored `.qa/` and are not published.
