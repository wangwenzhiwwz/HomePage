(function () {
  const root = document.body?.dataset.contentRoot || "";
  const embedded = window.self !== window.top;
  const initialUrl = new URL(location.href);
  const initialTitle = document.title;
  const canonicalPath = url => url.pathname.replace(/\/index\.html$/, '/');
  // Keep relative assets stable when the persistent navigation changes the URL.
  if (!document.querySelector('base')) {
    const base = document.createElement('base');
    base.href = initialUrl.href;
    document.head.prepend(base);
  }
  const active = document.body?.dataset.activePage || (
    location.pathname.includes("/videos/") ? "videos" :
    location.pathname.includes("/article") || location.pathname.endsWith("/article.html") ? "blog" :
    location.pathname.includes("portfolio") ? "works" : "home"
  );

  const item = (key, href, icon, label) => `
    <a href="${href}" data-shell-route="${key}" class="wwz-nav-link${active === key ? " active" : ""}"${active === key ? ' aria-current="page"' : ""}>
      <i class="${icon}" aria-hidden="true"></i><span>${label}</span>
    </a>`;

  const template = `
    <div class="wwz-sidebar-head">
      <a class="wwz-sidebar-brand" href="${root}index.html">
        <img src="${root}favicon.png" alt="WWZ Logo">
        <span><strong>WWZ.iM</strong></span>
      </a>
      <div class="wwz-mobile-controls">
        <button class="wwz-icon-button" type="button" data-shell-theme aria-label="切换明暗主题"><i class="fa-solid fa-circle-half-stroke"></i></button>
        <button class="wwz-menu-button" type="button" data-shell-menu aria-label="打开导航" aria-expanded="false">Menu</button>
      </div>
    </div>
    <div class="wwz-sidebar-content" id="wwz-navigation">
      <nav class="wwz-nav wwz-primary-nav" aria-label="Main navigation">
        ${item("home",`${root}index.html`,"fa-solid fa-house","Home")}
        ${item("videos",`${root}videos/`,"fa-solid fa-film","Videos")}
        ${item("blog",`${root}article.html`,"fa-solid fa-note-sticky","Blog")}
        ${item("works",`${root}portfolio-masonry.html`,"fa-solid fa-layer-group","Works")}
        ${item("contact",`${root}index.html#contact`,"fa-solid fa-paper-plane","Contact")}
      </nav>
      <details class="wwz-resources"><summary>Resources <span aria-hidden="true">⌄</span></summary><div class="wwz-resources-panel">
      <nav class="wwz-nav">
        <a href="https://blog.wwz.im/" target="_blank" rel="noopener noreferrer" class="wwz-nav-link"><i class="fa-brands fa-blogger"></i><span>External Blog</span></a>
        <a href="https://app.wwz.im/" target="_blank" rel="noopener noreferrer" class="wwz-nav-link"><i class="fa-solid fa-compass"></i><span>App Nav</span></a>
      </nav>
      <div class="wwz-socials">
        <a href="https://x.com/wwz_im" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
        <a href="https://github.com/wangwenzhiwwz" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
        <a href="https://www.youtube.com/@wangwenzhi" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        <a href="mailto:wwz.im@outlook.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
      </div></div></details>
    </div>`;

  const mount = () => {
    document.querySelectorAll('[data-copyright-year]').forEach(node => {
      node.textContent = String(new Date().getFullYear());
    });
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    if (sidebar.dataset.shellMounted === "true") return;
    sidebar.dataset.shellMounted = "true";
    sidebar.id = "sidebar";
    sidebar.classList.add("wwz-topbar");
    sidebar.setAttribute("aria-label", "主要导航");
    sidebar.innerHTML = template;
    updateActiveRoute(sidebar, new URL(location.href));

    // Keep resources in the page flow, including independently loaded articles.
    const resources = sidebar.querySelector('.wwz-resources');
    const main = document.querySelector('body > main');
    if (resources && main && !main.querySelector('.wwz-footer-resources')) {
      const footer = document.createElement('footer');
      footer.className = 'wwz-footer-resources';
      footer.setAttribute('aria-label', 'Resources');
      const heading = document.createElement('h2');
      heading.textContent = 'Resources';
      footer.append(heading, resources.querySelector('.wwz-resources-panel'));
      main.append(footer);
      resources.remove();
    }

    const menu = sidebar.querySelector("[data-shell-menu]");
    menu?.setAttribute('aria-controls', 'wwz-navigation');
    const scrim = !embedded ? document.body.appendChild(Object.assign(document.createElement("button"), {
      className: "wwz-menu-scrim",
      type: "button",
      ariaLabel: "关闭导航"
    })) : null;
    if (scrim) scrim.tabIndex = -1;
    const setBackgroundInert = value => {
      document.querySelectorAll('body > main, .wwz-route-frame').forEach(el => { el.inert = value; });
    };
    const closeMenu = () => {
      setBackgroundInert(false);
      sidebar.classList.remove("sidebar-open");
      document.documentElement.classList.remove("wwz-menu-open");
      menu?.setAttribute("aria-expanded", "false");
      menu?.setAttribute("aria-label", "打开导航");
      sidebar.querySelector('.wwz-resources')?.removeAttribute('open');
      if (menu) menu.textContent = "Menu";
    };
    menu?.addEventListener("click", () => {
      const open = sidebar.classList.toggle("sidebar-open");
      document.documentElement.classList.toggle("wwz-menu-open", open);
      setBackgroundInert(open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
      menu.textContent = open ? "Close" : "Menu";
    });
    scrim?.addEventListener("click", closeMenu);
    matchMedia('(min-width: 1100px)').addEventListener('change', closeMenu);
    document.addEventListener('click', event => {
      if (!sidebar.contains(event.target)) sidebar.querySelector('.wwz-resources')?.removeAttribute('open');
    });
    document.addEventListener("keydown", event => {
      if (event.key === 'Tab' && sidebar.classList.contains('sidebar-open')) {
        const controls = [...sidebar.querySelectorAll('a[href], button, summary')].filter(el => el.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
      if (event.key === "Escape" && sidebar.classList.contains("sidebar-open")) {
        closeMenu();
        menu?.focus();
      }
    });
    sidebar.querySelectorAll("a").forEach(link => link.addEventListener("click", event => {
      closeMenu();
      // An active section can still link from its article back to the listing.
    }));

    window.WWZTheme?.refresh();
    sidebar.querySelector("[data-shell-theme]")?.addEventListener("click", () => window.WWZTheme?.cycle());

    if (!embedded) setupPersistentNavigation(sidebar);
  };

  const routeKey = url => (
    url.pathname.includes("/videos/") ? "videos" :
    url.pathname.includes("/article") || url.pathname.endsWith("/article.html") ? "blog" :
    url.pathname.includes("portfolio") ? "works" :
    url.hash === "#contact" ? "contact" : "home"
  );

  const updateActiveRoute = (sidebar, url) => {
    const key = routeKey(url);
    sidebar.querySelectorAll("[data-shell-route]").forEach(link => {
      const current = link.dataset.shellRoute === key;
      link.classList.toggle("active", current);
      if (current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  const setupPersistentNavigation = sidebar => {
    if (sidebar.dataset.shellNavigationReady === "true") return;
    sidebar.dataset.shellNavigationReady = "true";

    sidebar.querySelectorAll("[data-shell-route], .wwz-sidebar-brand").forEach(link => {
      link.dataset.shellHref = link.href;
      link.addEventListener("click", event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateWithoutReload(sidebar, new URL(link.dataset.shellHref), true);
      });
    });

    addEventListener("popstate", () => navigateWithoutReload(sidebar, new URL(location.href), false));
    addEventListener("hashchange", () => updateActiveRoute(sidebar, new URL(location.href)));
    addEventListener("message", event => {
      if (event.origin !== location.origin || event.source !== document.querySelector('.wwz-route-frame')?.contentWindow || event.data?.type !== "wwz:navigate") return;
      if (typeof event.data.href !== 'string') return;
      try {
        const url = new URL(event.data.href);
        if (url.origin === location.origin) navigateWithoutReload(sidebar, url, true);
      } catch (_) { /* Ignore malformed navigation messages. */ }
    });
  };

  const navigateWithoutReload = (sidebar, url, push) => {
    if (url.origin !== location.origin) {
      location.href = url.href;
      return;
    }

    const isInitialDocument = canonicalPath(url) === canonicalPath(initialUrl) && url.search === initialUrl.search;
    const existingFrame = document.querySelector(".wwz-route-frame");

    if (push && url.href !== location.href) history.pushState({ wwzRoute: url.href }, "", url.href);
    updateActiveRoute(sidebar, url);
    sidebar.classList.remove("sidebar-open");
    document.documentElement.classList.remove("wwz-menu-open");
    const menu = sidebar.querySelector('[data-shell-menu]');
    if (menu) { menu.textContent = 'Menu'; menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','打开导航'); }

    if (isInitialDocument) {
      existingFrame?.remove();
      document.documentElement.classList.remove("wwz-route-active");
      document.querySelector("body > main")?.removeAttribute("aria-hidden");
      const main = document.querySelector('body > main');
      if (main) main.inert = false;
      document.title = initialTitle;
      if (url.hash) {
        let id = url.hash.slice(1);
        try { id = decodeURIComponent(id); } catch (_) {}
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
      else window.scrollTo(0,0);
      return;
    }

    const frame = existingFrame || document.body.appendChild(Object.assign(document.createElement("iframe"), {
      className: "wwz-route-frame",
      title: "Website content"
    }));
    document.documentElement.classList.add("wwz-route-active");
    document.querySelector("body > main")?.setAttribute("aria-hidden", "true");
    const main = document.querySelector('body > main');
    if (main) main.inert = true;
    frame.inert = false;
    frame.classList.remove("is-ready");
    frame.onload = () => {
      try {
        frame.contentDocument.documentElement.classList.add("wwz-embedded");
        document.title = frame.contentDocument.title;
        frame.title = frame.contentDocument.title;
        frame.contentDocument.documentElement.dataset.theme = document.documentElement.dataset.theme || "light";
        frame.contentDocument.documentElement.style.colorScheme = document.documentElement.dataset.theme || "light";
      } catch (_) {}
      frame.classList.add("is-ready");
    };
    // Replace the frame location so only the top-level pushState entry is
    // added to session history. This keeps Back/Forward predictable.
    frame.contentWindow.location.replace(url.href);
  };

  if (embedded) {
    document.documentElement.classList.add("wwz-embedded");
    addEventListener("message", event => {
      if (event.origin === location.origin && event.source === parent && event.data?.type === "wwz:theme" && ['dark','light'].includes(event.data.theme)) {
        document.documentElement.dataset.theme = event.data.theme;
        document.documentElement.style.colorScheme = event.data.theme;
      }
    });
    document.addEventListener("click", event => {
      const link = event.target.closest("a[href]");
      if (!link || link.target || link.hasAttribute("download") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search && url.hash)) return;
      event.preventDefault();
      parent.postMessage({ type: "wwz:navigate", href: url.href }, location.origin);
    });
  }

  // The script is loaded at the end of each page, so mount immediately and
  // keep the same sidebar DOM for the lifetime of this document.
  mount();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once:true });
})();
