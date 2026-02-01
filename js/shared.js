/**
 * WWZ.iM - Shared Components
 * Reusable sidebar, theme toggle, and common functionality
 */

(function() {
    'use strict';

    // ========== Sidebar Template ==========
    window.WWZ = window.WWZ || {};

    WWZ.createSidebar = function(activePage) {
        const pages = {
            home: { href: 'index.html', icon: 'fa-house', label: 'Home' },
            videos: { href: 'videos/', icon: 'fa-film', label: 'Videos' },
            portfolio: { href: 'portfolio-masonry.html', icon: 'fa-layer-group', label: 'Works' },
            team: { href: 'team.html', icon: 'fa-users', label: 'Team' },
            styles: { href: 'styles.html', icon: 'fa-palette', label: 'Styles', badge: 'PRO' },
            blog: { href: 'https://blog.wwz.im/', icon: 'fa-blogger fab', label: 'Blog', external: true, badge: 'PRO' },
            apps: { href: 'https://app.wwz.im/', icon: 'fa-compass', label: 'App Nav', external: true, badge: 'PRO' }
        };

        const menuItems = ['home', 'videos', 'portfolio', 'team'];
        const resourceItems = ['styles', 'blog', 'apps'];

        const createNavItem = (key) => {
            const page = pages[key];
            const isActive = key === activePage ? 'active' : '';
            const target = page.external ? 'target="_blank"' : '';
            const iconClass = page.icon.includes('fab') ? page.icon : `fa-solid ${page.icon}`;
            const badge = page.badge ? `<span class="badge-pro">${page.badge}</span>` : '';
            
            return `<li class="nav-item">
                <a href="${page.href}" class="nav-link ${isActive}" ${target} data-hover>
                    <i class="${iconClass}"></i> ${page.label} ${badge}
                </a>
            </li>`;
        };

        return `
        <div class="sidebar-header">
            <div class="d-flex align-items-center justify-content-between w-100 d-lg-block">
                <a href="index.html" class="d-flex align-items-center d-lg-block text-lg-center text-reset">
                    <img src="https://wangwenzhi.eu.org/images/favicon_io/android-chrome-512x512.png" 
                         alt="Wang Wenzhi" 
                         class="profile-img d-block mx-lg-auto">
                    <div class="profile-info text-start text-lg-center">
                        <h1 class="profile-name">Wang Wenzhi</h1>
                        <div class="handle-pill d-none d-lg-inline-block">@WWZ.iM</div>
                    </div>
                </a>
                
                <div class="sidebar-controls d-lg-none">
                    <button class="mobile-btn me-2" id="theme-btn-mobile" data-hover>
                        <i class="fa-solid fa-moon"></i>
                    </button>
                    <button class="mobile-btn" id="mobile-toggle" data-hover>
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
        </div>

        <div class="sidebar-content d-flex flex-column flex-grow-1" id="sidebar-content">
            <span class="nav-section-title">Menu</span>
            <ul class="nav-menu">
                ${menuItems.map(createNavItem).join('')}
            </ul>

            <span class="nav-section-title">Resources</span>
            <ul class="nav-menu">
                ${resourceItems.map(createNavItem).join('')}
            </ul>

            <div class="social-dock">
                <a href="https://x.com/wwz_im" target="_blank" class="social-icon" title="Twitter/X" data-hover><i class="fa-brands fa-x-twitter"></i></a>
                <a href="https://github.com/wangwenzhiwwz" target="_blank" class="social-icon" title="GitHub" data-hover><i class="fa-brands fa-github"></i></a>
                <a href="https://www.youtube.com/@wangwenzhi" target="_blank" class="social-icon" title="YouTube" data-hover><i class="fa-brands fa-youtube"></i></a>
                <a href="https://www.facebook.com/wangwenzhiwwz" target="_blank" class="social-icon" title="Facebook" data-hover><i class="fa-brands fa-facebook"></i></a>
                <a href="https://www.instagram.com/wangwenzhiwwz/" target="_blank" class="social-icon" title="Instagram" data-hover><i class="fa-brands fa-instagram"></i></a>
                <a href="mailto:wwz.im@outlook.com" class="social-icon" title="Email" data-hover><i class="fa-solid fa-envelope"></i></a>
            </div>
        </div>`;
    };

    // ========== Theme Controller ==========
    WWZ.ThemeController = {
        init() {
            this.desktopBtn = document.getElementById('theme-btn-desktop');
            this.mobileBtn = document.getElementById('theme-btn-mobile');
            this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            
            this.updateIcons();
            this.bindEvents();
        },

        toggle() {
            this.isDark = !this.isDark;
            const newTheme = this.isDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateIcons();
        },

        updateIcons() {
            const iconHtml = this.isDark 
                ? '<i class="fa-solid fa-moon"></i>' 
                : '<i class="fa-solid fa-sun"></i>';
            
            if (this.desktopBtn) this.desktopBtn.innerHTML = iconHtml;
            if (this.mobileBtn) this.mobileBtn.innerHTML = iconHtml;
        },

        bindEvents() {
            if (this.desktopBtn) {
                this.desktopBtn.addEventListener('click', () => this.toggle());
            }
            if (this.mobileBtn) {
                this.mobileBtn.addEventListener('click', () => this.toggle());
            }

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.isDark = e.matches;
                    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
                    this.updateIcons();
                }
            });
        }
    };

    // ========== Custom Cursor ==========
    WWZ.CursorController = {
        init() {
            if (!window.matchMedia("(pointer: fine)").matches || window.innerWidth < 992) return;

            this.dot = document.querySelector('.cursor-dot');
            this.circle = document.querySelector('.cursor-circle');
            
            if (!this.dot || !this.circle) return;

            this.mouseX = 0;
            this.mouseY = 0;
            this.circleX = 0;
            this.circleY = 0;

            this.bindEvents();
            this.animate();
        },

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.dot.style.left = `${this.mouseX}px`;
                this.dot.style.top = `${this.mouseY}px`;
            });

            document.querySelectorAll('[data-hover]').forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
            });
        },

        animate() {
            this.circleX += (this.mouseX - this.circleX) * 0.12;
            this.circleY += (this.mouseY - this.circleY) * 0.12;
            this.circle.style.left = `${this.circleX}px`;
            this.circle.style.top = `${this.circleY}px`;
            requestAnimationFrame(() => this.animate());
        }
    };

    // ========== Mobile Menu ==========
    WWZ.MobileMenu = {
        init() {
            this.toggle = document.getElementById('mobile-toggle');
            this.content = document.getElementById('sidebar-content');
            
            if (!this.toggle || !this.content) return;
            
            this.toggle.addEventListener('click', () => this.toggleMenu());
            
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
            
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.addEventListener('click', () => this.closeMenu());
            }
        },

        toggleMenu() {
            this.content.classList.toggle('show');
            const icon = this.toggle.querySelector('i');
            icon.classList.toggle('fa-xmark');
            icon.classList.toggle('fa-bars');
        },

        closeMenu() {
            if (window.innerWidth < 992 && this.content.classList.contains('show')) {
                this.toggleMenu();
            }
        }
    };

    // ========== Loader ==========
    WWZ.Loader = {
        init() {
            window.addEventListener('load', () => {
                const loader = document.getElementById('loader');
                if (loader) {
                    setTimeout(() => loader.classList.add('hidden'), 300);
                }
            });
        }
    };

    // ========== Copyright ==========
    WWZ.Copyright = {
        init() {
            const yearEl = document.getElementById('copyright-year');
            if (yearEl) {
                yearEl.textContent = new Date().getFullYear();
            }
        }
    };

    // ========== Image Error Handler ==========
    WWZ.ImageErrorHandler = {
        init() {
            document.addEventListener('error', (e) => {
                if (e.target.tagName.toLowerCase() === 'img' && !e.target.dataset.errorHandled) {
                    e.target.dataset.errorHandled = 'true';
                    e.target.src = 'https://via.placeholder.com/640x360?text=No+Image';
                }
            }, true);
        }
    };

    // ========== Initialize Common Components ==========
    WWZ.initCommon = function() {
        WWZ.ThemeController.init();
        WWZ.CursorController.init();
        WWZ.MobileMenu.init();
        WWZ.Copyright.init();
        WWZ.ImageErrorHandler.init();
    };

    // Auto-init loader
    WWZ.Loader.init();

})();
