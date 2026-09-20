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
    root.style.backgroundColor = theme === 'dark' ? '#0b0b0a' : '#f7f7f5';
    root.style.setProperty('--wwz-initial-bg', root.style.backgroundColor);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.style.backgroundColor);
    document.querySelectorAll('[data-shell-theme]').forEach(button => {
      const names = { system: '跟随系统', light: '浅色', dark: '深色' };
      const next = modes[(modes.indexOf(mode) + 1) % modes.length];
      button.setAttribute('aria-label', `主题：${names[mode]}；切换为${names[next]}`);
      button.title = `主题：${names[mode]} · 点击切换为${names[next]}`;
      const shapes = {
        system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
        light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
        dark: '<path d="M20.5 13.1A8.5 8.5 0 0 1 10.9 3.5a8.5 8.5 0 1 0 9.6 9.6Z"/>'
      };
      const labels = { system: 'Auto', light: 'Light', dark: 'Dark' };
      button.innerHTML = `<svg class="wwz-theme-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[mode]}</svg><span class="wwz-theme-label" aria-hidden="true">${labels[mode]}</span>`;
    });
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
