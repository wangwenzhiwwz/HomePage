# WWZ.iM

Personal portfolio, films, photography and technical notes. Static HTML, CSS and JavaScript, published from GitHub main through GitHub Pages.

## Local preview

Run from the repository root:

```sh
python3 -m http.server 4178 --bind 127.0.0.1
```

## Validation

Use Node.js 18 or newer:

```sh
node scripts/check-site.mjs
```

Checks page scripts, local references, content image paths, filename casing and legacy route targets.

## Main pages

- `index.html`: Home
- `videos/index.html`: Videos
- `works.html`: Works and image viewer
- `blog.html`: Blog listing
- `articles/<slug>/index.html`: Article details
- `about.html`, `team.html`: Supporting pages
- `design-system.html`: UI reference

## Maintenance

- [Content editing](docs/content-maintenance.md)
- [File layout and naming](docs/file-layout.md)
- [Historical design notes](docs/design-qa.md)

Old public page URLs remain as compatibility redirects. Do not delete them just because they look redundant.
