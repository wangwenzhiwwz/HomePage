/**
 * WWZ.iM - Main JavaScript
 * Optimized & Modular Version
 */

(function() {
    'use strict';

    // ========== Configuration ==========
    const CONFIG = {
        videos: [
            { title: "Ulefone Armor 34 Pro", desc: "Autofocus Projector • 2025", thumbnail: "images/video/maxresdefault.jpg", url: "https://www.youtube.com/embed/a7RQgUMkpwI", type: "youtube" },
            { title: "Armor Mini 20T Pro", desc: "Thermal Mini • 2024", thumbnail: "images/video/Screenshot_2025-12-11_140000.png", url: "https://www.youtube.com/embed/diWNAaazdoM", type: "youtube" },
            { title: "Ulefone Armor 27T Pro", desc: "FLIR Thermal Pro • 2024", thumbnail: "images/video/Screenshot_2025-03-05_142413.png", url: "https://www.youtube.com/embed/aW8FSVuJY7U", type: "youtube" },
            { title: "Ulefone Armor 26 Ultra", desc: "Mega Performance 5G • 2024", thumbnail: "images/video/Screenshot_2025-03-05_142626.png", url: "https://www.youtube.com/embed/Y2yPBSYQkfw", type: "youtube" },
            { title: "Ulefone Armor 23 Ultra", desc: "Satellite Comm • 2024", thumbnail: "images/video/Screenshot_2025-12-11_135753.png", url: "https://www.youtube.com/embed/ynM2jFYncnE", type: "youtube" },
            { title: "Ulefone Armor 22", desc: "NightElf Ultra 2.0 • 2023", thumbnail: "images/video/Screenshot_2025-03-05_142821.png", url: "https://www.youtube.com/embed/GVeko9aDHzw", type: "youtube" }
        ]
    };

    // ========== Theme Controller ==========
    const ThemeController = {
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

            // System theme listener
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
    const CursorController = {
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
    const MobileMenu = {
        init() {
            this.toggle = document.getElementById('mobile-toggle');
            this.content = document.getElementById('sidebar-content');
            
            if (!this.toggle || !this.content) return;
            
            this.bindEvents();
        },

        bindEvents() {
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

    // ========== Video Grid ==========
    const VideoGrid = {
        init() {
            const grid = document.getElementById('videoGrid');
            if (!grid) return;

            CONFIG.videos.forEach((video, index) => {
                const card = document.createElement('div');
                card.className = 'col-md-6 col-lg-4';
                card.innerHTML = `
                    <div class="glass-card p-2 h-100 animate-in animate-delay-${(index % 4) + 1}" 
                         style="cursor:pointer" 
                         data-bs-toggle="modal" 
                         data-bs-target="#videoModal" 
                         data-video-url="${video.url}" 
                         data-video-type="${video.type}" 
                         data-hover>
                        <div class="position-relative overflow-hidden rounded-3 mb-3">
                            <img src="${video.thumbnail}" 
                                 class="w-100" 
                                 style="aspect-ratio:16/9;object-fit:cover" 
                                 onerror="this.src='https://via.placeholder.com/640x360?text=No+Image'" 
                                 loading="lazy"
                                 alt="${video.title}">
                            <div class="play-btn-overlay"><i class="fa-solid fa-play"></i></div>
                        </div>
                        <div class="px-2 pb-2">
                            <div class="fw-bold text-truncate">${video.title}</div>
                            <div class="text-secondary small text-truncate">${video.desc}</div>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    };

    // ========== Video Modal ==========
    const VideoModal = {
        init() {
            const modal = document.getElementById('videoModal');
            const iframe = document.getElementById('videoIframe');
            
            if (!modal || !iframe) return;

            modal.addEventListener('show.bs.modal', (e) => {
                const btn = e.relatedTarget;
                const url = btn.getAttribute('data-video-url');
                const type = btn.getAttribute('data-video-type');
                iframe.src = url + (type === 'youtube' ? '?autoplay=1&rel=0' : '?autoplay=1');
            });

            modal.addEventListener('hidden.bs.modal', () => {
                iframe.src = '';
            });
        }
    };

    // ========== Image Lightbox ==========
    const ImageLightbox = {
        init() {
            const modalElement = document.getElementById('imagePreviewModal');
            if (!modalElement) return;

            const modal = new bootstrap.Modal(modalElement);
            const previewImg = document.getElementById('previewImage');

            document.querySelectorAll('.zoom-trigger').forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const img = trigger.querySelector('img');
                    if (img) {
                        let largeSrc = img.src.replace('thumbnail', 'large');
                        previewImg.src = largeSrc;
                        previewImg.onerror = () => { previewImg.src = img.src; };
                        modal.show();
                    }
                });
            });

            modalElement.addEventListener('click', () => modal.hide());
        }
    };

    // ========== Navigation Highlighter ==========
    const NavHighlighter = {
        init() {
            const sections = document.querySelectorAll('section[id]');
            if (sections.length === 0) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                        if (activeLink) activeLink.classList.add('active');
                    }
                });
            }, { rootMargin: "-30% 0px -60% 0px" });

            sections.forEach(section => observer.observe(section));
        }
    };

    // ========== 3D Card Effect ==========
    const Card3D = {
        init() {
            const card = document.querySelector('.video-card-content');
            if (!card || window.innerWidth < 992) return;

            document.addEventListener('mousemove', (e) => {
                const x = (window.innerWidth / 2 - e.clientX) / 25;
                const y = (window.innerHeight / 2 - e.clientY) / 25;
                card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
            });

            // Reset on mouse leave
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateY(0) rotateX(0)';
            });
        }
    };

    // ========== Scroll Animations ==========
    const ScrollAnimations = {
        init() {
            const animatedElements = document.querySelectorAll('.animate-in');
            if (animatedElements.length === 0) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            animatedElements.forEach(el => {
                el.style.animationPlayState = 'paused';
                observer.observe(el);
            });
        }
    };

    // ========== Loader ==========
    const Loader = {
        init() {
            window.addEventListener('load', () => {
                const loader = document.getElementById('loader');
                if (loader) {
                    setTimeout(() => loader.classList.add('hidden'), 300);
                }
            });
        }
    };

    // ========== Copyright Year ==========
    const Copyright = {
        init() {
            const yearEl = document.getElementById('copyright-year');
            if (yearEl) {
                yearEl.textContent = new Date().getFullYear();
            }
        }
    };

    // ========== Image Error Handler ==========
    const ImageErrorHandler = {
        init() {
            document.addEventListener('error', (e) => {
                if (e.target.tagName.toLowerCase() === 'img' && !e.target.dataset.errorHandled) {
                    e.target.dataset.errorHandled = 'true';
                    e.target.src = 'https://via.placeholder.com/640x360?text=No+Image';
                }
            }, true);
        }
    };

    // ========== Initialize All Modules ==========
    document.addEventListener('DOMContentLoaded', () => {
        ThemeController.init();
        CursorController.init();
        MobileMenu.init();
        VideoGrid.init();
        VideoModal.init();
        ImageLightbox.init();
        NavHighlighter.init();
        Card3D.init();
        ScrollAnimations.init();
        Copyright.init();
        ImageErrorHandler.init();
    });

    Loader.init();

})();
