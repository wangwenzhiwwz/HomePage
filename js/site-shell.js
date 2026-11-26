/**
 * WWZ.iM Studio Shell
 *
 * Features:
 * 1. Fixed Floating-to-Frosted Navigation Bar with Single Mobile Drawer Brand Anchor.
 * 2. Pure Inline SVG Icon Engine (Zero External Font Awesome CDN Dependencies).
 * 3. Dark/Light Mode Switcher with Smooth Rotation & System Sync.
 * 4. Top Loading Progress Bar & Zero-Flicker Same-Origin PJAX Navigation.
 * 5. Viewport-Aware Idle-Sleeping Cursor Eye Tracking & Interactive Hero Stage.
 * 6. Video Cinema Modal, Works/Videos/Blog Filters, and Specular Card Glow.
 */

(function () {
  'use strict';

  const getRoot = () => {
    const customRoot = document.body?.dataset?.contentRoot;
    if (typeof customRoot === 'string') return customRoot;
    if (location.pathname.includes('/articles/')) return '../../';
    if (location.pathname.includes('/videos/') || location.pathname.includes('/lab/') || location.pathname.includes('/topics/')) return '../';
    return '';
  };

  const getRouteKey = (pathname) => {
    if (pathname === '/' || (pathname.endsWith('/index.html') && !/\/(videos|articles|projects|topics|lab)\//.test(pathname))) {
      return 'home';
    }
    if (pathname.includes('/works')) return 'works';
    if (pathname.includes('/videos')) return 'videos';
    if (pathname.includes('/blog') || pathname.includes('/articles') || pathname.includes('/article') || pathname.includes('/topics') || pathname.includes('/lab')) {
      return 'blog';
    }
    if (pathname.includes('/about') || pathname.includes('/team')) return 'about';
    if (pathname.includes('/now')) return 'now';
    return 'home';
  };

  // Pure Inline SVG Icon Dictionary (1.85px stroke icons + minimal brand marks)
  const SVG_ICONS = {
    'fa-arrow-left': '<path d="M19 12H5m0 0l7 7m-7-7l7-7"/>',
    'fa-arrow-right': '<path d="M5 12h14m0 0l-7-7m7 7l-7 7"/>',
    'fa-arrow-up': '<path d="M12 19V5m0 0l-7 7m7-7l7 7"/>',
    'fa-arrow-up-right-from-square': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3"/>',
    'fa-bolt': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'fa-book': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    'fa-book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'fa-camera': '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    'fa-chart-line': '<path d="M3 3v18h18"/><path d="M19 9l-5 5-4-4-3 3"/>',
    'fa-check': '<polyline points="20 6 9 17 4 12"/>',
    'fa-check-double': '<path d="M18 6L7 17l-5-5"/><path d="M22 10l-7.5 7.5L13 16"/>',
    'fa-chevron-down': '<polyline points="6 9 12 15 18 9"/>',
    'fa-chevron-right': '<polyline points="9 18 15 12 9 6"/>',
    'fa-clock': '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>',
    'fa-code-branch': '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    'fa-compass': '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    'fa-copy': '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    'fa-cube': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    'fa-cubes': '<path d="M12 2l4 2.3v4.6L12 11.2 8 8.9V4.3L12 2z"/><path d="M6 12.5l4 2.3v4.6L6 21.7l-4-2.3v-4.6l4-2.3z"/><path d="M18 12.5l4 2.3v4.6l-4 2.3-4-2.3v-4.6l4-2.3z"/>',
    'fa-diagram-project': '<rect x="2" y="3" width="6" height="5" rx="1"/><rect x="16" y="3" width="6" height="5" rx="1"/><rect x="9" y="16" width="6" height="5" rx="1"/><path d="M8 5.5h8M12 5.5V16"/>',
    'fa-envelope': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
    'fa-film': '<rect x="2" y="3" width="20" height="18" rx="2"/><line x1="7" y1="3" x2="7" y2="21"/><line x1="17" y1="3" x2="17" y2="21"/><line x1="2" y1="9" x2="7" y2="9"/><line x1="2" y1="15" x2="7" y2="15"/><line x1="17" y1="9" x2="22" y2="9"/><line x1="17" y1="15" x2="22" y2="15"/>',
    'fa-flask': '<path d="M9 3h6m-5 0v5.2L4.7 17.6A2 2 0 0 0 6.4 20.5h11.2a2 2 0 0 0 1.7-2.9L14 8.2V3"/>',
    'fa-flask-vial': '<path d="M9 3h6m-5 0v5.2L4.7 17.6A2 2 0 0 0 6.4 20.5h11.2a2 2 0 0 0 1.7-2.9L14 8.2V3"/>',
    'fa-font': '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
    'fa-house': '<path d="M3 10l9-7 9 7v11a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    'fa-icons': '<circle cx="8" cy="8" r="4"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><polygon points="8 14 13 21 3 21"/><circle cx="17.5" cy="17.5" r="3.5"/>',
    'fa-layer-group': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/>',
    'fa-magnifying-glass': '<circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.2" y2="16.2"/>',
    'fa-memory': '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 6V3m5 3V3m5 3V3M7 21v-3m5 3v-3m5 3v-3"/>',
    'fa-microchip': '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 6V2m6 4V2M9 22v-4m6 4v-4M6 9H2m4 6H2m20-6h-4m4 6h-4"/>',
    'fa-moon': '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    'fa-note-sticky': '<path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9l7-7V5a2 2 0 0 0-2-2z"/><polyline points="14 21 14 14 21 14"/>',
    'fa-palette': '<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="15.5" cy="10" r="1"/><circle cx="15.5" cy="14" r="1"/>',
    'fa-paper-plane': '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    'fa-play': { filled: true, body: '<polygon points="6 4 20 12 6 20 6 4"/>' },
    'fa-rotate-left': '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    'fa-shapes': '<polygon points="12 3 19 14 5 14"/><circle cx="8.5" cy="17.5" r="3"/><rect x="14" y="15" width="6" height="6" rx="1"/>',
    'fa-sliders': '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="8" cy="18" r="2" fill="currentColor"/>',
    'fa-sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/>',
    'fa-terminal': '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    'fa-triangle-exclamation': '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.8" fill="currentColor"/>',
    'fa-user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'fa-user-astronaut': '<circle cx="12" cy="9" r="5"/><path d="M5 20a7 7 0 0 1 14 0"/><circle cx="12" cy="9" r="2.2"/>',
    'fa-wand-magic-sparkles': '<path d="M15 4l5 5L8 21l-5-5L15 4z"/><path d="M12 7l5 5M5 3v3M3.5 4.5h3M19 15v3M17.5 16.5h3"/>',
    'fa-xmark': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    // Clean minimal Brand Glyphs (filled)
    'fa-github': { filled: true, body: '<path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.72c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.85c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.07.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.25C22 6.59 17.52 2 12 2z"/>' },
    'fa-youtube': { filled: true, body: '<path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77c.28-1.57.42-3.18.42-4.81s-.14-3.24-.42-4.81zM10 15V9l5.2 3L10 15z"/>' },
    'fa-x-twitter': { filled: true, body: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>' },
    'fa-vimeo-v': { filled: true, body: '<path d="M21.9 7.1c-.1 2.1-1.6 5-4.4 8.7C14.6 19.6 12.1 21.5 10.1 21.5c-1.2 0-2.3-1.1-3.1-3.4l-1.7-6.2c-.6-2.3-1.3-3.4-2-3.4-.2 0-.7.3-1.6 1L.7 8.2C1.7 7.3 2.7 6.4 3.6 5.5c1.3-1.1 2.3-1.7 3-1.8 1.6-.2 2.5.9 2.9 3.3.4 2.5.7 4.1.8 4.7.5 2.2 1 3.3 1.6 3.3.5 0 1.1-.7 2-2.2.9-1.4 1.4-2.5 1.5-3.3.1-1.3-.4-1.9-1.5-1.9-.5 0-1.1.1-1.6.4 1.1-3.5 3.1-5.2 6.1-5.1 2.2.1 3.3 1.5 3.5 4.2z"/>' },
    'fa-apple': { filled: true, body: '<path d="M16.37 12.63c-.02-2.1 1.72-3.11 1.8-3.16-.98-1.43-2.51-1.63-3.05-1.65-1.3-.13-2.54.76-3.2.76-.66 0-1.68-.74-2.77-.72-1.42.02-2.74.83-3.47 2.1-1.48 2.57-.38 6.38 1.06 8.46.71 1.02 1.55 2.17 2.66 2.13 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.77.67 1.15-.02 1.88-1.04 2.58-2.07.82-1.19 1.15-2.34 1.17-2.4-.03-.01-2.29-.88-2.31-3.47zM14.28 6.46c.59-.71.99-1.7.88-2.69-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.61.95.07 1.92-.48 2.51-1.2z"/>' },
    'fa-windows': { filled: true, body: '<path d="M3 5.5l8-1.2v7.2H3V5.5zm9-1.3L21 3v8.5h-9V4.2zM3 12.5h8v7.2l-8-1.2v-6zm9 0h9V21l-9-1.3v-7.2z"/>' },
    'fa-android': { filled: true, body: '<path d="M6.5 9.5h11a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-1v2.5a1 1 0 0 1-2 0v-2.5h-5v2.5a1 1 0 0 1-2 0v-2.5h-1A1.5 1.5 0 0 1 5 17v-6a1.5 1.5 0 0 1 1.5-1.5zM8 8.5a4 4 0 0 1 8 0H8zm1.5-5l-1-1.5m7 1.5l1-1.5"/>' }
  };

  const renderIconSVG = (iconName, extraClass = '', inlineStyle = '') => {
    const def = SVG_ICONS[iconName];
    if (!def) return '';
    const isFilled = typeof def === 'object' && def.filled;
    const body = isFilled ? def.body : def;
    const attrs = isFilled
      ? 'fill="currentColor"'
      : 'fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"';
    const cls = extraClass ? `wwz-ico ${extraClass}` : 'wwz-ico';
    const styleAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
    return `<svg class="${cls}" viewBox="0 0 24 24" width="16" height="16" ${attrs} aria-hidden="true"${styleAttr}>${body}</svg>`;
  };

  const hydrateIcons = (scope = document) => {
    scope.querySelectorAll('i[class*="fa-"]').forEach(el => {
      const classes = [...el.classList];
      const iconClass = classes.find(c => SVG_ICONS[c]);
      if (!iconClass) return;
      const keep = classes.filter(c => !/^fa-(?:solid|regular|brands|light|thin|duotone)$/.test(c) && c !== iconClass);
      const markup = renderIconSVG(iconClass, keep.join(' '), el.getAttribute('style') || '');
      if (!markup) return;
      const wrap = document.createElement('span');
      wrap.innerHTML = markup;
      const svg = wrap.firstElementChild;
      if (svg) el.replaceWith(svg);
    });
  };

  // SVGs for Theme Toggle
  const ICON_MOON = renderIconSVG('fa-moon', 'theme-icon-svg');
  const ICON_SUN = renderIconSVG('fa-sun', 'theme-icon-svg');

  const ensureProgressBar = () => {
    let bar = document.getElementById('apple-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'apple-progress-bar';
      bar.setAttribute('aria-hidden', 'true');
      document.body.prepend(bar);
    }
    return bar;
  };

  const buildNavHTML = (activeKey) => {
    const root = getRoot();
    const isDark = document.documentElement.dataset.theme === 'dark';
    const themeIcon = isDark ? ICON_SUN : ICON_MOON;
    const themeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return `
      <div class="apple-nav-inner">
        <a href="${root}index.html" class="apple-brand" data-shell-nav="home">
          <img src="${root}favicon.png" alt="WWZ Logo" width="24" height="24">
          <span>WWZ.iM</span>
        </a>
        <nav class="apple-links" aria-label="Primary navigation">
          <a href="${root}index.html" class="apple-link ${activeKey === 'home' ? 'active' : ''}" data-shell-nav="home" ${activeKey === 'home' ? 'aria-current="page"' : ''}>Home</a>
          <a href="${root}videos/" class="apple-link ${activeKey === 'videos' ? 'active' : ''}" data-shell-nav="videos" ${activeKey === 'videos' ? 'aria-current="page"' : ''}>Videos</a>
          <a href="${root}works.html" class="apple-link ${activeKey === 'works' ? 'active' : ''}" data-shell-nav="works" ${activeKey === 'works' ? 'aria-current="page"' : ''}>Works</a>
          <a href="${root}blog.html" class="apple-link ${activeKey === 'blog' ? 'active' : ''}" data-shell-nav="blog" ${activeKey === 'blog' ? 'aria-current="page"' : ''}>Blog</a>
          <a href="${root}about.html" class="apple-link ${activeKey === 'about' ? 'active' : ''}" data-shell-nav="about" ${activeKey === 'about' ? 'aria-current="page"' : ''}>About</a>
        </nav>
        <div class="apple-controls">
          <button class="apple-icon-btn" type="button" data-shell-theme aria-label="${themeLabel}" title="${themeLabel}">
            ${themeIcon}
          </button>
          <button class="apple-menu-toggle" type="button" id="appleMenuToggle" aria-label="Open mobile menu" aria-expanded="false">
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div class="apple-mobile-drawer" id="appleMobileDrawer">
        <nav class="apple-mobile-nav">
          <a href="${root}index.html" class="apple-mobile-link ${activeKey === 'home' ? 'active' : ''}" data-shell-nav="home" ${activeKey === 'home' ? 'aria-current="page"' : ''}>
            <span>Home</span>
            <span class="active-dot">${renderIconSVG('fa-chevron-right')}</span>
          </a>
          <a href="${root}videos/" class="apple-mobile-link ${activeKey === 'videos' ? 'active' : ''}" data-shell-nav="videos" ${activeKey === 'videos' ? 'aria-current="page"' : ''}>
            <span>Videos</span>
            <span class="active-dot">${renderIconSVG('fa-chevron-right')}</span>
          </a>
          <a href="${root}works.html" class="apple-mobile-link ${activeKey === 'works' ? 'active' : ''}" data-shell-nav="works" ${activeKey === 'works' ? 'aria-current="page"' : ''}>
            <span>Works</span>
            <span class="active-dot">${renderIconSVG('fa-chevron-right')}</span>
          </a>
          <a href="${root}blog.html" class="apple-mobile-link ${activeKey === 'blog' ? 'active' : ''}" data-shell-nav="blog" ${activeKey === 'blog' ? 'aria-current="page"' : ''}>
            <span>Blog</span>
            <span class="active-dot">${renderIconSVG('fa-chevron-right')}</span>
          </a>
          <a href="${root}about.html" class="apple-mobile-link ${activeKey === 'about' ? 'active' : ''}" data-shell-nav="about" ${activeKey === 'about' ? 'aria-current="page"' : ''}>
            <span>About</span>
            <span class="active-dot">${renderIconSVG('fa-chevron-right')}</span>
          </a>
        </nav>
        <div class="apple-mobile-footer">
          <span>WWZ.iM · Wang Wenzhi</span>
          <a href="https://github.com/wangwenzhiwwz" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </div>
    `;
  };

  const updateThemeIcons = (pulse = false) => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    const icon = isDark ? ICON_SUN : ICON_MOON;
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('[data-shell-theme]').forEach(btn => {
      btn.innerHTML = icon;
      btn.setAttribute('aria-label', label);
      btn.title = label;
      if (pulse) {
        btn.classList.add('icon-pulse');
        setTimeout(() => btn.classList.remove('icon-pulse'), 400);
      }
    });
  };

  window.WWZShellSyncTheme = () => updateThemeIcons(false);

  const updateNavRelativePaths = (header) => {
    const root = getRoot();
    const img = header.querySelector('.apple-brand img');
    if (img) img.setAttribute('src', `${root}favicon.png`);
    const routeMap = {
      home: `${root}index.html`,
      videos: `${root}videos/`,
      works: `${root}works.html`,
      blog: `${root}blog.html`,
      about: `${root}about.html`
    };
    header.querySelectorAll('[data-shell-nav]').forEach(link => {
      const target = routeMap[link.dataset.shellNav];
      if (target) link.setAttribute('href', target);
    });
  };

  let closeDrawerFn = null;

  const mountNav = () => {
    ensureProgressBar();
    let header = document.getElementById('wwz-header');
    const pageKey = document.body.dataset.activePage || getRouteKey(location.pathname);
    const activeKey = (pageKey === 'lab' || pageKey === 'article' || pageKey === 'topic' || pageKey === 'now') ? 'blog' : pageKey;

    if (!header) {
      header = document.createElement('header');
      header.id = 'wwz-header';
      header.className = 'apple-nav';
      header.setAttribute('role', 'banner');
      header.innerHTML = buildNavHTML(activeKey);
      document.body.prepend(header);
    } else {
      updateNavRelativePaths(header);
      updateActiveNavLinks(activeKey);
      updateThemeIcons(false);
    }

    const menuToggle = header.querySelector('#appleMenuToggle');
    const mobileDrawer = header.querySelector('#appleMobileDrawer');

    if (menuToggle && mobileDrawer && !menuToggle.dataset.bound) {
      menuToggle.dataset.bound = 'true';
      const closeDrawer = () => {
        mobileDrawer.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.documentElement.classList.remove('drawer-locked');
        document.body.classList.remove('drawer-locked');
        document.body.style.overflow = '';
      };
      closeDrawerFn = closeDrawer;

      const openDrawer = () => {
        mobileDrawer.classList.add('is-open');
        menuToggle.classList.add('is-active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.documentElement.classList.add('drawer-locked');
        document.body.classList.add('drawer-locked');
        document.body.style.overflow = 'hidden';
      };

      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileDrawer.classList.contains('is-open')) closeDrawer();
        else openDrawer();
      });

      mobileDrawer.querySelectorAll('.apple-mobile-link').forEach(link => {
        link.addEventListener('click', closeDrawer);
      });

      document.addEventListener('click', (e) => {
        if (mobileDrawer.classList.contains('is-open') && !header.contains(e.target)) {
          closeDrawer();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
          closeDrawer();
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileDrawer.classList.contains('is-open')) {
          closeDrawer();
        }
      });
    }

    if (!header.dataset.scrollBound) {
      header.dataset.scrollBound = 'true';
      let ticking = false;
      const updateHeaderScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 20);
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateHeaderScroll);
          ticking = true;
        }
      }, { passive: true });
      updateHeaderScroll();
    }

    header.querySelectorAll('[data-shell-theme]').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          const isDark = document.documentElement.dataset.theme === 'dark';
          const newTheme = isDark ? 'light' : 'dark';
          const bg = newTheme === 'dark' ? '#000000' : '#f7f7f5';
          document.documentElement.dataset.theme = newTheme;
          document.documentElement.dataset.themeMode = newTheme;
          document.documentElement.style.colorScheme = newTheme;
          document.documentElement.style.backgroundColor = bg;
          document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
          try { localStorage.setItem('wwz-theme-mode', newTheme); } catch (_) {}
          updateThemeIcons(true);
        });
      }
    });

    document.querySelectorAll('.sidebar, .wwz-topbar:not(#wwz-header)').forEach(el => el.remove());
  };

  const updateActiveNavLinks = (activeKey) => {
    document.querySelectorAll('[data-shell-nav]').forEach(link => {
      const match = link.dataset.shellNav === activeKey;
      link.classList.toggle('active', match);
      if (match) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  // Interactive 3D Tilt & Dynamic Specular Spotlight Effect
  const initInteractiveSpecular = () => {
    const cards = document.querySelectorAll('.bento-card, .bento-hero-film, .film-card, .interactive-card');
    cards.forEach(card => {
      if (card.dataset.specularBound) return;
      card.dataset.specularBound = 'true';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  };

  let activeHeroCleanup = null;

  // Hero Motion Controller with Viewport & Convergence Idle Sleep
  const initHeroKinetic = () => {
    if (typeof activeHeroCleanup === 'function') {
      activeHeroCleanup();
      activeHeroCleanup = null;
    }

    const stage = document.getElementById('heroStage');
    const illo = document.getElementById('heroIllo');
    const bubbleWrap = document.getElementById('heroBubbleWrap');
    const bubbleView = document.getElementById('heroBubbleView');
    const slides = document.querySelectorAll('#heroBubbleSlides .qj-bubble-slide');
    const dots = document.querySelectorAll('#heroBubbleDots .qj-dot');
    const captionEl = document.getElementById('heroBubbleCaption');
    const guideCards = document.querySelectorAll('.qj-guide-card[data-guide-slide]');

    if (!stage || !illo) return;

    const cleanups = [];

    requestAnimationFrame(() => {
      setTimeout(() => {
        illo.classList.add('is-ready');
      }, 220);
    });

    // Idle-sleeping pupil lerp tracking (sleeps at rest & when Hero leaves viewport)
    const clampVal = (v, min, max) => Math.min(max, Math.max(min, v));
    let tEyeX = 0, tEyeY = 0, cEyeX = 0, cEyeY = 0;
    let rafId = null;
    let isHeroVisible = true;

    const tickEyes = () => {
      rafId = null;
      if (!document.body.contains(illo) || !isHeroVisible) return;

      const destX = tEyeX * 2.8;
      const destY = tEyeY * 2.8;
      const dx = destX - cEyeX;
      const dy = destY - cEyeY;

      if (Math.abs(dx) <= 0.01 && Math.abs(dy) <= 0.01) {
        cEyeX = destX;
        cEyeY = destY;
        illo.style.setProperty('--eye-x', `${cEyeX.toFixed(2)}px`);
        illo.style.setProperty('--eye-y', `${cEyeY.toFixed(2)}px`);
        return; // Sleep cleanly until next pointer movement
      }

      cEyeX += dx * 0.14;
      cEyeY += dy * 0.14;
      illo.style.setProperty('--eye-x', `${cEyeX.toFixed(2)}px`);
      illo.style.setProperty('--eye-y', `${cEyeY.toFixed(2)}px`);
      rafId = requestAnimationFrame(tickEyes);
    };

    const wakeEyes = () => {
      if (!rafId && isHeroVisible && document.body.contains(illo)) {
        rafId = requestAnimationFrame(tickEyes);
      }
    };

    const onPointerMove = (e) => {
      if (!isHeroVisible) return;
      const r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tEyeX = clampVal(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      tEyeY = clampVal(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
      wakeEyes();
    };

    const onPointerLeave = () => {
      tEyeX = 0;
      tEyeY = 0;
      wakeEyes();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    cleanups.push(() => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    });

    if ('IntersectionObserver' in window) {
      const heroSection = stage.closest('.qj-hero') || stage;
      const io = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0]?.isIntersecting ?? true;
        if (isHeroVisible) wakeEyes();
      }, { threshold: 0.02 });
      io.observe(heroSection);
      cleanups.push(() => io.disconnect());
    }

    // Expandable Speech-Bubble Slides + Dot Controls + Guide Card Sync
    if (slides.length && bubbleView) {
      const captions = [
        '01 · Commercial Direction',
        '02 · Photography & CGI',
        '03 · AI & Field Notes',
        '04 · Independent Tools'
      ];
      let currentSlide = 0;
      let autoplayTimer = null;
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const goSlide = (nextIdx) => {
        const targetIdx = ((nextIdx % slides.length) + slides.length) % slides.length;
        currentSlide = targetIdx;
        slides.forEach((s, i) => s.classList.toggle('is-active', i === targetIdx));
        dots.forEach((d, i) => {
          const active = i === targetIdx;
          d.classList.toggle('is-active', active);
          d.setAttribute('aria-selected', String(active));
        });
        guideCards.forEach((c, i) => c.classList.toggle('is-selected', i === targetIdx));
        if (captionEl) captionEl.textContent = captions[targetIdx] || '';
      };

      const scheduleAuto = () => {
        if (prefersReduced) return;
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => {
          if (!bubbleWrap?.classList.contains('is-hovered')) {
            goSlide(currentSlide + 1);
          }
        }, 5500);
      };
      cleanups.push(() => {
        if (autoplayTimer) clearInterval(autoplayTimer);
      });

      dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goSlide(parseInt(dot.dataset.slide || '0', 10));
          scheduleAuto();
        });
      });

      guideCards.forEach((card) => {
        const idx = parseInt(card.dataset.guideSlide || '0', 10);
        card.addEventListener('click', () => {
          goSlide(idx);
          scheduleAuto();
        });
        card.addEventListener('mouseenter', () => {
          goSlide(idx);
        });
      });

      if (bubbleWrap) {
        if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
          let hoverOn = false;
          const setHover = (on) => {
            if (on === hoverOn) return;
            hoverOn = on;
            bubbleWrap.classList.toggle('is-hovered', on);
          };
          const onBubbleHoverMove = (e) => {
            if (!document.body.contains(bubbleView)) return;
            const r = bubbleView.getBoundingClientRect();
            const pad = hoverOn ? 12 : 0;
            setHover(
              e.clientX >= r.left - pad &&
              e.clientX <= r.right + pad &&
              e.clientY >= r.top - pad &&
              e.clientY <= r.bottom + pad
            );
          };
          const onDocLeave = () => setHover(false);
          window.addEventListener('pointermove', onBubbleHoverMove, { passive: true });
          document.addEventListener('mouseleave', onDocLeave);
          cleanups.push(() => {
            window.removeEventListener('pointermove', onBubbleHoverMove);
            document.removeEventListener('mouseleave', onDocLeave);
          });
        }

        let pointerStartX = null;
        bubbleView.addEventListener('pointerdown', (e) => {
          if (e.target.closest('.qj-dot')) return;
          pointerStartX = e.clientX;
        });
        bubbleView.addEventListener('pointerup', (e) => {
          if (e.target.closest('.qj-dot') || pointerStartX === null) return;
          const dx = e.clientX - pointerStartX;
          pointerStartX = null;
          if (Math.abs(dx) > 36) {
            goSlide(dx < 0 ? currentSlide + 1 : currentSlide - 1);
          } else {
            goSlide(currentSlide + 1);
          }
          scheduleAuto();
        });
        bubbleView.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goSlide(currentSlide + 1);
            scheduleAuto();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goSlide(currentSlide - 1);
            scheduleAuto();
          }
        });
      }

      goSlide(0);
      scheduleAuto();
    }

    activeHeroCleanup = () => cleanups.forEach(fn => fn());
  };

  // Shared Videos Page Year Filter
  const initVideoFilters = () => {
    const filters = document.getElementById('videoFilters');
    const grid = document.getElementById('videoGrid');
    const count = document.getElementById('videoCount');
    if (!filters || !grid || filters.dataset.bound) return;
    filters.dataset.bound = 'true';

    const cards = grid.querySelectorAll('.film-card');
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      const year = btn.dataset.year;
      filters.querySelectorAll('.filter-pill').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      let visible = 0;
      cards.forEach(c => {
        const match = year === 'all' || c.dataset.year === year;
        c.style.display = match ? 'flex' : 'none';
        if (match) visible++;
      });
      if (count) {
        count.textContent = `${visible} ${visible === 1 ? 'commercial film' : 'commercial films'}` + (year !== 'all' ? ` · ${year}` : '');
      }
    });
  };

  // Shared Blog Page Category & Search Filter
  const initBlogFilters = () => {
    const filters = document.getElementById('blogFilters');
    const grid = document.getElementById('blogGrid');
    const search = document.getElementById('blogSearch');
    const empty = document.getElementById('blogEmpty');
    if (!grid || (!filters && !search) || grid.dataset.bound) return;
    grid.dataset.bound = 'true';

    const cards = grid.querySelectorAll('.editorial-card');
    let currentCat = 'all';
    let currentQuery = '';

    const applyFilters = () => {
      let visibleCount = 0;
      cards.forEach(card => {
        const catMatch = currentCat === 'all' || card.dataset.category === currentCat;
        const text = ((card.textContent || '') + ' ' + (card.dataset.keywords || '')).toLowerCase();
        const queryMatch = !currentQuery || text.includes(currentQuery);
        const isVisible = catMatch && queryMatch;
        card.style.display = isVisible ? 'flex' : 'none';
        if (isVisible) visibleCount++;
      });
      if (empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    filters?.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;
      currentCat = btn.dataset.cat;
      filters.querySelectorAll('.filter-chip').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      applyFilters();
    });

    search?.addEventListener('input', (e) => {
      currentQuery = (e.target.value || '').trim().toLowerCase();
      applyFilters();
    });
  };

  // Directional Scroll Reveal (Slide Up / Left / Right Animations)
  const initScrollReveals = () => {
    const items = document.querySelectorAll('#page-content [data-reveal]');
    if (!items.length) return;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add('is-revealed');
      } else {
        io.observe(el);
      }
    });
  };

  // About Page Sliding Discipline Tabs + Horizontal Carousel Track
  const initAboutSlider = () => {
    const shell = document.getElementById('aboutSliderShell');
    if (!shell || shell.dataset.bound) return;
    shell.dataset.bound = 'true';

    const tabs = [...shell.querySelectorAll('.about-tab-btn')];
    const glider = shell.querySelector('.about-tab-glider');
    const track = shell.querySelector('.about-slider-track');
    const panels = [...shell.querySelectorAll('.about-slide-panel')];
    if (!tabs.length || !track || !panels.length) return;

    const updateGlider = (btn) => {
      if (!glider || !btn) return;
      glider.style.setProperty('--glider-w', `${btn.offsetWidth}px`);
      glider.style.setProperty('--glider-x', `${btn.offsetLeft - 5}px`);
    };

    const setSlide = (idx) => {
      const safe = Math.max(0, Math.min(panels.length - 1, idx));
      track.style.transform = `translateX(-${safe * 100}%)`;
      tabs.forEach((btn, i) => btn.setAttribute('aria-selected', String(i === safe)));
      panels.forEach((panel, i) => panel.setAttribute('aria-hidden', String(i !== safe)));
      updateGlider(tabs[safe]);
    };

    tabs.forEach((btn, idx) => {
      btn.addEventListener('click', () => setSlide(idx));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = (idx + 1) % tabs.length;
          setSlide(next);
          tabs[next].focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = (idx - 1 + tabs.length) % tabs.length;
          setSlide(prev);
          tabs[prev].focus();
        }
      });
    });

    window.addEventListener('resize', () => {
      const active = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
      updateGlider(active);
    });

    requestAnimationFrame(() => setSlide(0));
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {}
    }
    try {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.setAttribute('readonly', '');
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      const ok = document.execCommand('copy');
      temp.remove();
      return !!ok;
    } catch (_) {
      return false;
    }
  };

  const initPageComponents = () => {
    hydrateIcons(document);

    // 1. Contact Copy Buttons, Quick Brief Composer & Direct Email Pills
    const getStatusEl = (el) => {
      const container = el.closest('.contact-copy, section, .contact-box') || document;
      return container.querySelector('.js-contact-status') || document.getElementById('contactStatus');
    };

    const flashStatus = (statusEl, msg, duration = 3400) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      clearTimeout(statusEl._timer);
      if (msg) {
        statusEl._timer = setTimeout(() => { statusEl.textContent = ''; }, duration);
      }
    };

    document.querySelectorAll('.js-copy-email').forEach(copyBtn => {
      if (copyBtn.dataset.bound) return;
      copyBtn.dataset.bound = 'true';
      copyBtn.addEventListener('click', async () => {
        const email = copyBtn.dataset.email || 'wwz.im@outlook.com';
        const success = await copyToClipboard(email);
        const statusEl = getStatusEl(copyBtn);
        flashStatus(statusEl, success ? `Copied ${email} to clipboard!` : `Email address: ${email}`);
        copyBtn.innerHTML = success
          ? `${renderIconSVG('fa-check')} Copied`
          : `${renderIconSVG('fa-copy')} Copy Email`;
        clearTimeout(copyBtn._resetTimer);
        copyBtn._resetTimer = setTimeout(() => {
          copyBtn.innerHTML = `${renderIconSVG('fa-copy')} Copy Email`;
        }, 2600);
      });
    });

    // 2. Video Cinema Modal
    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    const modalClose = document.getElementById('modalClose');
    const modalPoster = document.getElementById('modalPoster');
    const modalPosterImg = document.getElementById('modalPosterImg');
    const modalSpinnerText = document.querySelector('#modalSpinner .modal-spinner-text, #modalSpinner span');
    let lastFocusedElement = null;
    let posterTimer = null;
    let slowTimer = null;
    let idleTimer = null;
    let activeLoadHandler = null;

    const clearModalTimers = () => {
      if (posterTimer) { clearTimeout(posterTimer); posterTimer = null; }
      if (slowTimer) { clearTimeout(slowTimer); slowTimer = null; }
      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
      if (activeLoadHandler && videoFrame) {
        videoFrame.removeEventListener('load', activeLoadHandler);
        activeLoadHandler = null;
      }
    };

    const wakeModalControls = () => {
      if (!videoModal) return;
      videoModal.classList.remove('is-idle');
      if (idleTimer) clearTimeout(idleTimer);
      if (videoModal.classList.contains('open')) {
        idleTimer = setTimeout(() => {
          videoModal.classList.add('is-idle');
        }, 2200);
      }
    };

    const closeVideo = () => {
      if (!videoModal || !videoFrame) return;
      clearModalTimers();
      videoModal.classList.remove('open', 'is-idle');
      videoFrame.removeAttribute('src');
      if (modalPoster) modalPoster.classList.remove('is-hidden');
      if (modalPosterImg) modalPosterImg.removeAttribute('src');
      if (modalSpinnerText) modalSpinnerText.textContent = 'Loading film…';
      document.body.style.overflow = '';
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    };

    if (videoModal && videoFrame) {
      document.querySelectorAll('.js-video, [data-video]').forEach(btn => {
        if (!btn.dataset.videoBound) {
          btn.dataset.videoBound = 'true';
          btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              btn.click();
            }
          });
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const src = btn.dataset.video;
            if (!src) return;
            clearModalTimers();
            lastFocusedElement = btn;

            const thumbImg = btn.querySelector('img');
            const posterSrc = btn.dataset.img || (thumbImg ? thumbImg.src : '');
            if (modalSpinnerText) modalSpinnerText.textContent = 'Loading film…';
            if (modalPoster && modalPosterImg) {
              if (posterSrc) {
                modalPosterImg.src = posterSrc;
                modalPosterImg.style.display = 'block';
              } else {
                modalPosterImg.style.display = 'none';
              }
              modalPoster.classList.remove('is-hidden');
            }

            const join = src.includes('?') ? '&' : '?';
            const params = src.includes('vimeo.com')
              ? 'autoplay=1&dnt=1&playsinline=1&title=0&byline=0&portrait=0&badge=0&transparent=0&autopause=0'
              : 'autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&cc_load_policy=0&color=white&fs=1&enablejsapi=1';

            let ready = false;
            const onIframeLoaded = () => {
              if (ready) return;
              ready = true;
              clearModalTimers();
              setTimeout(() => {
                if (modalPoster && videoModal.classList.contains('open')) {
                  modalPoster.classList.add('is-hidden');
                }
                wakeModalControls();
              }, 180);
            };

            activeLoadHandler = onIframeLoaded;
            videoFrame.addEventListener('load', onIframeLoaded);
            slowTimer = setTimeout(() => {
              if (!ready && modalSpinnerText) {
                modalSpinnerText.textContent = 'Connecting stream…';
              }
            }, 1300);
            posterTimer = setTimeout(onIframeLoaded, 2400);

            videoFrame.src = src + join + params;
            videoModal.classList.add('open');
            wakeModalControls();
            document.body.style.overflow = 'hidden';
            modalClose?.focus();
          });
        }
      });

      if (modalClose && !modalClose.dataset.bound) {
        modalClose.dataset.bound = 'true';
        modalClose.addEventListener('click', closeVideo);
      }

      if (!videoModal.dataset.bound) {
        videoModal.dataset.bound = 'true';
        videoModal.addEventListener('mousemove', wakeModalControls, { passive: true });
        videoModal.addEventListener('touchstart', wakeModalControls, { passive: true });
        videoModal.addEventListener('click', (e) => {
          if (e.target === videoModal) closeVideo();
        });
        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && videoModal.classList.contains('open')) closeVideo();
        });
      }
    }

    // 3. Dynamic Year
    document.querySelectorAll('#year, [data-copyright-year]').forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });

    // 4. Shared Filters, Scroll Reveals, About Slider, Specular & Hero Kinetic
    initVideoFilters();
    initBlogFilters();
    initScrollReveals();
    initAboutSlider();
    initInteractiveSpecular();
    initHeroKinetic();

    // 5. Works Gallery & Article Navigation Initializers
    if (window.WWZWorksInit && typeof window.WWZWorksInit === 'function') {
      window.WWZWorksInit();
    }
    if (window.WWZArticleNavInit && typeof window.WWZArticleNavInit === 'function') {
      window.WWZArticleNavInit();
    }

    // 6. Article Code Block Copy & Back-to-Top Floating Button
    document.querySelectorAll('.copy-btn').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const codeBlock = btn.parentElement.querySelector('code') || btn.closest('pre')?.querySelector('code');
        if (!codeBlock) return;
        const text = codeBlock.innerText;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
          } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          const feedback = btn.parentElement.querySelector('.copy-feedback');
          if (feedback) feedback.classList.add('show');
          const orig = btn.innerHTML;
          btn.innerHTML = renderIconSVG('fa-check');
          setTimeout(() => {
            if (feedback) feedback.classList.remove('show');
            btn.innerHTML = orig;
          }, 2000);
        } catch (_) {}
      });
    });

    const fab = document.getElementById('back-to-top');
    if (fab && !fab.dataset.bound) {
      fab.dataset.bound = 'true';
      window.addEventListener('scroll', () => {
        fab.classList.toggle('visible', window.scrollY > 300);
      }, { passive: true });
      fab.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Re-run hydrate after dynamic scripts (like works.js / article-nav.js)
    hydrateIcons(document);
  };

  // Zero-Flicker Same-Origin PJAX Transition Engine
  let pjaxController = null;
  let pjaxBound = false;

  const loadScriptOnce = (src) =>
    new Promise((resolve) => {
      const existing = document.querySelector(`script[src="${src}"], script[data-pjax-src="${src}"]`);
      if (existing && existing.dataset.loaded === 'true') {
        resolve(true);
        return;
      }
      if (existing) existing.remove();
      const s = document.createElement('script');
      s.src = src;
      s.dataset.pjaxSrc = src;
      s.onload = () => {
        s.dataset.loaded = 'true';
        resolve(true);
      };
      s.onerror = () => {
        s.remove();
        resolve(false);
      };
      document.head.appendChild(s);
    });

  const navigatePjax = async (urlStr, pushState = true) => {
    const currentMain = document.getElementById('page-content') || document.querySelector('main');
    if (!currentMain) {
      location.href = urlStr;
      return;
    }

    const bar = ensureProgressBar();
    if (pjaxController) pjaxController.abort();
    pjaxController = new AbortController();

    bar.classList.add('is-loading');
    bar.style.width = '24%';

    try {
      const targetUrl = new URL(urlStr, location.href);
      const res = await fetch(targetUrl.href, {
        signal: pjaxController.signal,
        headers: { 'X-WWZ-PJAX': '1' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      bar.style.width = '68%';
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const nextMain = doc.getElementById('page-content') || doc.querySelector('main');
      if (!nextMain || doc.querySelector('meta[http-equiv="refresh"]')) {
        location.href = targetUrl.href;
        return;
      }

      if (typeof closeDrawerFn === 'function') closeDrawerFn();

      currentMain.classList.add('page-fade-out');
      await new Promise(r => setTimeout(r, 110));

      // Sync body attributes & class
      document.title = doc.title || document.title;
      document.body.className = doc.body.className || '';
      if (typeof doc.body.dataset.contentRoot === 'string') {
        document.body.dataset.contentRoot = doc.body.dataset.contentRoot;
      } else {
        delete document.body.dataset.contentRoot;
      }
      if (doc.body.dataset.activePage) {
        document.body.dataset.activePage = doc.body.dataset.activePage;
      } else {
        delete document.body.dataset.activePage;
      }

      // Sync page-level inline styles cleanly
      document.querySelectorAll('style[data-pjax-style]').forEach(s => s.remove());
      doc.querySelectorAll('head > style:not([data-theme-startup])').forEach(st => {
        const clone = document.createElement('style');
        clone.dataset.pjaxStyle = 'true';
        clone.textContent = st.textContent;
        document.head.appendChild(clone);
      });

      // Swap main container & any modal if present cleanly
      currentMain.replaceWith(document.importNode(nextMain, true));
      const newMain = document.getElementById('page-content') || document.querySelector('main');
      const existingModal = document.getElementById('videoModal');
      const nextModal = doc.getElementById('videoModal');
      if (nextModal && !existingModal) {
        document.body.appendChild(document.importNode(nextModal, true));
      }

      if (pushState) {
        history.pushState({ url: targetUrl.href }, '', targetUrl.href);
      }

      const nextRoot = getRoot();
      if (nextMain.querySelector('#portfolioGrid')) {
        if (!window.WWZ_WORKS) {
          await loadScriptOnce(`${nextRoot}data/works-data.js`);
        }
        if (!window.WWZWorksInit) {
          await loadScriptOnce(`${nextRoot}js/works.js`);
        }
      }
      if (/\/articles\//.test(targetUrl.pathname) && !window.WWZArticleNavInit) {
        await loadScriptOnce(`${nextRoot}js/article-nav.js`);
      }

      mountNav();
      initPageComponents();

      if (targetUrl.hash) {
        const anchor = document.querySelector(targetUrl.hash);
        if (anchor) anchor.scrollIntoView({ behavior: 'auto' });
        else window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
      window.dispatchEvent(new Event('scroll'));

      newMain?.classList.remove('page-fade-out');
      newMain?.classList.add('page-fade-in');
      bar.style.width = '100%';
      setTimeout(() => {
        bar.classList.remove('is-loading');
        bar.style.width = '0%';
      }, 220);
    } catch (err) {
      if (err.name === 'AbortError') return;
      bar.classList.remove('is-loading');
      bar.style.width = '0%';
      location.href = urlStr;
    }
  };

  const initPjax = () => {
    if (pjaxBound) return;
    pjaxBound = true;

    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest('a[href]');
      if (!link) return;
      if (link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const rawHref = link.getAttribute('href') || '';
      if (!rawHref || rawHref.startsWith('#') || /^(?:mailto:|tel:|javascript:)/i.test(rawHref)) return;

      let dest;
      try { dest = new URL(link.href, location.href); } catch (_) { return; }
      if (dest.origin !== location.origin) return;
      if (/\/projects(?:\/|$)/i.test(dest.pathname)) return;
      if (dest.pathname === location.pathname && dest.search === location.search) return;

      e.preventDefault();
      navigatePjax(dest.href, true);
    });

    window.addEventListener('popstate', () => {
      navigatePjax(location.href, false);
    });
  };

  const onReady = () => {
    mountNav();
    initPageComponents();
    updateThemeIcons(false);
    initPjax();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
