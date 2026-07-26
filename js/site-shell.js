(function () {
  const root = document.body?.dataset.contentRoot || "";
  const embedded = window.self !== window.top;
  const initialUrl = new URL(location.href);
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
        <span><strong>Wang Wenzhi</strong><small>@WWZ.iM</small></span>
      </a>
      <div class="wwz-mobile-controls">
        <button class="wwz-icon-button" type="button" data-shell-theme aria-label="切换明暗主题"><i class="fa-solid fa-circle-half-stroke"></i></button>
        <button class="wwz-icon-button" type="button" data-shell-menu aria-label="打开导航" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
      </div>
    </div>
    <div class="wwz-sidebar-content">
      <div class="wwz-nav-label">Menu</div>
      <nav class="wwz-nav">
        ${item("home",`${root}index.html`,"fa-solid fa-house","Home")}
        ${item("videos",`${root}videos/`,"fa-solid fa-film","Videos")}
        ${item("blog",`${root}article.html`,"fa-solid fa-note-sticky","Blog")}
        ${item("works",`${root}portfolio-masonry.html`,"fa-solid fa-layer-group","Works")}
        ${item("contact",`${root}index.html#contact`,"fa-solid fa-paper-plane","Contact")}
      </nav>
      <div class="wwz-nav-label">Resources</div>
      <nav class="wwz-nav">
        <a href="https://blog.wwz.im/" target="_blank" rel="noopener noreferrer" class="wwz-nav-link"><i class="fa-brands fa-blogger"></i><span>External Blog</span></a>
        <a href="https://app.wwz.im/" target="_blank" rel="noopener noreferrer" class="wwz-nav-link"><i class="fa-solid fa-compass"></i><span>App Nav</span></a>
      </nav>
      <div class="wwz-socials">
        <a href="https://x.com/wwz_im" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
        <a href="https://github.com/wangwenzhiwwz" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
        <a href="https://www.youtube.com/@wangwenzhi" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        <a href="mailto:wwz.im@outlook.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
      </div>
    </div>`;

  const mount = () => {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    if (sidebar.dataset.shellMounted === "true") return;
    sidebar.dataset.shellMounted = "true";
    sidebar.id = "sidebar";
    sidebar.setAttribute("aria-label", "主要导航");
    sidebar.innerHTML = template;

    const menu = sidebar.querySelector("[data-shell-menu]");
    const scrim = !embedded ? document.body.appendChild(Object.assign(document.createElement("button"), {
      className: "wwz-menu-scrim",
      type: "button",
      ariaLabel: "关闭导航"
    })) : null;
    const closeMenu = () => {
      sidebar.classList.remove("sidebar-open");
      document.documentElement.classList.remove("wwz-menu-open");
      menu?.setAttribute("aria-expanded", "false");
      if (menu) menu.querySelector("i").className = "fa-solid fa-bars";
    };
    menu?.addEventListener("click", () => {
      const open = sidebar.classList.toggle("sidebar-open");
      document.documentElement.classList.toggle("wwz-menu-open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    });
    scrim?.addEventListener("click", closeMenu);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && sidebar.classList.contains("sidebar-open")) {
        closeMenu();
        menu?.focus();
      }
    });
    sidebar.querySelectorAll("a").forEach(link => link.addEventListener("click", event => {
      closeMenu();
      if (link.matches('[aria-current="page"]')) event.preventDefault();
    }));

    sidebar.querySelector("[data-shell-theme]")?.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#0b0b0a" : "#f7f7f5");
      document.querySelector(".wwz-route-frame")?.contentWindow?.postMessage({ type: "wwz:theme", theme: next }, location.origin);
    });

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

    sidebar.querySelectorAll("[data-shell-route]").forEach(link => {
      link.dataset.shellHref = link.href;
      link.addEventListener("click", event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateWithoutReload(sidebar, new URL(link.dataset.shellHref), true);
      });
    });

    addEventListener("popstate", () => navigateWithoutReload(sidebar, new URL(location.href), false));
    addEventListener("message", event => {
      if (event.origin !== location.origin || event.data?.type !== "wwz:navigate") return;
      navigateWithoutReload(sidebar, new URL(event.data.href), true);
    });
  };

  const navigateWithoutReload = (sidebar, url, push) => {
    if (url.origin !== location.origin) {
      location.href = url.href;
      return;
    }

    const isInitialDocument = url.pathname === initialUrl.pathname && url.search === initialUrl.search;
    const existingFrame = document.querySelector(".wwz-route-frame");

    if (push) history.pushState({ wwzRoute: url.href }, "", url.href);
    updateActiveRoute(sidebar, url);
    sidebar.classList.remove("sidebar-open");
    document.documentElement.classList.remove("wwz-menu-open");

    if (isInitialDocument) {
      existingFrame?.remove();
      document.documentElement.classList.remove("wwz-route-active");
      document.querySelector("body > main")?.removeAttribute("aria-hidden");
      if (url.hash) document.querySelector(url.hash)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const frame = existingFrame || document.body.appendChild(Object.assign(document.createElement("iframe"), {
      className: "wwz-route-frame",
      title: "Website content"
    }));
    document.documentElement.classList.add("wwz-route-active");
    document.querySelector("body > main")?.setAttribute("aria-hidden", "true");
    frame.classList.remove("is-ready");
    frame.onload = () => {
      try {
        frame.contentDocument.documentElement.classList.add("wwz-embedded");
        document.title = frame.contentDocument.title;
        frame.contentDocument.documentElement.dataset.theme = document.documentElement.dataset.theme || "light";
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
      if (event.origin === location.origin && event.data?.type === "wwz:theme") {
        document.documentElement.dataset.theme = event.data.theme;
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
