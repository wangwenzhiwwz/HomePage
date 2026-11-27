/* Shared, pre-paint theme preference: smart Auto (System) ↔ Light ↔ Dark. */
(() => {
  const root = document.documentElement;
  const media = matchMedia('(prefers-color-scheme: dark)');
  const key = 'wwz-theme-mode';
  const modes = ['system', 'light', 'dark'];
  const read = () => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  let mode = modes.includes(read()) ? read() : 'system';
  let transitionTimer = null;

  const animateSwitch = () => {
    root.classList.add('theme-transitioning');
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 320);
  };

  const getSystemTheme = () => (media.matches ? 'dark' : 'light');

  const apply = (animate = false) => {
    const systemTheme = getSystemTheme();
    const theme = mode === 'system' ? systemTheme : mode;
    if (animate) animateSwitch();
    root.dataset.theme = theme;
    root.dataset.themeMode = mode;
    root.style.colorScheme = theme;
    root.style.backgroundColor = theme === 'dark' ? '#000000' : '#f7f7f5';
    root.style.setProperty('--wwz-initial-bg', root.style.backgroundColor);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.style.backgroundColor);
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme);
    document.querySelectorAll('[data-shell-theme]').forEach(button => {
      const label = mode === 'system'
        ? `Auto (${theme === 'dark' ? 'Dark' : 'Light'}) — Click to switch`
        : `${theme === 'dark' ? 'Dark' : 'Light'} Mode — Click to switch`;
      button.setAttribute('aria-label', label);
      button.title = label;
    });
    if (typeof window.WWZShellSyncTheme === 'function') {
      window.WWZShellSyncTheme();
    }
    document.querySelector('.wwz-route-frame')?.contentWindow?.postMessage({ type: 'wwz:theme', theme, mode }, location.origin);
  };

  window.WWZTheme = {
    getState() {
      const systemTheme = getSystemTheme();
      return {
        mode,
        theme: mode === 'system' ? systemTheme : mode,
        systemTheme
      };
    },
    setMode(nextMode, animate = true) {
      if (!modes.includes(nextMode)) return;
      mode = nextMode;
      try { localStorage.setItem(key, mode); } catch (_) {}
      apply(animate);
    },
    refresh() {
      apply(false);
    },
    cycle() {
      const sys = getSystemTheme();
      const order = ['system', sys === 'dark' ? 'light' : 'dark', sys];
      mode = order[(order.indexOf(mode) + 1) % order.length];
      try { localStorage.setItem(key, mode); } catch (_) {}
      apply(true);
    }
  };

  const onMediaChange = () => { if (mode === 'system') apply(true); };
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', onMediaChange);
  } else if (typeof media.addListener === 'function') {
    media.addListener(onMediaChange);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && mode === 'system') apply(false);
  });

  addEventListener('pageshow', () => {
    if (mode === 'system') apply(false);
  });

  addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    mode = modes.includes(read()) ? read() : 'system';
    apply(true);
  });

  apply(false);

  // Initial theme must paint without interpolating through a light/gray canvas.
  const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    root.dataset.themeReady = 'true';
  }));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
