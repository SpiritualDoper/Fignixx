// --- THEME INITIALIZATION & TOGGLE ---
(function() {
    const themeBtn = document.getElementById('theme-toggle');
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('fignix-theme');
        if (savedTheme) return savedTheme;
        return 'dark'; // Default
    };

    const currentTheme = getInitialTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('fignix-theme', next);
        });
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STICKY HEADER LOGIC ---
    const headerContainer = document.getElementById('header-container');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (!headerContainer) return;

        if (currentScrollY > 50) {
            headerContainer.classList.add('header-scrolled');
        } else {
            headerContainer.classList.remove('header-scrolled');
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            headerContainer.classList.add('header-hidden');
        } else {
            headerContainer.classList.remove('header-hidden');
        }
        lastScrollY = currentScrollY;
    }, { passive: true });

    // --- STATS COUNTER ANIMATION ---
    const statsCards = document.querySelectorAll('.stat-card');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const endValue = parseInt(card.getAttribute('data-end'));
                const countEl = card.querySelector('.count-numeric');
                if (countEl) animateValue(countEl, 0, endValue, 2000);
                statsObserver.unobserve(card);
            }
        });
    }, { threshold: 0.1 });
    statsCards.forEach(card => statsObserver.observe(card));

    window.animateValue = function(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            obj.innerHTML = Math.floor(easeProgress * end);
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = end;
        };
        window.requestAnimationFrame(step);
    };

    // --- VIDEO SHOWCASE SCROLL ANIMATION ---
    const videoShowcase = document.getElementById('video-showcase');
    const bgVideo = document.getElementById('bg-video');
    if (videoShowcase && bgVideo) {
        const text1 = document.getElementById('showcase-text-1');
        const text2 = document.getElementById('showcase-text-2');
        window.addEventListener('scroll', () => {
            const rect = videoShowcase.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            let progress = 0;
            if (rect.top <= 0) progress = Math.min(1, Math.max(0, -rect.top / (rect.height - viewportHeight)));
            bgVideo.style.transform = `scale(${1.3 - (0.3 * progress)})`;
            if (text1) {
                if (progress < 0.45) {
                    text1.style.visibility = 'visible';
                    const t1Opacity = Math.max(0, 1 - (progress * 2.2));
                    text1.style.opacity = t1Opacity;
                    text1.style.transform = `translate(-50%, calc(-50% - ${progress * 200}px))`;
                } else {
                    text1.style.visibility = 'hidden';
                }
            }
            if (text2) {
                if (progress > 0.55) {
                    text2.style.visibility = 'visible';
                    const t2Opacity = Math.min(1, (progress - 0.55) * 2.2);
                    text2.style.opacity = t2Opacity;
                    text2.style.transform = `translate(-50%, calc(-50% + ${200 - (t2Opacity * 200)}px))`;
                } else {
                    text2.style.visibility = 'hidden';
                }
            }
        }, { passive: true });
    }

    // --- INDUSTRIES PHYSICS CLUSTER ---
    const cluster = document.getElementById('industries-cluster');
    const wrappers = document.querySelectorAll('.drag-wrapper');
    const container = document.getElementById('industries-container');

    if (cluster && wrappers.length > 0) {
        const state = Array.from(wrappers).map((el, i) => ({
            el: el,
            x: 0, y: 0, vx: 0, vy: 0, baseX: 0, baseY: 0,
            lastX: 0, lastY: 0,
            isDragging: false, isThrown: false,
            time: Math.random() * 10000,
            ampX: 15 + Math.random() * 25,
            ampY: 15 + Math.random() * 25,
            speedX: 0.0005 + Math.random() * 0.0004,
            speedY: 0.0005 + Math.random() * 0.0004,
            dirX: Math.random() > 0.5 ? 1 : -1,
            dirY: Math.random() > 0.5 ? 1 : -1,
            bounds: { minX: -100, maxX: 100, minY: -100, maxY: 100 }
        }));

        const updateBounds = () => {
            if (!container) return;
            const cRect = container.getBoundingClientRect();
            state.forEach((p, i) => {
                const elRect = p.el.getBoundingClientRect();
                p.bounds = {
                    minX: cRect.left - elRect.left + 20,
                    maxX: cRect.right - elRect.right - 20,
                    minY: cRect.top - elRect.top + 20,
                    maxY: cRect.bottom - elRect.bottom - 40
                };
            });
        };

        setTimeout(updateBounds, 500);
        window.addEventListener('resize', updateBounds);

        let lastFrameTime = performance.now();
        const loop = (time) => {
            const dt = Math.min(time - lastFrameTime, 50);
            lastFrameTime = time;

            state.forEach((p, i) => {
                if (!p.isDragging) {
                    if (p.isThrown) {
                        p.x += p.vx * dt;
                        p.y += p.vy * dt;
                        p.vx *= 0.95;
                        p.vy *= 0.95;

                        if (p.x < p.bounds.minX) { p.x = p.bounds.minX; p.vx *= -0.8; }
                        if (p.x > p.bounds.maxX) { p.x = p.bounds.maxX; p.vx *= -0.8; }
                        if (p.y < p.bounds.minY) { p.y = p.bounds.minY; p.vy *= -0.8; }
                        if (p.y > p.bounds.maxY) { p.y = p.bounds.maxY; p.vy *= -0.8; }

                        if (Math.abs(p.vx) < 0.02 && Math.abs(p.vy) < 0.02) {
                            p.isThrown = false;
                            p.baseX = p.x - Math.sin(p.time * p.speedX) * p.ampX * p.dirX;
                            p.baseY = p.y - Math.sin(p.time * p.speedY) * p.ampY * p.dirY;
                        }
                    } else {
                        p.time += dt;
                        p.x = p.baseX + Math.sin(p.time * p.speedX) * p.ampX * p.dirX;
                        p.y = p.baseY + Math.sin(p.time * p.speedY) * p.ampY * p.dirY;
                    }
                }
                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
            });
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);

        wrappers.forEach((el, i) => {
            let mouseStartX, mouseStartY, startDragX, startDragY;

            el.addEventListener('pointerdown', (e) => {
                const p = state[i];
                p.isDragging = true;
                p.isThrown = false;
                startDragX = p.x;
                startDragY = p.y;
                mouseStartX = e.clientX;
                mouseStartY = e.clientY;
                p.lastX = p.x;
                p.lastY = p.y;
                el.setPointerCapture(e.pointerId);
                e.preventDefault();
            });

            el.addEventListener('pointermove', (e) => {
                const p = state[i];
                if (p.isDragging) {
                    const dx = e.clientX - mouseStartX;
                    const dy = e.clientY - mouseStartY;
                    p.x = startDragX + dx;
                    p.y = startDragY + dy;
                    p.vx = (p.x - p.lastX) / 16;
                    p.vy = (p.y - p.lastY) / 16;
                    p.lastX = p.x;
                    p.lastY = p.y;
                }
            });

            el.addEventListener('pointerup', (e) => {
                const p = state[i];
                if (p.isDragging) {
                    p.isDragging = false;
                    p.isThrown = true;
                    el.releasePointerCapture(e.pointerId);
                }
            });

            el.addEventListener('pointercancel', (e) => {
                const p = state[i];
                if (p.isDragging) {
                    p.isDragging = false;
                    p.isThrown = true;
                    el.releasePointerCapture(e.pointerId);
                }
            });
        });
    }


    // --- HERO SLIDER SCROLL INTERACTION ---
    const heroSliderInner = document.getElementById('hero-slider-inner');
    if (heroSliderInner) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const moveX = scrollY * 0.4; 
            heroSliderInner.style.transform = `translateX(-${moveX}px)`;
        }, { passive: true });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
});

// --- GLOBAL UTILITIES ---
function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

window.onclick = function(event) {
    const modal = document.getElementById('contact-modal');
    if (event.target == modal) closeContactModal();
};

function handleFormSubmit(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button');
    if (!btn) return;
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerText = 'Message Sent!';
        btn.style.background = '#10B981';
        setTimeout(() => {
            closeContactModal();
            event.target.reset();
            btn.innerText = originalText;
            btn.style.background = '';
            btn.style.opacity = '';
            btn.disabled = false;
        }, 1500);
    }, 1500);
}

// --- MOBILE MENU LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile nav when clicking a link (except accordion toggles if any)
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link, .mobile-service-item');
        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') !== '#') {
                    mobileToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
});