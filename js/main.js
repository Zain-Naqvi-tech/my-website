/* ============================================================
   Zain Naqvi — Portfolio · main.js
   Navigation · typed subtitle · scroll reveals · PCB hero
   canvas · cursor effect · easter-egg trigger
   ============================================================ */
(() => {
    'use strict';

    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------
       Navigation: scrolled state, mobile toggle, scrollspy
       --------------------------------------------------------- */
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    const onScrollNav = () => {
        nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });

    // close mobile menu when a link is tapped
    navLinks.addEventListener('click', (e) => {
        if (e.target.matches('.nav-link')) {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // scrollspy — highlight the nav link for the section in view
    const sections = document.querySelectorAll('section[id]');
    const linkFor = {};
    document.querySelectorAll('.nav-link').forEach((a) => {
        linkFor[a.getAttribute('href').slice(1)] = a;
    });

    const spy = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                document.querySelectorAll('.nav-link.active')
                    .forEach((a) => a.classList.remove('active'));
                const link = linkFor[entry.target.id];
                if (link) link.classList.add('active');
            });
        },
        { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => spy.observe(s));

    /* ---------------------------------------------------------
       Typed rotating subtitle in the hero
       --------------------------------------------------------- */
    const PHRASES = [
        'Firmware Engineer',
        'Computer Engineering Student',
        'Embedded Systems & Robotics',
        'PCB Design · CAN · RTOS',
    ];
    const typedEl = document.getElementById('typed');

    if (prefersReducedMotion) {
        typedEl.textContent = PHRASES[0];
    } else {
        let phrase = 0;
        let pos = 0;
        let deleting = false;

        const tick = () => {
            const current = PHRASES[phrase];
            pos += deleting ? -1 : 1;
            typedEl.textContent = current.slice(0, pos);

            let delay = deleting ? 35 : 70;
            if (!deleting && pos === current.length) {
                delay = 2100;            // pause at full phrase
                deleting = true;
            } else if (deleting && pos === 0) {
                deleting = false;
                phrase = (phrase + 1) % PHRASES.length;
                delay = 350;
            }
            setTimeout(tick, delay);
        };
        tick();
    }

    /* ---------------------------------------------------------
       Reveal-on-scroll
       --------------------------------------------------------- */
    const revealObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    /* ---------------------------------------------------------
       Cursor effect — chip-outline ring + glowing node
       (desktop pointers only; rAF-driven, no layout work)
       --------------------------------------------------------- */
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (finePointer && !prefersReducedMotion) {
        let mx = -100, my = -100;   // mouse
        let rx = -100, ry = -100;   // ring (lags behind)

        window.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
        }, { passive: true });

        const HOVER_TARGETS = 'a, button, .chip, .proj-card, .skill-card';
        document.addEventListener('mouseover', (e) => {
            ring.classList.toggle('is-hovering', !!e.target.closest(HOVER_TARGETS));
        }, { passive: true });

        const renderCursor = () => {
            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;
            dot.style.transform =
                `translate(${mx - 3}px, ${my - 3}px)`;
            ring.style.transform =
                `translate(${rx - ring.offsetWidth / 2}px, ${ry - ring.offsetHeight / 2}px)`;
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);
    } else {
        dot.remove();
        ring.remove();
    }

    /* ---------------------------------------------------------
       Hero background — animated PCB traces with signal pulses
       --------------------------------------------------------- */
    const canvas = document.getElementById('pcb-canvas');
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let traces = [];
        let pulses = [];
        let w = 0, h = 0;
        let running = true;

        const rand = (a, b) => a + Math.random() * (b - a);

        // Build one orthogonal trace: a polyline of horizontal /
        // vertical segments ending in a circular pad.
        const makeTrace = () => {
            const fromLeft = Math.random() < 0.5;
            const points = [{
                x: fromLeft ? -10 : w + 10,
                y: rand(h * 0.05, h * 0.95),
            }];
            let x = points[0].x;
            let y = points[0].y;
            const dir = fromLeft ? 1 : -1;
            const steps = 3 + Math.floor(Math.random() * 3);

            for (let i = 0; i < steps; i++) {
                x += dir * rand(60, 200);
                points.push({ x, y });
                if (i < steps - 1) {
                    y += rand(-90, 90);
                    points.push({ x, y });
                }
            }
            return { points };
        };

        const buildScene = () => {
            const count = Math.max(6, Math.floor(w / 130));
            traces = Array.from({ length: count }, makeTrace);
            pulses = traces.map((_, i) => ({
                trace: i,
                t: Math.random(),                 // 0..1 along the trace
                speed: rand(0.0012, 0.003),
            }));
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildScene();
        };

        // point at fraction t (0..1) along a polyline
        const pointAt = (points, t) => {
            let total = 0;
            const lens = [];
            for (let i = 1; i < points.length; i++) {
                const L = Math.hypot(points[i].x - points[i - 1].x,
                                     points[i].y - points[i - 1].y);
                lens.push(L);
                total += L;
            }
            let target = t * total;
            for (let i = 0; i < lens.length; i++) {
                if (target <= lens[i]) {
                    const k = lens[i] === 0 ? 0 : target / lens[i];
                    return {
                        x: points[i].x + (points[i + 1].x - points[i].x) * k,
                        y: points[i].y + (points[i + 1].y - points[i].y) * k,
                    };
                }
                target -= lens[i];
            }
            return points[points.length - 1];
        };

        const draw = () => {
            if (!running) return;
            ctx.clearRect(0, 0, w, h);

            // traces + end pads
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(83, 214, 255, 0.07)';
            ctx.fillStyle = 'rgba(83, 214, 255, 0.10)';
            traces.forEach(({ points }) => {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.stroke();
                const end = points[points.length - 1];
                ctx.beginPath();
                ctx.arc(end.x, end.y, 3.5, 0, Math.PI * 2);
                ctx.fill();
            });

            // travelling signal pulses
            pulses.forEach((p) => {
                p.t += p.speed;
                if (p.t > 1) p.t = 0;
                const pos = pointAt(traces[p.trace].points, p.t);
                const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 7);
                grad.addColorStop(0, 'rgba(83, 214, 255, 0.85)');
                grad.addColorStop(1, 'rgba(83, 214, 255, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(draw);
        };

        // pause rendering when the hero scrolls out of view
        new IntersectionObserver((entries) => {
            const visible = entries[0].isIntersecting;
            if (visible && !running) {
                running = true;
                requestAnimationFrame(draw);
            } else if (!visible) {
                running = false;
            }
        }).observe(canvas);

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        });

        resize();
        requestAnimationFrame(draw);
    }

    /* ---------------------------------------------------------
       Easter egg — click the hero name 5 times
       --------------------------------------------------------- */
    const EGG_CLICKS = 5;
    const heroName = document.getElementById('hero-name');
    const gameModal = document.getElementById('game-modal');
    const gameClose = document.getElementById('game-close');
    const gameBackdrop = document.getElementById('game-backdrop');
    let clicks = 0;
    let clickTimer;

    heroName.addEventListener('click', () => {
        clicks++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clicks = 0; }, 1600);

        heroName.classList.remove('egg-shake');
        // restart the shake animation on every click
        void heroName.offsetWidth;
        heroName.classList.add('egg-shake');

        if (clicks >= EGG_CLICKS) {
            clicks = 0;
            openGame();
        }
    });

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

    /* ---------------------------------------------------------
       Footer year
       --------------------------------------------------------- */
    document.getElementById('year').textContent = new Date().getFullYear();
})();
