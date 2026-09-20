import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let pages = 0;
function check(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) { check(path); continue; }
    if (!path.endsWith('.html')) continue;
    const html = readFileSync(path, 'utf8');
    if (!html.includes('js/site-theme.js')) continue;
    const bootstrap = html.match(/<script data-theme-bootstrap>([\s\S]*?)<\/script>/);
    assert.ok(bootstrap, `${path}: missing inline theme`);
    assert.ok(bootstrap.index < html.search(/<script\s+src=|<link[^>]+rel="stylesheet"/), `${path}: theme must precede network dependencies`);
    assert.equal((html.match(/<meta name="theme-color"/g) || []).length, 1);
    for (const mode of ['dark', 'light', 'system', null, 'invalid', 'blocked']) {
      for (const systemDark of [true, false]) {
        const element = { dataset: {}, style: { setProperty(key, value) { this[key] = value; } } };
        const metas = {};
        runInNewContext(bootstrap[1], {
          document: { documentElement: element, querySelector: key => ({ setAttribute: (_, value) => { metas[key] = value; } }) },
          localStorage: { getItem() { if (mode === 'blocked') throw new Error('Denied'); return mode; } },
          matchMedia: () => ({ matches: systemDark })
        });
        const expected = ['light', 'dark'].includes(mode) ? mode : systemDark ? 'dark' : 'light';
        assert.equal(element.dataset.theme, expected, path);
        assert.equal(element.style.colorScheme, expected, path);
        assert.equal(element.style.backgroundColor, expected === 'dark' ? '#0b0b0a' : '#f7f7f5', path);
        assert.equal(element.style['--wwz-initial-bg'], element.style.backgroundColor, path);
        assert.equal(metas['meta[name="theme-color"]'], element.style.backgroundColor, path);
      }
    }
    pages++;
  }
}
check(root);
assert.ok(pages > 0);
console.log(`Passed: ${pages} pages, ${pages * 12} pre-network theme scenarios.`);
