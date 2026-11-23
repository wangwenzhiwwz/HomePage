# File Layout and Structure

Use lowercase English names with hyphens for new files and folders. Avoid spaces, timestamps as content names, and presentation-specific page names.

```text
index.html                  Home (commercial video, featured works, notes, tools)
about.html                  About Wang Wenzhi
works.html                  Curated creative works gallery & image viewer
blog.html                   Technical notes and guides listing
now.html                    Living snapshot of current focus
design-system.html          Design system tokens and components showcase
404.html                    Custom 404 page & client-side fallback router
_redirects                  Cloudflare Pages / Netlify 301 redirects
sites-worker.js             Cloudflare Workers edge router & 301 handler
articles/                   Technical article details, one folder per article
  3x-ui/
  be6500-ssh/
  comfyui-local-video/
  docker-backup-guide/
  hysteria-2/
  ipv6-nat64-guide/
  linux-server-setup/
projects/                   Independent digital tools & product details
  app/
  ip/
  rmb/
  sub/
  vps/
topics/                     Curated thematic guides
  ai-comfyui/
videos/                     Commercial video campaign index
data/                       Structured data feeds (JSON)
  brand-links.json
  featured-feed.json
  legacy-routes.json
  now.json
  site-content.js
  videos.json
  works.json
css/                        Unified Apple/Mobbin CSS architecture
  apple-design-system.css
  apple-pages.css
  projects-redesign.css
  site-system.css
js/                         Core site scripts
  article-nav.js
  site-shell.js
  site-theme.js
  works.js
images/                     Active media assets
  blog/
  videos/
  works/
scripts/                    Validation and developer tooling
  tools/                    Developer utilities (e.g., ZCOOL portfolio exporter)
  check-site.mjs
  check-theme-startup.mjs
  mirror-works-images.mjs
docs/                       Maintenance, design QA, and architecture documentation
```

## Legacy Route Compatibility

All historical URLs from previous website iterations are retained with 100% backward compatibility:

- `/portfolio-masonry.html` → `/works.html`
- `/article.html` → `/blog.html`
- `/styles.html` → `/design-system.html`
- `/team.html` → `/about.html`
- `/article/<slug>/` → `/articles/<slug>/`
- `/projects/` → `/#tools`

Redirection is handled through a high-performance 3-layer architecture:
1. **Edge CDN Layer**: `_redirects` delivers instant HTTP 301 redirects on Cloudflare Pages and Netlify.
2. **Worker Layer**: `sites-worker.js` intercepts legacy paths on Cloudflare Workers and issues 301 responses.
3. **Static Fallback Layer**: `404.html` detects legacy routes and calls `window.location.replace()` instantaneously on GitHub Pages without requiring dummy HTML files on disk. If an unknown route is accessed, a polished Apple-style 404 screen is displayed.
