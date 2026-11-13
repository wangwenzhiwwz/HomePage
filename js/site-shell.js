(function () {
  const root = document.body?.dataset.contentRoot || "/";
  const embedded = window.self !== window.top;
  const initialUrl = new URL(location.href);
  const initialTitle = document.title;

  // Keep page navigation native; only the active navigation pill animates.
  const canonicalPath = url => url.pathname.replace(/\/index\.html$/, '/');
  // Keep relative assets stable when the persistent navigation changes the URL.
  if (!document.querySelector('base')) {
    const base = document.createElement('base');
    base.href = initialUrl.href;
    document.head.prepend(base);
  }
  const active = (document.body?.dataset.activePage) || (
    location.pathname.includes("/videos/") ? "videos" :
    location.pathname.includes("/article") || location.pathname.includes("/articles/") || location.pathname.includes("/topics/") || location.pathname.endsWith("/blog.html") ? "blog" :
    location.pathname.endsWith("/works.html") ? "works" : "home"
  );

  const item = (key, href, icon, label) => `
    <a href="${href}" data-shell-route="${key}" class="wwz-nav-link${active === key ? " active" : ""}"${active === key ? ' aria-current="page"' : ""}>
      <i class="${icon}" aria-hidden="true"></i><span>${label}</span>
    </a>`;

  const template = `
    <div class="wwz-sidebar-head">
      <a class="wwz-sidebar-brand" href="${root}index.html"><img src="${root}favicon.png" alt="WWZ Logo"><span><strong>WWZ.iM</strong></span></a>
      <div class="wwz-mobile-controls">
        <button class="wwz-icon-button" type="button" data-shell-theme aria-label="Toggle color theme"><i class="fa-solid fa-circle-half-stroke"></i></button>
        <button class="wwz-menu-button" type="button" data-shell-menu aria-label="Open navigation" aria-expanded="false">Menu</button>
      </div>
    </div>
    <div class="wwz-sidebar-content" id="wwz-navigation">
      <div class="wwz-nav-group"><p class="wwz-nav-label">Main navigation <span>MAIN</span></p><nav class="wwz-nav wwz-primary-nav" aria-label="Main navigation">
        ${item("home",root+"index.html","fa-solid fa-house","Home")}
        ${item("works",root+"works.html","fa-solid fa-layer-group","Works")}
        ${item("videos",root+"videos/","fa-solid fa-film","Videos")}
        ${item("blog",root+"blog.html","fa-solid fa-book-open","Blog")}
        ${item("about",root+"about.html","fa-solid fa-user","About")}
      </nav></div>
      <div class="wwz-nav-group"><p class="wwz-nav-label">Explore <span>EXPLORE</span></p>
        <details class="wwz-nav-folder"><summary><span><i class="fa-solid fa-layer-group"></i> Works sections</span><i class="fa-solid fa-chevron-down"></i></summary><nav class="wwz-nav-sub" aria-label="Works sections">
          <a href="${root}works.html#portfolio">Selected Work</a><a href="${root}works.html#projects">Digital Projects</a><a href="${root}blog.html">Blog & Guides</a>
        </nav></details>
        <details class="wwz-nav-folder"><summary><span><i class="fa-solid fa-lightbulb"></i> Topics & Learning</span><i class="fa-solid fa-chevron-down"></i></summary><nav class="wwz-nav-sub" aria-label="Topics & Learning"><a href="${root}lab/">AI Lab</a><a href="${root}topics/ai-comfyui/">ComfyUI / Local AI</a><a href="${root}now.html">Now · Current Focus</a><a href="${root}works.html#guides">Blog & Guides</a></nav></details>
      </div>
      <div class="wwz-nav-group wwz-nav-contact"><p class="wwz-nav-label">Connect <span>CONNECT</span></p>
        <a class="wwz-nav-link" href="${root}index.html#contact"><i class="fa-solid fa-paper-plane"></i><span>Contact</span></a>
        <details class="wwz-resources"><summary>External Links <i class="fa-solid fa-chevron-down"></i></summary><div class="wwz-resources-panel">
          <nav class="wwz-nav"><a href="https://blog.wwz.im/" target="_blank" rel="noopener noreferrer" class="wwz-nav-link"><i class="fa-brands fa-blogger"></i><span>External Blog</span></a><a href="https://app.wwz.im/" target="_blank" rel="noopener noreferrer" class="wwz-nav-link"><i class="fa-solid fa-compass"></i><span>App Directory</span></a></nav>
          <div class="wwz-socials"><a href="https://x.com/wwz_im" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a><a href="https://github.com/wangwenzhiwwz" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fa-brands fa-github"></i></a><a href="https://www.youtube.com/@wangwenzhi" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a><a href="mailto:wwz.im@outlook.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a></div>
        </div></details>
      </div>
    </div>`;

  const mountPageExperience = () => {
    const path = location.pathname;
    const isHome = path === "/" || path.endsWith("/index.html") && !/\/(projects|lab|topics|articles|videos)\//.test(path);
    const main = document.querySelector("main, .main-content, article");
    if (!main) return;
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/css/page-experience.css?v=20261113-video-hero-color-refined";
    if (!document.querySelector('link[href*="page-experience.css"]')) document.head.append(stylesheet);

    if (isHome) {
      if (main.querySelector(".wwz-quick-links")) return;
      const hero = main.querySelector(".hero");
      if (!hero) return;
      const banner = document.createElement("section");
      banner.className = "wwz-home-banner";
      banner.innerHTML = '<div><span>WWZ.iM · CREATIVE / BUILD / EXPLORE</span><h2>Visual stories.<br>Useful technology.</h2><p>A personal space for commercial video, AI workflows, independent tools and practical technical notes.</p><a href="/works.html">Explore selected work ↗</a></div>';
      hero.insertAdjacentElement("afterend", banner);
      const section = document.createElement("section");
      section.className = "wwz-quick-links";
      section.setAttribute("aria-label", "Explore WWZ.iM");
      section.innerHTML = [
        ['01','WATCH','Selected Works','Photography, commercial films and visual experiments.','Explore the portfolio','/works.html','fa-solid fa-camera'],
        ['02','BUILD','Projects & Tools','Useful web apps, independent products and open-source experiments.','Browse practical tools','/projects/','fa-solid fa-cubes'],
        ['03','EXPERIMENT','AI Lab','ComfyUI workflows, image-to-video tests and product-consistency methods.','View AI workflows','/lab/','fa-solid fa-wand-magic-sparkles'],
        ['04','LEARN','Guides & Notes','Deployment tutorials, technical checklists and lessons from real projects.','Read field notes','/blog.html','fa-solid fa-book-open'],
        ['05','CURRENT','Now','What is being built, tested and explored at the moment.','See current focus','/now.html','fa-solid fa-compass'],
        ['06','ABOUT','About','Background, working approach, selected capabilities and contact details.','More about WWZ','/about.html','fa-solid fa-user']
      ].map(([n,k,t,d,cta,u,icon]) => '<a class="wwz-quick-link" href="'+u+'"><div class="wwz-quick-top"><span class="wwz-quick-number">'+n+'</span><span class="wwz-quick-icon"><i class="'+icon+'" aria-hidden="true"></i></span></div><div class="wwz-quick-copy"><small>'+k+'</small><strong>'+t+'</strong><span>'+d+'</span></div><span class="wwz-quick-cta">'+cta+' <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span></a>').join('');
      const contactSection = main.querySelector("#contact, .contact-section");
      if (contactSection) contactSection.insertAdjacentElement("beforebegin", section);
      else main.append(section);
      return;
    }

    if (main.querySelector(".wwz-page-banner")) return;
    if (path.endsWith("/works.html") && main.querySelector(".works-hub-hero")) return;
    const detail = path.includes("/projects/") && path.split("/").filter(Boolean).length > 1;
    const map = [
      [/\/projects\//,{section:detail?"tool":"projects",kicker:detail?"PROJECT FIELD GUIDE":"INDEPENDENT PRODUCTS",copy:detail?"Understand the use case, follow a practical start path and check important limitations before relying on a tool.":"Small independent products designed around real tasks — with clear use cases, practical instructions and honest limitations.",links:[["Projects","/works.html#projects"],["Guides","/works.html#guides"]]}],
      [/\/lab\//,{section:"lab",kicker:"AI LAB · RESEARCH & PRODUCTION",copy:"Turn generative experiments into repeatable production workflows: dependencies, inputs, quality checks and recovery steps.",links:[["ComfyUI topic","/topics/ai-comfyui/"],["Workstation notes","/articles/comfyui-local-video/"]]}],
      [/\/topics\/|\/articles\//,{section:"lab",kicker:"PRACTICAL KNOWLEDGE",copy:"A working reference for decisions, setup steps, validation and troubleshooting — not just a collection of tool names.",links:[["AI Lab","/lab/"],["All guides","/works.html#guides"]]}],
      [/\/videos\//,{section:"videos",kicker:"COMMERCIAL VIDEO · STORY & CRAFT",title:"Product films.<br>Stories that move.",copy:"Selected product films shaped around the product, the people and the details that make each story matter.",links:[["Selected works","/works.html"],["About the process","/about.html"]]}],
      [/works\.html|\/works\//,{section:"works",kicker:"CREATIVE WORK · DIGITAL PROJECTS · GUIDES",title:"Make ideas useful.",copy:"A connected portfolio of visual production, independent digital products and practical knowledge — built, tested and documented through real work.",links:[["Selected work","/works.html#portfolio"],["Projects","/works.html#projects"],["Guides","/works.html#guides"]]}],
      [/blog\.html|\/blog\//,{section:"works",kicker:"FIELD NOTES · GUIDES · DOCUMENTATION",title:"Knowledge from practice.",copy:"Practical explanations, deployment notes and reusable checklists for creative technology and independent infrastructure.",links:[["Works home","/works.html"],["Guides","/works.html#guides"]]}],
      [/now\.html/,{section:"now",kicker:"CURRENT FOCUS · LIVING INDEX",copy:"A concise view of the themes being developed across visual production, AI workflows, digital products and infrastructure.",links:[["Projects","/works.html#projects"],["AI Lab","/lab/"]]}],
      [/about\.html/,{section:"about",kicker:"ABOUT · WWZ.iM",copy:"Creative production and technical problem-solving, connected by curiosity, careful execution and useful outcomes.",links:[["Selected work","/works.html"],["Contact","/#contact"]]}]
    ];
    const config = map.find(([pattern]) => pattern.test(path))?.[1];
    if (!config) return;
    const banner = document.createElement("section");
    banner.className = "wwz-page-banner";
    banner.dataset.section = config.section;
    banner.innerHTML = '<div class="wwz-banner-content"><div class="wwz-banner-kicker">'+config.kicker+'</div><h2>'+(config.title||"Make ideas useful.")+'</h2><p>'+config.copy+'</p><nav class="wwz-banner-links" aria-label="Related pages">'+config.links.map(([label,href])=>'<a href="'+href+'">'+label+' ↗</a>').join('')+'</nav></div>';
    main.prepend(banner);
  };

  const mount = () => {
    mountPageExperience();
    document.querySelectorAll('[data-copyright-year]').forEach(node => {
      node.textContent = String(new Date().getFullYear());
    });
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;
    if (sidebar.dataset.shellMounted === "true") return;
    sidebar.dataset.shellMounted = "true";
    // One scroll control per document, including routed iframe pages.
    const scrollTop = document.createElement('button');
    scrollTop.type = 'button';
    scrollTop.className = 'wwz-scroll-top';
    scrollTop.setAttribute('aria-label', 'Back to top');
    scrollTop.title = 'Back to top';
    scrollTop.hidden = true;
    scrollTop.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>';
    document.body.append(scrollTop);
    const updateScrollTop = () => { scrollTop.hidden = window.scrollY < 300; };
    addEventListener('scroll', updateScrollTop, { passive:true });
    addEventListener('pageshow', updateScrollTop);
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
    updateScrollTop();
    sidebar.id = "sidebar";
    sidebar.classList.add("wwz-topbar");
    sidebar.setAttribute("aria-label", "Primary navigation");
    sidebar.innerHTML = template;
    updateActiveRoute(sidebar, new URL(location.href));
    mountNavIndicator(sidebar);
    const currentPath = location.pathname;
    const projectFolder = sidebar.querySelectorAll('.wwz-nav-folder')[0];
    const learningFolder = sidebar.querySelectorAll('.wwz-nav-folder')[1];
    if (currentPath.includes('/projects/')) projectFolder?.setAttribute('open', '');
    if (currentPath.includes('/topics/') || currentPath.includes('/articles/') || currentPath.includes('/article/') || currentPath.includes('/lab/') || currentPath.endsWith('/now.html')) learningFolder?.setAttribute('open', '');
    sidebar.querySelectorAll('.wwz-nav-sub a').forEach(link => {
      const target = new URL(link.href, location.href);
      if (canonicalPath(target) === canonicalPath(new URL(location.href))) link.setAttribute('aria-current', 'page');
    });

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
      ariaLabel: "Close navigation"
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
      menu?.setAttribute("aria-label", "Open navigation");
      sidebar.querySelector('.wwz-resources')?.removeAttribute('open');
      if (menu) menu.textContent = "Menu";
    };
    menu?.addEventListener("click", () => {
      const open = sidebar.classList.toggle("sidebar-open");
      document.documentElement.classList.toggle("wwz-menu-open", open);
      setBackgroundInert(open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menu.textContent = open ? "Close" : "Menu";
    });
    scrim?.addEventListener("click", closeMenu);
    const desktopMenu = matchMedia('(min-width: 1100px)');
    const themeButton = sidebar.querySelector('[data-shell-theme]');
    const placeThemeButton = () => {
      const focused = document.activeElement === themeButton;
      const destination = sidebar.querySelector('.wwz-mobile-controls');
      if (!destination || !themeButton) return;
      if (themeButton.parentElement !== destination) destination.prepend(themeButton);
      if (focused) themeButton.focus();
    };
    placeThemeButton();
    desktopMenu.addEventListener('change', () => { closeMenu(); placeThemeButton(); });
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

    // Use native document navigation. The previous iframe + pushState routing
    // changed the address bar without changing the top-level document, so a
    // browser refresh could restore the wrong page.
    // Native links keep refresh, deep links, and browser history consistent.
  };

  const routeKey = url => (
    url.hash === "#contact" ? "contact" :
    
    document.body?.dataset.activePage ||
    (url.pathname.endsWith("/about.html") ? "about" :
    url.pathname.includes("/videos/") ? "videos" :
    url.pathname.includes("/article") || url.pathname.includes("/articles/") || url.pathname.includes("/topics/") ? "lab" : url.pathname.endsWith("/blog.html") ? "blog" :
    url.pathname.includes("/projects/") || url.pathname.endsWith("/works.html") ? "works" : "home")
  );

  const mountNavIndicator = sidebar => {
    const nav = sidebar.querySelector('.wwz-primary-nav');
    if (!nav || nav.querySelector('.wwz-nav-indicator')) return;
    nav.classList.add('wwz-nav-indicator-host');
    const indicator = document.createElement('span');
    indicator.className = 'wwz-nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    nav.prepend(indicator);

    const moveTo = link => {
      if (!link) return;
      indicator.style.width = link.offsetWidth + 'px';
      indicator.style.height = link.offsetHeight + 'px';
      indicator.style.transform = 'translate3d(' + link.offsetLeft + 'px,0,0)';
    };
    const active = nav.querySelector('.wwz-nav-link.active');
    requestAnimationFrame(() => {
      moveTo(active);
      indicator.classList.add('is-ready');
    });
    nav.querySelectorAll('.wwz-nav-link').forEach(link => {
      link.addEventListener('click', () => moveTo(link));
    });
    addEventListener('resize', () => moveTo(nav.querySelector('.wwz-nav-link.active')));
    addEventListener('pageshow', () => moveTo(nav.querySelector('.wwz-nav-link.active')));
  };

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
    // Keep normal document navigation. Avoid iframe swaps and pushState-only routing,
    // which can expose an empty frame while the next page is loading.
    sidebar.querySelectorAll("[data-shell-route]").forEach(link => {
      if (canonicalPath(new URL(link.href)) === canonicalPath(new URL(location.href))) {
        link.setAttribute("aria-current", "page");
      }
    });
    addEventListener("hashchange", () => updateActiveRoute(sidebar, new URL(location.href)));
    addEventListener("pageshow", () => updateActiveRoute(sidebar, new URL(location.href)));
    sidebar.querySelectorAll("[data-shell-route], .wwz-sidebar-brand").forEach(link => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("sidebar-open");
        document.documentElement.classList.remove("wwz-menu-open");
      });
    });
  };


  // The script is loaded at the end of each page, so mount immediately and
  // keep the same sidebar DOM for the lifetime of this document.
  mount();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once:true });
})();
