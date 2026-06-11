/* ============================================================
   Zain Naqvi — Portfolio · main.js
   Header state · mobile menu · scrollspy · reveal-on-scroll
   · easter-egg trigger · footer year
   ============================================================ */
(() => {
    'use strict';

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    /* header border once scrolled */
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* mobile menu */
    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', (e) => {
        if (e.target.matches('.nav-link')) {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    /* scrollspy */
    const linkFor = {};
    document.querySelectorAll('.nav-link').forEach((a) => {
        linkFor[a.getAttribute('href').slice(1)] = a;
    });
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const link = linkFor[entry.target.id];
            if (!link) return;
            document.querySelectorAll('.nav-link.active').forEach((a) => a.classList.remove('active'));
            link.classList.add('active');
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach((s) => spy.observe(s));

    /* reveal-on-scroll */
    const revealObs = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

    /* ---------------------------------------------------------
       Easter egg — click the hero name 5×
       --------------------------------------------------------- */
    const heroName = document.getElementById('hero-name');
    const gameModal = document.getElementById('game-modal');
    const gameClose = document.getElementById('game-close');
    const gameBackdrop = document.getElementById('game-backdrop');
    let clicks = 0, clickTimer;

    if (heroName) {
        heroName.addEventListener('click', () => {
            clicks++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { clicks = 0; }, 1600);

            heroName.classList.remove('egg-shake');
            void heroName.offsetWidth;          // restart animation
            heroName.classList.add('egg-shake');

            if (clicks >= 5) { clicks = 0; openGame(); }
        });
    }

    const openGame = () => {
        gameModal.hidden = false;
        document.body.style.overflow = 'hidden';
        if (window.CircuitRunner) window.CircuitRunner.start();
    };
    const closeGame = () => {
        gameModal.hidden = true;
        document.body.style.overflow = '';
        if (window.CircuitRunner) window.CircuitRunner.stop();
    };

    gameClose.addEventListener('click', closeGame);
    gameBackdrop.addEventListener('click', closeGame);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !gameModal.hidden) closeGame();
    });

    /* footer year */
    document.getElementById('year').textContent = new Date().getFullYear();
})();
