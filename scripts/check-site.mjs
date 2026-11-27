import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script, runInNewContext } from 'node:vm';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
let pages = 0, scripts = 0;
const maxAssetBytes = 450 * 1024;
const checkedImages = new Set();

function checkSeoAndPerf(p, rawHtml) {
  const isStub = /meta\s+http-equiv=["']refresh["']/i.test(rawHtml) || p.endsWith('404.html') || p.endsWith('design-system.html') || p.includes(`${resolve(root, 'articles', 'ipv6-nat64')}`);
  if (!isStub) {
    if (!/<title>[^<]+<\/title>/i.test(rawHtml)) errors.push(`${p}: missing <title>`);
    if (!/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(rawHtml)) errors.push(`${p}: missing meta description`);
    if (!/<link\s+rel=["']canonical["']\s+href=["']https:\/\/wwz\.im\//i.test(rawHtml)) errors.push(`${p}: missing canonical URL`);
    if (!/<meta\s+property=["']og:title["']/i.test(rawHtml)) errors.push(`${p}: missing og:title`);
    if (!/<meta\s+property=["']og:description["']/i.test(rawHtml)) errors.push(`${p}: missing og:description`);
  }
  if (/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome/i.test(rawHtml)) {
    errors.push(`${p}: contains legacy render-blocking Font Awesome CDN link`);
  }
  const ogImgMatch = rawHtml.match(/<meta\s+property=["']og:image["']\s+content=["'](https:\/\/wwz\.im\/([^"']+))["']/i);
  if (ogImgMatch) {
    const localOgPath = resolve(root, ogImgMatch[2]);
    if (!existsSync(localOgPath)) errors.push(`${p}: missing og:image local target ${ogImgMatch[2]}`);
  }
}

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = resolve(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!/\.(html|js)$/.test(p)) continue;
    const s = readFileSync(p, 'utf8');
    if (p.endsWith('.js')) {
      const result = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: s, encoding: 'utf8' });
      if (result.status !== 0) errors.push(p + ': ' + result.stderr); else scripts++;
      continue;
    }
    pages++;
    checkSeoAndPerf(p, s);

    const html = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    if (p === resolve(root, 'index.html')) {
      const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
      for (const id of new Set(ids)) {
        if (ids.filter(value => value === id).length > 1) errors.push(p + ': duplicate id="' + id + '"');
      }
      const schemaBlocks = [...s.matchAll(/<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)];
      const schemas = [];
      for (const match of schemaBlocks) {
        try { schemas.push(JSON.stringify(JSON.parse(match[1]))); }
        catch (error) { errors.push(p + ': invalid JSON-LD: ' + error.message); }
      }
      if (new Set(schemas).size !== schemas.length) errors.push(p + ': duplicate JSON-LD structured data block');
    }
    for (const m of s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/type=["'](?:module|application\/ld\+json)/.test(m[1])) continue;
      try { new Script(m[2]); } catch (e) { errors.push(p + ': ' + e.message); }
    }
    for (const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
      const v = m[1];
      if (/^(?:[a-z]+:|\/\/|#)/i.test(v) || v.includes('${')) continue;
      const cleanPath = decodeURIComponent(v.split(/[?#]/)[0]);
      const target = cleanPath.startsWith('/') ? resolve(root, '.' + cleanPath) : resolve(dirname(p), cleanPath);
      if (!existsSync(target)) {
        errors.push(p + ': missing ' + v);
      } else if (/\.(png|jpe?g|webp|gif|svg)$/i.test(target) && !checkedImages.has(target)) {
        checkedImages.add(target);
        const sz = statSync(target).size;
        if (sz > maxAssetBytes) errors.push(`${target}: image exceeds ${(maxAssetBytes / 1024)}KB budget (${(sz / 1024).toFixed(1)}KB)`);
      }
    }
    if (/user-scalable=no/.test(s)) errors.push(p + ': zoom disabled');
  }
}
walk(root);

// Check dynamic content paths & asset budget
const context = { window: {} };
runInNewContext(readFileSync(resolve(root, 'data/site-content.js'), 'utf8'), context);
const content = context.window.WWZ_CONTENT;
const works = JSON.parse(readFileSync(resolve(root, 'data/works.json'), 'utf8'));
for (const item of [...content.videos, ...content.posts, ...works]) {
  for (const key of ['image', 'href']) {
    const value = item[key];
    if (!value || /^[a-z]+:/i.test(value)) continue;
    const relVal = value.startsWith('/') ? '.' + value : value;
    const abs = resolve(root, relVal);
    if (!existsSync(abs)) {
      errors.push('Content: missing ' + value);
    } else if (key === 'image' && !checkedImages.has(abs)) {
      checkedImages.add(abs);
      const sz = statSync(abs).size;
      if (sz > maxAssetBytes) errors.push(`${abs}: content image exceeds ${(maxAssetBytes / 1024)}KB budget (${(sz / 1024).toFixed(1)}KB)`);
    }
  }
}

// Check legacy redirects parity
const redirects = JSON.parse(readFileSync(resolve(root, 'data/legacy-routes.json'), 'utf8'));
const redirectsFile = readFileSync(resolve(root, '_redirects'), 'utf8');
const notFoundHtml = readFileSync(resolve(root, '404.html'), 'utf8');
const sitesWorker = readFileSync(resolve(root, 'sites-worker.js'), 'utf8');
for (const [from, to] of Object.entries(redirects)) {
  const target = resolve(root, to);
  if (!existsSync(target)) errors.push('Broken legacy route target: ' + to);
  const routeKey = from.replace(/\/index\.html$/, '');
  if (!redirectsFile.includes(routeKey)) errors.push('Missing in _redirects: ' + from);
  if (!notFoundHtml.includes(from) && !notFoundHtml.includes(routeKey)) errors.push('Missing in 404.html: ' + from);
  if (!sitesWorker.includes(from) && !sitesWorker.includes(routeKey)) errors.push('Missing in sites-worker.js: ' + from);
}

// Check CSS bundle has no @import waterfall
const siteSystemCss = readFileSync(resolve(root, 'css/site-system.css'), 'utf8');
if (/@import\s+url\(/i.test(siteSystemCss)) {
  errors.push('css/site-system.css: contains @import waterfall; run npm run sync');
}

// Check sitemap.xml & rss.xml completeness
for (const feedFile of ['sitemap.xml', 'rss.xml']) {
  const feedPath = resolve(root, feedFile);
  if (!existsSync(feedPath)) {
    errors.push(`Missing ${feedFile}`);
    continue;
  }
  const xml = readFileSync(feedPath, 'utf8');
  for (const post of content.posts) {
    const url = `https://wwz.im/${post.href.replace(/^\//, '')}`;
    if (!xml.includes(url)) errors.push(`${feedFile}: missing post URL ${url}`);
  }
}

// Case-sensitivity check for Linux hosting
function exactPath(path) {
  let current = root;
  const clean = path.replace(/^\.+[\/\\]+/, '');
  for (const part of clean.split('/').filter(Boolean)) {
    if (!readdirSync(current).includes(part)) return false;
    current = resolve(current, part);
  }
  return true;
}
for (const item of [...content.videos, ...content.posts, ...works]) {
  for (const key of ['image', 'href']) {
    const value = item[key];
    const relVal = value && value.startsWith('/') ? '.' + value : value;
    if (relVal && !/^[a-z]+:/i.test(relVal) && existsSync(resolve(root, relVal)) && !exactPath(relVal)) errors.push('Case mismatch: ' + value);
  }
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Passed: ${pages} pages, ${scripts} scripts, ${checkedImages.size} images checked, SEO/feeds & local asset links OK.`);
