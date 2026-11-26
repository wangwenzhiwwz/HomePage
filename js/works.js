(() => {
'use strict';

const CATEGORY_LABELS = {
  '摄影': 'Photography',
  '三维': '3D CGI',
  '插画': 'Illustration'
};

const formatCategory = (val) => CATEGORY_LABELS[val] || val || '';

const getRoot = () => {
  const customRoot = document.body?.dataset?.contentRoot;
  if (typeof customRoot === 'string') return customRoot;
  return '';
};

const imagePath = (value) => {
  const raw = String(value || '').trim();
  if (!/^\/images\/works\/[^/]+\.jpg$/i.test(raw)) {
    throw Error('Invalid local JPG path: ' + raw);
  }
  const rel = getRoot() + raw.replace(/^\//, '');
  if (/[()]/.test(rel)) {
    return rel.replace(/\(/g, '%28').replace(/\)/g, '%29') + '?v=20261112';
  }
  return rel;
};

const isValidWorksArray = (data) =>
  Array.isArray(data) &&
  data.length > 0 &&
  data.every(w => w && w.title && w.category && w.url && (w.image === null || /^\/images\/works\/[^/]+\.jpg$/i.test(w.image)));

const fetchWithTimeout = async (url, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'default', signal: controller.signal });
    if (!res.ok) throw Error(`${url} HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

const loadWorksData = async () => {
  if (isValidWorksArray(window.__WWZ_WORKS_CACHE)) {
    return window.__WWZ_WORKS_CACHE;
  }
  if (isValidWorksArray(window.WWZ_WORKS)) {
    window.__WWZ_WORKS_CACHE = window.WWZ_WORKS;
    return window.WWZ_WORKS;
  }

  const urls = [getRoot() + 'data/works.json', '/data/works.json'];
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const url of new Set(urls)) {
      try {
        const data = await fetchWithTimeout(url, 8000);
        if (!isValidWorksArray(data)) throw Error('Invalid works schema');
        window.__WWZ_WORKS_CACHE = data;
        return data;
      } catch (err) {
        lastError = err;
      }
    }
    if (attempt < 2) {
      await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw lastError || Error('Failed to load works data');
};

const initWorks = () => {
  const grid = document.getElementById('portfolioGrid');
  const count = document.getElementById('worksCount');
  const search = document.getElementById('worksSearch');
  const sort = document.getElementById('worksSort');

  if (!grid || !count || !search || !sort) return;
  if (grid.dataset.worksInitialized === 'true') return;
  grid.dataset.worksInitialized = 'true';

  let items = [];
  let visible = [];
  let category = 'all';

  const markUnavailable = (img) => {
    img.dataset.imageState = 'error';
    img.classList.add('image-unavailable');
    img.removeAttribute('src');
    const media = img.closest('.portfolio-media');
    if (media) {
      media.classList.add('image-unavailable');
      if (!media.querySelector('.image-fallback')) {
        const hint = document.createElement('span');
        hint.className = 'image-fallback';
        hint.textContent = 'Preview unavailable';
        media.append(hint);
      }
    }
  };

  const bindImage = (img, url) => {
    img.dataset.imageState = 'loading';
    let retried = false;
    const onLoad = () => {
      img.dataset.imageState = 'loaded';
      img.classList.remove('image-unavailable');
      img.closest('.portfolio-media')?.classList.add('is-loaded');
    };
    const onError = () => {
      if (!retried) {
        retried = true;
        setTimeout(() => {
          if (!document.body.contains(img)) return;
          const sep = url.includes('?') ? '&' : '?';
          img.src = url + sep + 'retry=1';
        }, 800);
        return;
      }
      markUnavailable(img);
    };
    img.addEventListener('load', onLoad, { once: true });
    img.addEventListener('error', onError);
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

    if (w.pinned) {
      const badge = document.createElement('span');
      badge.className = 'film-pin-badge';
      badge.innerHTML = '<svg class="wwz-ico" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg> Pinned';
      media.append(badge);
    }

    const img = document.createElement('img');
    img.className = 'portfolio-img';
    img.alt = w.title || '';
    img.width = 800;
    img.height = 600;
    img.loading = pos < 9 ? 'eager' : 'lazy';
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
    if (!document.body.contains(grid)) return;
    const q = search.value.trim().toLowerCase();
    const filtered = items.filter(w =>
      (category === 'all' || w.category === category) &&
      (!q || [w.title, w.category, formatCategory(w.category), w.subcategory, formatCategory(w.subcategory)].join(' ').toLowerCase().includes(q))
    );

    const pinned = filtered.filter(w => w.pinned);
    const unpinned = filtered.filter(w => !w.pinned);
    if (sort.value === 'oldest') unpinned.reverse();
    visible = [...pinned, ...unpinned];

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

  const filters = document.querySelector('.works-toolbar .filter-bar') || document;
  filters.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      category = btn.dataset.filter;
      filters.querySelectorAll('[data-filter]').forEach(x => {
        x.classList.toggle('active', x === btn);
        x.setAttribute('aria-pressed', String(x === btn));
      });
      render();
    });
  });

  search.addEventListener('input', render);
  sort.addEventListener('change', render);

  const boot = () => {
    count.textContent = 'Loading works…';
    loadWorksData()
      .then(data => {
        if (!document.body.contains(grid)) return;
        items = data;
        render();
      })
      .catch(err => {
        if (!document.body.contains(grid)) return;
        console.error('[WWZ Works] Data load failed', err);
        count.textContent = 'Unable to load works right now.';
        const retryWrap = document.createElement('div');
        retryWrap.className = 'works-empty';
        const msg = document.createElement('p');
        msg.textContent = 'Network hiccup while loading the works gallery.';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-secondary';
        btn.style.marginTop = '12px';
        btn.textContent = 'Retry Loading Works';
        btn.addEventListener('click', () => {
          retryWrap.remove();
          boot();
        });
        retryWrap.append(msg, btn);
        grid.replaceChildren(retryWrap);
      });
  };

  boot();
};

window.WWZWorksInit = initWorks;
if (document.readyState !== 'loading') initWorks();
else document.addEventListener('DOMContentLoaded', initWorks, { once: true });
})();
