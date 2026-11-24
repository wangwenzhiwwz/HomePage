/**
 * WWZ.iM Apple Studio Minimalist Shell
 * 
 * Features:
 * 1. Fixed Frosted-Glass Apple Navigation Bar.
 * 2. Icon-Based Dark/Light Mode Switcher with Smooth Rotation.
 * 3. Safari/Apple-grade Top Loading Progress Bar.
 * 4. Zero-Flicker Seamless PJAX Page Transitions.
 * 5. Interactive 3D Card Tilt & Dynamic Cursor Specular Glow.
 * 6. High-End Optical Aperture & Depth-of-Field Interactive Stage.
 */

(function () {
  'use strict';

  // Compute Root Path
  const getRoot = () => {
    const depth = (location.pathname.match(/\//g) || []).length;
    if (location.pathname === '/' || (location.pathname.endsWith('/index.html') && depth <= 1)) return '';
    return '/';
  };

  const ROOT = getRoot();

  // Helper: Match Current Route Key
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
    return 'home';
  };

  // SVGs for Theme Toggle: Moon (for switching to dark) & Sun (for switching to light)
  const ICON_MOON = `<svg class="theme-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  const ICON_SUN = `<svg class="theme-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

  // Build Fixed Apple Navigation Bar Template
  const buildNavHTML = (activeKey) => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    const themeIcon = isDark ? ICON_SUN : ICON_MOON;
    const themeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return `
      <div class="apple-nav-inner">
        <a href="${ROOT || '/'}index.html" class="apple-brand" data-shell-nav="home">
          <img src="${ROOT || '/'}favicon.png" alt="WWZ Logo" width="22" height="22">
          <span>WWZ.iM</span>
        </a>
        <nav class="apple-links" aria-label="Primary navigation">
          <a href="${ROOT || '/'}index.html" class="apple-link ${activeKey === 'home' ? 'active' : ''}" data-shell-nav="home" ${activeKey === 'home' ? 'aria-current="page"' : ''}>Home</a>
          <a href="${ROOT || '/'}videos/" class="apple-link ${activeKey === 'videos' ? 'active' : ''}" data-shell-nav="videos" ${activeKey === 'videos' ? 'aria-current="page"' : ''}>Videos</a>
          <a href="${ROOT || '/'}works.html" class="apple-link ${activeKey === 'works' ? 'active' : ''}" data-shell-nav="works" ${activeKey === 'works' ? 'aria-current="page"' : ''}>Works</a>
          <a href="${ROOT || '/'}blog.html" class="apple-link ${activeKey === 'blog' ? 'active' : ''}" data-shell-nav="blog" ${activeKey === 'blog' ? 'aria-current="page"' : ''}>Blog</a>
          <a href="${ROOT || '/'}about.html" class="apple-link ${activeKey === 'about' ? 'active' : ''}" data-shell-nav="about" ${activeKey === 'about' ? 'aria-current="page"' : ''}>About</a>
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
          <a href="${ROOT || '/'}index.html" class="apple-mobile-link ${activeKey === 'home' ? 'active' : ''}" data-shell-nav="home">Home</a>
          <a href="${ROOT || '/'}videos/" class="apple-mobile-link ${activeKey === 'videos' ? 'active' : ''}" data-shell-nav="videos">Videos</a>
          <a href="${ROOT || '/'}works.html" class="apple-mobile-link ${activeKey === 'works' ? 'active' : ''}" data-shell-nav="works">Works</a>
          <a href="${ROOT || '/'}blog.html" class="apple-mobile-link ${activeKey === 'blog' ? 'active' : ''}" data-shell-nav="blog">Blog</a>
          <a href="${ROOT || '/'}about.html" class="apple-mobile-link ${activeKey === 'about' ? 'active' : ''}" data-shell-nav="about">About</a>
        </nav>
        <div class="apple-mobile-footer">
          <span>WWZ.iM · Wang Wenzhi</span>
          <a href="https://github.com/wangwenzhiwwz" target="_blank" rel="noopener noreferrer" style="color:var(--ink-secondary)">GitHub ↗</a>
        </div>
      </div>
    `;
  };

  // Update Theme Icons
  const updateThemeIcons = () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    const icon = isDark ? ICON_SUN : ICON_MOON;
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('[data-shell-theme]').forEach(btn => {
      btn.innerHTML = icon;
      btn.setAttribute('aria-label', label);
      btn.title = label;
      btn.classList.add('icon-pulse');
      setTimeout(() => btn.classList.remove('icon-pulse'), 400);
    });
  };

  // Mount Header (Ensures single persistent instance across transitions)
  const mountNav = () => {
    let header = document.getElementById('wwz-header');
    const pageKey = document.body.dataset.activePage || getRouteKey(location.pathname);
    const activeKey = (pageKey === 'lab' || pageKey === 'article' || pageKey === 'topic') ? 'blog' : pageKey;

    if (!header) {
      header = document.createElement('header');
      header.id = 'wwz-header';
      header.className = 'apple-nav';
      header.setAttribute('role', 'banner');
      header.innerHTML = buildNavHTML(activeKey);
      document.body.prepend(header);
    } else {
      updateActiveNavLinks(activeKey);
      updateThemeIcons();
    }

    // Bind Mobile Toggle
    const menuToggle = header.querySelector('#appleMenuToggle');
    const mobileDrawer = header.querySelector('#appleMobileDrawer');

    if (menuToggle && mobileDrawer && !menuToggle.dataset.bound) {
      menuToggle.dataset.bound = 'true';
      const closeDrawer = () => {
        mobileDrawer.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };

      menuToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('is-open');
        menuToggle.classList.toggle('is-active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close drawer on link click
      mobileDrawer.querySelectorAll('.apple-mobile-link').forEach(link => {
        link.addEventListener('click', closeDrawer);
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
          closeDrawer();
        }
      });
    }

    // Bind Header Scroll State for Mobile Frosted Glass
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

    // Bind Theme Button
    header.querySelectorAll('[data-shell-theme]').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          const isDark = document.documentElement.dataset.theme === 'dark';
          const newTheme = isDark ? 'light' : 'dark';
          document.documentElement.dataset.theme = newTheme;
          document.documentElement.dataset.themeMode = newTheme;
          document.documentElement.style.colorScheme = newTheme;
          try { localStorage.setItem('wwz-theme-mode', newTheme); } catch (_) {}
          updateThemeIcons();
        });
      }
    });

    // Cleanup legacy sidebar if present
    document.querySelectorAll('.sidebar, .wwz-topbar:not(#wwz-header)').forEach(el => el.remove());
  };

  // Update Active Link State
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

        // Subtle 3D tilt (max 3 degrees)
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

  // Mobbin Interactive Hero Showcase Tab Switcher
  const initHeroShowcaseTabs = () => {
    const tabs = document.querySelectorAll('.showcase-tab');
    const card = document.getElementById('heroShowcaseCard');
    const img = document.getElementById('heroShowcaseImg');
    const title = document.getElementById('heroShowcaseTitle');
    const desc = document.getElementById('heroShowcaseDesc');
    const badge = document.getElementById('heroShowcaseBadge');

    if (!tabs.length || !card) return;

    tabs.forEach(tab => {
      if (tab.dataset.bound) return;
      tab.dataset.bound = 'true';

      tab.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const videoUrl = tab.dataset.video;
        const imgSrc = tab.dataset.img;
        const titleText = tab.dataset.title;
        const descText = tab.dataset.desc;
        const badgeText = tab.dataset.badge;

        // Smooth subtle fade transition
        const overlay = card.querySelector('.showcase-overlay');
        if (img) img.style.opacity = '0.3';
        if (overlay) overlay.style.opacity = '0.4';

        setTimeout(() => {
          if (img && imgSrc) img.src = imgSrc;
          if (card && videoUrl) {
            card.dataset.video = videoUrl;
            card.setAttribute('aria-label', `Play featured film ${titleText || 'Commercial'}`);
          }
          if (title && titleText) title.textContent = titleText;
          if (desc && descText) desc.textContent = descText;
          if (badge && badgeText) badge.innerHTML = `<i class="fa-solid fa-film"></i> ${badgeText}`;

          if (img) img.style.opacity = '0.9';
          if (overlay) overlay.style.opacity = '1';
        }, 140);
      });
    });
  };

  // Component Initializer (Runs on initial page load and after every PJAX route change)
  const initPageComponents = () => {
    // 1. Copy Email Button
    const copyBtn = document.getElementById('copyContactEmail') || document.querySelector('.js-copy-email');
    const copyStatus = document.getElementById('contactStatus');
    if (copyBtn && !copyBtn.dataset.bound) {
      copyBtn.dataset.bound = 'true';
      copyBtn.addEventListener('click', async () => {
        const email = "wwz.im@outlook.com";
        let success = false;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(email);
            success = true;
          } else {
            const temp = document.createElement('textarea');
            temp.value = email;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.select();
            success = document.execCommand('copy');
            temp.remove();
          }
        } catch (_) { success = false; }

        if (copyStatus) {
          copyStatus.textContent = success ? "Email copied to clipboard!" : "Please select wwz.im@outlook.com";
        }
        copyBtn.innerHTML = success
          ? '<i class="fa-solid fa-check" aria-hidden="true"></i> Copied'
          : '<i class="fa-regular fa-copy" aria-hidden="true"></i> Copy email';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i> Copy email';
          if (copyStatus) copyStatus.textContent = '';
        }, 3000);
      });
    }

    // 2. Video Modals
    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    const modalClose = document.getElementById('modalClose');
    const modalPoster = document.getElementById('modalPoster');
    const modalPosterImg = document.getElementById('modalPosterImg');
    let lastFocusedElement = null;

    const closeVideo = () => {
      if (!videoModal || !videoFrame) return;
      videoModal.classList.remove('open');
      videoFrame.removeAttribute('src');
      if (modalPoster) modalPoster.classList.remove('is-hidden');
      if (modalPosterImg) modalPosterImg.removeAttribute('src');
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
            lastFocusedElement = btn;

            // 1. Immediately paint poster preview to eliminate perceived black screen
            const thumbImg = btn.querySelector('img') || document.getElementById('heroShowcaseImg');
            const posterSrc = btn.dataset.img || (thumbImg ? thumbImg.src : '');
            if (modalPoster && modalPosterImg) {
              if (posterSrc) {
                modalPosterImg.src = posterSrc;
                modalPosterImg.style.display = 'block';
              } else {
                modalPosterImg.style.display = 'none';
              }
              modalPoster.classList.remove('is-hidden');
            }

            // 2. Embed parameters tailored for fast playback & autohiding overlays
            const join = src.includes('?') ? '&' : '?';
            let params = '';
            if (src.includes('vimeo.com')) {
              params = 'autoplay=1&dnt=1&playsinline=1&title=0&byline=0&portrait=0&badge=0&autopause=0';
            } else {
              params = 'autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=1&enablejsapi=1';
            }

            // 3. Smooth fade-out of poster once player iframe finishes loading
            let ready = false;
            const onIframeLoaded = () => {
              if (ready) return;
              ready = true;
              videoFrame.removeEventListener('load', onIframeLoaded);
              setTimeout(() => {
                if (modalPoster) modalPoster.classList.add('is-hidden');
              }, 300);
            };

            videoFrame.addEventListener('load', onIframeLoaded);
            setTimeout(onIframeLoaded, 2500);

            videoFrame.src = src + join + params;
            videoModal.classList.add('open');
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

    // 4. Interactive Specular & Hero Showcase Tabs
    initInteractiveSpecular();
    initHeroShowcaseTabs();

    // 5. Works Gallery Initializer if on works.html
    if (window.WWZWorksInit && typeof window.WWZWorksInit === 'function') {
      window.WWZWorksInit();
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
          btn.innerHTML = '<i class="fa-solid fa-check"></i>';
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
        if (window.scrollY > 300) fab.classList.add('visible');
        else fab.classList.remove('visible');
      }, { passive: true });
      fab.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  // DOM Ready Execution
  const onReady = () => {
    mountNav();
    initPageComponents();
    updateThemeIcons();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
