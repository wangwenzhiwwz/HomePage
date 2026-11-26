/* Shared, pre-paint theme preference: system → light → dark. */
(() => {
  const root = document.documentElement;
  const media = matchMedia('(prefers-color-scheme: dark)');
  const key = 'wwz-theme-mode';
  const modes = ['system', 'light', 'dark'];
  const read = () => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  let mode = modes.includes(read()) ? read() : 'system';
  const apply = () => {
    const theme = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
    root.dataset.theme = theme;
    root.dataset.themeMode = mode;
    root.style.colorScheme = theme;
    root.style.backgroundColor = theme === 'dark' ? '#000000' : '#f7f7f5';
    root.style.setProperty('--wwz-initial-bg', root.style.backgroundColor);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.style.backgroundColor);
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme);
    document.querySelectorAll('[data-shell-theme]').forEach(button => {
      const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-label', label);
      button.title = label;
    });
    if (typeof window.WWZShellSyncTheme === 'function') {
      window.WWZShellSyncTheme();
    }
    document.querySelector('.wwz-route-frame')?.contentWindow?.postMessage({ type: 'wwz:theme', theme }, location.origin);
  };
  window.WWZTheme = {
    refresh: apply,
    cycle() {
      mode = modes[(modes.indexOf(mode) + 1) % modes.length];
      try { localStorage.setItem(key, mode); } catch (_) {}
      apply();
    }
  };
  media.addEventListener('change', () => { if (mode === 'system') apply(); });
  addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    mode = modes.includes(read()) ? read() : 'system';
    apply();
  });
  apply();
  // Initial theme must paint without interpolating through a light/gray canvas.
  const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    root.dataset.themeReady = 'true';
  }));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once:true });
  else ready();
})();
