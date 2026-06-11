/* ============================================================
   Circuit Runner — hidden easter-egg mini-game
   A Chrome-dino-style runner: a small robot jumps over
   electronic components. Canvas-only, no dependencies.
   Exposed as window.CircuitRunner = { start, stop }.
   ============================================================ */
(() => {
    'use strict';

    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // logical resolution (CSS scales it responsively)
    const W = 640;
    const H = 220;
    const GROUND_Y = 180;

    const COLORS = {
        bg: '#0a0a0b',
        ground: 'rgba(243, 242, 239, 0.45)',
        grid: 'rgba(255, 255, 255, 0.05)',
        robot: '#f3f2ef',
        robotEye: '#0a0a0b',
        obstacle: '#9b9a96',
        obstacleAlt: '#c9c7c1',
        text: '#f3f2ef',
        muted: '#9b9a96',
    };

    const STATE = { READY: 0, PLAYING: 1, OVER: 2 };

    let state = STATE.READY;
    let rafId = null;
    let lastTime = 0;
    let speed, score, hiScore, spawnTimer, obstacles;

    try {
        hiScore = Number(localStorage.getItem('cr-hiscore')) || 0;
    } catch { hiScore = 0; }

    const robot = {
        x: 70,
        y: GROUND_Y,
        w: 30,
        h: 34,
        vy: 0,
        jumping: false,
    };

    const GRAVITY = 2400;        // px/s²
    const JUMP_VELOCITY = -780;  // px/s

    /* ------------------------ game logic ------------------------ */

    const reset = () => {
        speed = 300;             // px/s, ramps up with score
        score = 0;
        spawnTimer = 0;
        obstacles = [];
        robot.y = GROUND_Y;
        robot.vy = 0;
        robot.jumping = false;
    };

    const jump = () => {
        if (state === STATE.READY || state === STATE.OVER) {
            reset();
            state = STATE.PLAYING;
            return;
        }
        if (!robot.jumping) {
            robot.vy = JUMP_VELOCITY;
            robot.jumping = true;
        }
    };

    const spawnObstacle = () => {
        // two component types with different silhouettes
        const isResistor = Math.random() < 0.55;
        obstacles.push(isResistor
            ? { type: 'resistor', x: W + 20, w: 38, h: 26 }
            : { type: 'capacitor', x: W + 20, w: 22, h: 40 });
    };

    const update = (dt) => {
        if (state !== STATE.PLAYING) return;

        // robot physics
        robot.vy += GRAVITY * dt;
        robot.y += robot.vy * dt;
        if (robot.y >= GROUND_Y) {
            robot.y = GROUND_Y;
            robot.vy = 0;
            robot.jumping = false;
        }

        // difficulty ramp
        speed += 8 * dt;
        score += speed * dt * 0.05;

        // obstacles
        spawnTimer -= dt;
        if (spawnTimer <= 0) {
            spawnObstacle();
            // gap shrinks as speed grows, with randomness
            spawnTimer = (0.9 + Math.random() * 0.9) * (380 / speed);
        }
        obstacles.forEach((o) => { o.x -= speed * dt; });
        obstacles = obstacles.filter((o) => o.x + o.w > -10);

        // collision (AABB with small forgiveness margin)
        const rx = robot.x + 4, rw = robot.w - 8;
        const ry = robot.y - robot.h + 4, rh = robot.h - 6;
        for (const o of obstacles) {
            const oy = GROUND_Y - o.h;
            if (rx < o.x + o.w && rx + rw > o.x &&
                ry < oy + o.h && ry + rh > oy) {
                state = STATE.OVER;
                if (score > hiScore) {
                    hiScore = Math.floor(score);
                    try { localStorage.setItem('cr-hiscore', hiScore); } catch {}
                }
                break;
            }
        }
    };

    /* ------------------------ rendering ------------------------ */

    const drawRobot = () => {
        const x = robot.x;
        const y = robot.y - robot.h;
        ctx.fillStyle = COLORS.robot;
        // body
        ctx.fillRect(x, y + 10, robot.w, robot.h - 14);
        // head
        ctx.fillRect(x + 4, y, robot.w - 8, 14);
        // eye
        ctx.fillStyle = COLORS.robotEye;
        ctx.fillRect(x + robot.w - 12, y + 4, 5, 5);
        // antenna
        ctx.strokeStyle = COLORS.robot;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 8, y);
        ctx.lineTo(x + 8, y - 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + 8, y - 9, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffb454';
        ctx.fill();
        // legs (animated while running on the ground)
        ctx.fillStyle = COLORS.robot;
        const phase = state === STATE.PLAYING && !robot.jumping
            ? Math.floor(performance.now() / 90) % 2 : 0;
        ctx.fillRect(x + 5, robot.y - 4, 6, 4 + (phase ? 0 : 2));
        ctx.fillRect(x + robot.w - 11, robot.y - 4, 6, 4 + (phase ? 2 : 0));
    };

    const drawObstacle = (o) => {
        const y = GROUND_Y - o.h;
        if (o.type === 'resistor') {
            // body with color bands, axial leads
            ctx.strokeStyle = COLORS.obstacle;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(o.x - 8, y + o.h / 2);
            ctx.lineTo(o.x + o.w + 8, y + o.h / 2);
            ctx.stroke();
            ctx.fillStyle = COLORS.obstacle;
            ctx.fillRect(o.x, y, o.w, o.h);
            ctx.fillStyle = COLORS.bg;
            ctx.fillRect(o.x + 8, y, 4, o.h);
            ctx.fillRect(o.x + 18, y, 4, o.h);
            ctx.fillRect(o.x + 28, y, 4, o.h);
        } else {
            // electrolytic capacitor: can + leads
            ctx.fillStyle = COLORS.obstacleAlt;
            ctx.fillRect(o.x, y, o.w, o.h - 8);
            ctx.fillStyle = COLORS.bg;
            ctx.fillRect(o.x + 4, y + 4, o.w - 8, 4); // stripe
            ctx.strokeStyle = COLORS.obstacleAlt;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(o.x + 6, y + o.h - 8);
            ctx.lineTo(o.x + 6, GROUND_Y);
            ctx.moveTo(o.x + o.w - 6, y + o.h - 8);
            ctx.lineTo(o.x + o.w - 6, GROUND_Y);
            ctx.stroke();
        }
    };

    const drawScene = () => {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, W, H);

        // background grid, scrolling with play speed
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        const offset = state === STATE.PLAYING
            ? (performance.now() * speed * 0.0001) % 32 : 0;
        for (let gx = -offset; gx < W; gx += 32) {
            ctx.beginPath();
            ctx.moveTo(gx, 0);
            ctx.lineTo(gx, H);
            ctx.stroke();
        }

        // ground trace
        ctx.strokeStyle = COLORS.ground;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y + 1);
        ctx.lineTo(W, GROUND_Y + 1);
        ctx.stroke();

        obstacles.forEach(drawObstacle);
        drawRobot();

        // HUD
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillStyle = COLORS.muted;
        ctx.textAlign = 'right';
        ctx.fillText(`HI ${String(Math.floor(hiScore)).padStart(5, '0')}`, W - 16, 26);
        ctx.fillStyle = COLORS.text;
        ctx.fillText(String(Math.floor(score)).padStart(5, '0'), W - 16, 44);

        ctx.textAlign = 'center';
        if (state === STATE.READY) {
            ctx.fillStyle = COLORS.text;
            ctx.font = 'bold 18px "JetBrains Mono", monospace';
            ctx.fillText('CIRCUIT RUNNER', W / 2, 88);
            ctx.font = '13px "JetBrains Mono", monospace';
            ctx.fillStyle = COLORS.muted;
            ctx.fillText('press SPACE or tap to boot', W / 2, 114);
        } else if (state === STATE.OVER) {
            ctx.fillStyle = '#ff6b6b';
            ctx.font = 'bold 18px "JetBrains Mono", monospace';
            ctx.fillText('SEGMENTATION FAULT', W / 2, 88);
            ctx.font = '13px "JetBrains Mono", monospace';
            ctx.fillStyle = COLORS.muted;
            ctx.fillText(`score: ${Math.floor(score)} · press SPACE to reboot`, W / 2, 114);
        }
    };

    /* ------------------------ loop & io ------------------------ */

    const loop = (time) => {
        const dt = Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;
        update(dt);
        drawScene();
        rafId = requestAnimationFrame(loop);
    };

    const onKey = (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            jump();
        }
    };
    const onPointer = (e) => {
        e.preventDefault();
        jump();
    };

    const start = () => {
        if (rafId !== null) return;
        state = STATE.READY;
        reset();
        lastTime = performance.now();
        document.addEventListener('keydown', onKey);
        canvas.addEventListener('pointerdown', onPointer);
        rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
        if (rafId === null) return;
        cancelAnimationFrame(rafId);
        rafId = null;
        document.removeEventListener('keydown', onKey);
        canvas.removeEventListener('pointerdown', onPointer);
    };

    window.CircuitRunner = { start, stop };
})();
