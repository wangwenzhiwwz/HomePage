(() => {
'use strict';
const $ = id => document.getElementById(id);
const grid = $('portfolioGrid');
const count = $('worksCount');
const search = $('worksSearch');
const sort = $('worksSort');

if (!grid || !count || !search || !sort) {
  console.error('[WWZ Works] Required DOM node missing');
  return;
}

let items = [];
let visible = [];
let category = 'all';

const imagePath = value => {
  const path = String(value || '').trim();
  if (!/^\/images\/works\/[^/]+\.jpg$/i.test(path)) {
    throw Error('Invalid local JPG path: ' + path);
  }
  if (/[()]/.test(path)) {
    return path.replace(/\(/g, '%28').replace(/\)/g, '%29') + '?v=20261112';
  }
  return path;
};

const diagnose = async (url, error) => {
  let info = { status: 'unknown', contentType: 'unknown' };
  try {
    const r = await fetch(url, { cache: 'no-store' });
    info = { status: r.status, contentType: r.headers.get('content-type') || 'unknown' };
    if (r.body) await r.body.cancel();
  } catch (e) {
    info.error = e.message;
  }
  console.error('[WWZ Works] Image failed', { url, ...info, error: error?.message || 'Image decode/load error' });
};

const CATEGORY_LABELS = {
  '摄影': 'Photography',
  '三维': '3D CGI',
  '插画': 'Illustration'
};

const formatCategory = (val) => CATEGORY_LABELS[val] || val || '';

const failed = (img, url, error) => {
  img.dataset.imageState = 'error';
  img.classList.add('image-unavailable');
  img.removeAttribute('src');
  const media = img.closest('.portfolio-media');
  if (media) {
    media.classList.add('image-unavailable');
    if (!media.querySelector('.image-fallback')) {
      const hint = document.createElement('span');
      hint.className = 'image-fallback';
      hint.textContent = 'Image unavailable';
      media.append(hint);
    }
  }
  diagnose(url, error);
};

const bindImage = (img, url) => {
  img.dataset.imageState = 'loading';
  img.addEventListener('load', () => {
    img.dataset.imageState = 'loaded';
    img.classList.remove('image-unavailable');
  }, { once: true });
  img.addEventListener('error', e => failed(img, url, e), { once: true });
  img.src = url;
};

const makeCard = (w, pos) => {
  const item = document.createElement('article');
  item.className = 'portfolio-item';
  item.dataset.category = w.category || '';

  const link = document.createElement('a');
  link.className = 'portfolio-card';
  link.href = w.url || '#';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', 'View work: ' + (w.title || 'Untitled work') + ' (opens in new tab)');

  const media = document.createElement('span');
  media.className = 'portfolio-media';

  const img = document.createElement('img');
  img.className = 'portfolio-img';
  img.alt = w.title || '';
  img.width = 800;
  img.height = 600;
  img.loading = pos < 6 ? 'eager' : 'lazy';
  img.decoding = 'async';
  if (pos < 6) img.fetchPriority = 'high';

  if (w.image) {
    bindImage(img, imagePath(w.image));
    media.append(img);
  } else {
    media.classList.add('image-unavailable');
    const hint = document.createElement('span');
    hint.className = 'image-fallback';
    hint.textContent = 'No preview';
    media.append(hint);
  }

  const info = document.createElement('span');
  info.className = 'portfolio-info';

  const copy = document.createElement('span');
  const title = document.createElement('strong');
  const meta = document.createElement('small');
  const arrow = document.createElement('span');

  title.textContent = w.title || '';
  meta.textContent = [formatCategory(w.category), formatCategory(w.subcategory)].filter(Boolean).join(' · ');
  arrow.className = 'portfolio-open';
  arrow.textContent = '↗';
  arrow.setAttribute('aria-hidden', 'true');

  copy.append(title, meta);
  info.append(copy, arrow);
  link.append(media, info);
  item.append(link);
  return item;
};

const render = () => {
  const q = search.value.trim().toLowerCase();
  visible = items.filter(w =>
    (category === 'all' || w.category === category) &&
    (!q || [w.title, w.category, formatCategory(w.category), w.subcategory, formatCategory(w.subcategory)].join(' ').toLowerCase().includes(q))
  );

  if (sort.value === 'oldest') visible.reverse();

  const fragment = document.createDocumentFragment();
  visible.forEach((w, i) => fragment.append(makeCard(w, i)));
  grid.replaceChildren(fragment);

  count.textContent = visible.length + (visible.length === 1 ? ' work' : ' works') + (q ? ' · Search results' : '');
  if (!visible.length) {
    const empty = document.createElement('p');
    empty.className = 'works-empty';
    empty.textContent = 'No matching works found. Try another keyword.';
    grid.append(empty);
  }
};

document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    category = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(x => {
      x.setAttribute('aria-pressed', String(x === btn));
    });
    render();
  });
});

search.addEventListener('input', render);
sort.addEventListener('change', render);

fetch('data/works.json', { cache: 'no-cache' })
  .then(r => {
    if (!r.ok) throw Error('data/works.json HTTP ' + r.status);
    return r.json();
  })
  .then(data => {
    if (!Array.isArray(data) || data.length !== 81) {
      throw Error('Expected 81 works, got ' + (Array.isArray(data) ? data.length : 'non-array'));
    }
    const bad = data.filter(w => !w || !w.title || !w.category || !w.url || (w.image !== null && !/^\/images\/works\/[^/]+\.jpg$/i.test(w.image)));
    if (bad.length) throw Error('Invalid work records/local JPG paths: ' + bad.length);
    items = data;
    console.info('[WWZ Works] JSON loaded', { count: items.length, url: 'data/works.json' });
    render();
  })
  .catch(e => {
    count.textContent = 'Failed to load works data. Please try again later.';
    console.error('[WWZ Works] Data load failed', { url: 'data/works.json', error: e.message });
  });
})();
