document.addEventListener('DOMContentLoaded', () => {
    const collectionUrl = 'https://www.elvapero.es/collections/Vapsolo-vapes-desechables';
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const warnDiv = document.querySelector('.warn');
    const ageModal = document.getElementById('ageModal');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const header = document.querySelector('.header');
    const bottomPromo = document.getElementById('bottomPromo');
    const intentPromo = document.getElementById('intentPromo');
    const stickyMobileCta = document.getElementById('stickyMobileCta');
    const stickyCtaClose = document.getElementById('stickyCtaClose');

    function safeGet(storage, key) {
        try {
            return storage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeSet(storage, key, value) {
        try {
            storage.setItem(key, value);
        } catch (error) {
            // Storage can be unavailable in private browsing or strict privacy modes.
        }
    }

    function setBodyLocked(locked) {
        document.body.style.overflow = locked ? 'hidden' : '';
    }

    function isAgeModalOpen() {
        return ageModal && ageModal.style.display === 'flex';
    }

    function closeMobileMenu() {
        if (!hamburger || !mobileMenu) return;
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active') ? 'true' : 'false');
        });

        document.addEventListener('click', (event) => {
            if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
                closeMobileMenu();
            }
        });
    }

    document.querySelectorAll('.mobile-nav a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const selector = anchor.getAttribute('href');
            if (!selector || selector === '#') return;
            const target = document.querySelector(selector);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (target.classList.contains('mini-article')) {
                target.classList.add('active');
            }
        });
    });

    if (ageModal && yesBtn && noBtn) {
        if (safeGet(localStorage, 'ageConfirmed') !== 'true') {
            ageModal.style.display = 'flex';
            setBodyLocked(true);
            window.setTimeout(() => yesBtn.focus(), 50);
        } else {
            ageModal.style.display = 'none';
            setBodyLocked(false);
        }

        yesBtn.addEventListener('click', () => {
            safeSet(localStorage, 'ageConfirmed', 'true');
            ageModal.style.display = 'none';
            setBodyLocked(false);
        });

        noBtn.addEventListener('click', () => {
            alert('Acceso denegado. Esta página es solo para mayores de 18 años.');
            window.location.href = 'https://www.google.es';
        });
    }

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (header) {
            if (currentScroll > 100) {
                header.style.background = 'rgba(26, 10, 46, 0.95)';
                header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.background = 'rgba(26, 10, 46, 0.9)';
                header.style.boxShadow = 'none';
            }
        }

        handleStickyCta();
        handleMobileIntent();
        lastScroll = currentScroll;
    }, { passive: true });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    if ('IntersectionObserver' in window) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.bid-card, .artwork-card, .seo-card, .blog-card, .full-blog-card, .product-rec-card, .city-card, .trust-card').forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        });

        document.querySelectorAll('img').forEach((img) => imageObserver.observe(img));
    }

    const placeholderSvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
            <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stop-color="#1a0a2e"/>
                    <stop offset="0.55" stop-color="#8b2fb5"/>
                    <stop offset="1" stop-color="#00d9ff"/>
                </linearGradient>
            </defs>
            <rect width="1200" height="675" fill="url(#g)"/>
            <circle cx="280" cy="170" r="220" fill="#e91e63" opacity="0.26"/>
            <circle cx="880" cy="420" r="250" fill="#00d9ff" opacity="0.22"/>
            <rect x="360" y="280" width="480" height="120" rx="60" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.82"/>
            <line x1="840" y1="340" x2="1010" y2="340" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity="0.82"/>
        </svg>
    `);

    document.querySelectorAll('.blog-card img, .full-blog-card > img').forEach((img) => {
        img.addEventListener('error', () => {
            img.src = `data:image/svg+xml;charset=UTF-8,${placeholderSvg}`;
        }, { once: true });
    });

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    document.querySelectorAll('.btn-bid, .btn-explore, .btn-create, .btn-connect, .btn-connect-mobile').forEach((button) => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px) scale(1.03)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('click', function (event) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.45)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    document.querySelectorAll('.blog-toggle').forEach((link) => {
        link.addEventListener('click', () => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.classList.toggle('active');
        });
    });

    const cityToggle = document.getElementById('city');
    const cityContainer = document.querySelector('.foot-cont-three');
    if (cityToggle && cityContainer) {
        cityToggle.addEventListener('click', () => {
            cityToggle.classList.toggle('active');
            cityContainer.classList.toggle('expanded');
        });
    }

    let bottomPromoTimer;
    function showBottomPromo() {
        if (!bottomPromo || isAgeModalOpen()) {
            scheduleBottomPromo(4000);
            return;
        }
        const dismissedUntil = Number(safeGet(sessionStorage, 'bottomPromoDismissedUntil') || 0);
        if (Date.now() < dismissedUntil) {
            scheduleBottomPromo(Math.max(dismissedUntil - Date.now(), 4000));
            return;
        }
        bottomPromo.classList.add('active');
        bottomPromo.setAttribute('aria-hidden', 'false');
    }

    function hideBottomPromo() {
        if (!bottomPromo) return;
        bottomPromo.classList.remove('active');
        bottomPromo.setAttribute('aria-hidden', 'true');
        safeSet(sessionStorage, 'bottomPromoDismissedUntil', String(Date.now() + 45000));
        scheduleBottomPromo(45000);
    }

    function scheduleBottomPromo(delay) {
        if (!bottomPromo) return;
        window.clearTimeout(bottomPromoTimer);
        bottomPromoTimer = window.setTimeout(showBottomPromo, delay);
    }

    document.querySelectorAll('[data-close-promo]').forEach((button) => {
        button.addEventListener('click', hideBottomPromo);
    });

    scheduleBottomPromo(7000);

    function showIntentPromo() {
        if (!intentPromo || isAgeModalOpen() || safeGet(sessionStorage, 'intentPromoShown') === 'true') return;
        safeSet(sessionStorage, 'intentPromoShown', 'true');
        intentPromo.classList.add('active');
        intentPromo.setAttribute('aria-hidden', 'false');
    }

    function closeIntentPromo() {
        if (!intentPromo) return;
        intentPromo.classList.remove('active');
        intentPromo.setAttribute('aria-hidden', 'true');
    }

    document.addEventListener('mouseleave', (event) => {
        if (window.innerWidth > 768 && event.clientY <= 0) {
            showIntentPromo();
        }
    });

    function handleMobileIntent() {
        if (window.innerWidth > 768 || safeGet(sessionStorage, 'intentPromoShown') === 'true') return;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable > 0 && window.scrollY / scrollable >= 0.65) {
            showIntentPromo();
        }
    }

    document.querySelectorAll('[data-close-intent]').forEach((button) => {
        button.addEventListener('click', closeIntentPromo);
    });

    if (intentPromo) {
        intentPromo.addEventListener('click', (event) => {
            if (event.target === intentPromo) closeIntentPromo();
        });
    }

    let stickyClosed = false;
    function handleStickyCta() {
        if (!stickyMobileCta || stickyClosed || window.innerWidth > 768 || isAgeModalOpen()) return;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const shouldShow = scrollable > 0 && window.scrollY / scrollable >= 0.38;
        stickyMobileCta.classList.toggle('active', shouldShow);
    }

    if (stickyCtaClose && stickyMobileCta) {
        stickyCtaClose.addEventListener('click', () => {
            stickyClosed = true;
            stickyMobileCta.classList.remove('active');
        });
    }

    document.querySelectorAll('a[href="' + collectionUrl + '"]').forEach((link) => {
        link.setAttribute('rel', 'noopener');
    });

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }
});
