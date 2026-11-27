import { readFileSync, writeFileSync, statSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const baseUrl = 'https://wwz.im';

const context = { window: {} };
runInNewContext(readFileSync(resolve(root, 'data/site-content.js'), 'utf8'), context);
const content = context.window.WWZ_CONTENT;

const escXml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const parsePostDate = (post, htmlPath) => {
  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, 'utf8');
    const jsonMatch = html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"/);
    if (jsonMatch) return new Date(`${jsonMatch[1]}T08:00:00+08:00`);
  }
  const str = String(post.date || '').trim();
  const parsed = Date.parse(str);
  if (!Number.isNaN(parsed)) return new Date(parsed);
  if (/^\d{4}$/.test(str)) return new Date(`${str}-12-01T08:00:00+08:00`);
  return statSync(htmlPath).mtime;
};

const mimeByExt = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png'
};

// 1. Generate rss.xml from WWZ_CONTENT.posts
const rssItems = content.posts.map((post) => {
  const link = `${baseUrl}/${post.href.replace(/^\//, '')}`;
  const htmlPath = resolve(root, post.href, 'index.html');
  const pubDate = parsePostDate(post, htmlPath);
  const imgRel = post.image.replace(/^\//, '');
  const imgAbs = resolve(root, imgRel);
  const imgSize = existsSync(imgAbs) ? statSync(imgAbs).size : 0;
  const imgMime = mimeByExt[extname(imgRel).toLowerCase()] || 'image/jpeg';
  const tags = [post.category, ...(post.tags || [])].filter(Boolean);

  return `    <item>
      <title>${escXml(post.title)}</title>
      <link>${escXml(link)}</link>
      <guid isPermaLink="true">${escXml(link)}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>
${tags.map((tag) => `      <category>${escXml(tag)}</category>`).join('\n')}
      <description>${escXml(post.excerpt || post.enExcerpt || '')}</description>
${imgSize ? `      <enclosure url="${escXml(`${baseUrl}/${imgRel}`)}" length="${imgSize}" type="${imgMime}" />` : ''}
    </item>`;
}).join('\n');

const latestBuild = content.posts.reduce((max, post) => {
  const d = parsePostDate(post, resolve(root, post.href, 'index.html'));
  return d > max ? d : max;
}, new Date(0));

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WWZ.iM · Technical Notes &amp; Workflows</title>
    <link>${baseUrl}/blog.html</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical documentation across Linux servers, network protocols, and generative AI production workflows by Wang Wenzhi.</description>
    <language>zh-CN</language>
    <lastBuildDate>${latestBuild.toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`;

writeFileSync(resolve(root, 'rss.xml'), rssXml, 'utf8');

// 2. Generate sitemap.xml from canonical static routes + posts + tools
const urlEntries = [
  { loc: '/', file: 'index.html', priority: '1.0' },
  { loc: '/videos/', file: 'videos/index.html', priority: '0.9' },
  { loc: '/works.html', file: 'works.html', priority: '0.9' },
  { loc: '/blog.html', file: 'blog.html', priority: '0.9' },
  { loc: '/about.html', file: 'about.html', priority: '0.8' },
  { loc: '/now.html', file: 'now.html', priority: '0.7' },
  { loc: '/lab/', file: 'lab/index.html', priority: '0.8' },
  { loc: '/topics/ai-comfyui/', file: 'topics/ai-comfyui/index.html', priority: '0.8' }
];

for (const post of content.posts) {
  const rel = post.href.replace(/^\//, '').replace(/\/$/, '');
  urlEntries.push({
    loc: `/${rel}/`,
    file: `${rel}/index.html`,
    priority: post.pinned ? '0.9' : '0.8'
  });
}

const projectsDir = resolve(root, 'projects');
if (existsSync(projectsDir)) {
  for (const entry of readdirSync(projectsDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const htmlFile = `projects/${entry.name}/index.html`;
    if (existsSync(resolve(root, htmlFile))) {
      urlEntries.push({ loc: `/projects/${entry.name}/`, file: htmlFile, priority: '0.7' });
    }
  }
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.map(({ loc, file, priority }) => {
  const abs = resolve(root, file);
  const lastmod = statSync(abs).mtime.toISOString().slice(0, 10);
  return `  <url><loc>${escXml(baseUrl + loc)}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
}).join('\n')}
</urlset>
`;

writeFileSync(resolve(root, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`Synced rss.xml (${content.posts.length} posts) and sitemap.xml (${urlEntries.length} URLs).`);
