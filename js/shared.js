/**
 * WWZ.iM - Shared Components
 * Reusable sidebar, theme toggle, and common functionality
 */

(function() {
    'use strict';

    window.WWZ = window.WWZ || {};

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
