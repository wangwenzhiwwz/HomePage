(() => {
  const portfolioItems = window.WWZ_WORKS || [];
  const labels = { video: 'Campaign Stills', photo: 'Photography' };
  const grid = document.getElementById('portfolioGrid');
  const dialog = document.getElementById('imageViewer');
  const image = document.getElementById('viewerImage');
  const stage = document.getElementById('viewerStage');
  const status = document.getElementById('viewerStatus');
  const zoom = document.getElementById('viewerZoom');
  const previous = document.getElementById('viewerPrevious');
  const next = document.getElementById('viewerNext');
  let visible = portfolioItems;
  let current = 0;
  let opener = null;
  let pointer = null;
  const setZoom = enabled => {
    stage.classList.toggle('is-zoomed', enabled);
    zoom.setAttribute('aria-pressed', String(enabled));
    zoom.textContent = enabled ? 'Zoom −' : 'Zoom +';
    zoom.setAttribute('aria-label', enabled ? 'Fit image to screen' : 'Zoom image');
    stage.scrollTo(0, 0);
  };
  const show = index => {
    current = (index + visible.length) % visible.length;
    const item = visible[current];
    setZoom(false);
    stage.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading image…';
    zoom.disabled = true;
    document.getElementById('viewerTitle').textContent = item.title;
    document.getElementById('viewerPosition').textContent = (current + 1) + ' / ' + visible.length + ' · ' + labels[item.category];
    image.alt = item.title;
    image.src = item.image;
    previous.disabled = next.disabled = visible.length < 2;
  };
  image.addEventListener('load', () => {
    stage.setAttribute('aria-busy', 'false');
    status.textContent = '';
    zoom.disabled = false;
  });
  image.addEventListener('error', () => {
    stage.setAttribute('aria-busy', 'false');
    status.textContent = 'Image unavailable. Please try another image.';
    zoom.disabled = true;
  });
  portfolioItems.forEach(item => {
    const wrapper = document.createElement('div');
    wrapper.className = 'portfolio-item';
    wrapper.dataset.category = item.category;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portfolio-card';
    button.setAttribute('aria-label', 'View ' + item.title);
    button.setAttribute('aria-haspopup', 'dialog');
    button.innerHTML = `<span class="portfolio-media"><img src="${item.image}" alt="${item.title}" class="portfolio-img" loading="lazy" decoding="async" width="800" height="600"></span><span class="portfolio-info"><span><strong>${item.title}</strong><small>${labels[item.category]}</small></span><span class="portfolio-open" aria-hidden="true">↗</span></span>`;
    button.addEventListener('click', () => {
      opener = button;
      show(visible.indexOf(item));
      dialog.showModal();
    });
    wrapper.append(button);
    grid.append(wrapper);
  });
  const updateCount = () => { document.getElementById('worksCount').textContent = visible.length + ' works'; };
  updateCount();
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      visible = portfolioItems.filter(item => category === 'all' || item.category === category);
      document.querySelectorAll('[data-filter]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
      grid.querySelectorAll('.portfolio-item').forEach(item => { item.hidden = category !== 'all' && item.dataset.category !== category; });
      updateCount();
    });
  });
  document.getElementById('viewerClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { setZoom(false); opener?.focus({ preventScroll: true }); });
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  zoom.addEventListener('click', () => setZoom(!stage.classList.contains('is-zoomed')));
  image.addEventListener('click', () => { if (!zoom.disabled) zoom.click(); });
  stage.addEventListener('click', event => { if (event.target === stage) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (stage.classList.contains('is-zoomed')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  stage.addEventListener('touchstart', event => {
    pointer = event.touches.length === 1 && !stage.classList.contains('is-zoomed') ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!pointer || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - pointer.x;
    const dy = event.changedTouches[0].clientY - pointer.y;
    pointer = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { pointer = null; });
})();
