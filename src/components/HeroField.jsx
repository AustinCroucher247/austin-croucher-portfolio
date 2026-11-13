import { useEffect, useRef } from 'react';

/*
 * The dot field behind the hero.
 *
 * At rest: a grid of dots drifts in a slow wave, and dots near the pointer
 * swell, warm to the accent colour and lean away.
 *
 * On the first visit of a session the same dots start out spelling the name
 * in dot-matrix letters, hold for a beat, then fly apart to their places in
 * the grid (see the `intro-play` class set in index.html). Any click, key or
 * scroll skips ahead. Reduced-motion visitors get one still frame instead.
 */

const GAP = 26;
const REACH = 170;
const NAME = ['Austin', 'Croucher'];

// Intro timeline, in milliseconds.
const FADE_IN = 260;
const HOLD_UNTIL = 1050;
const SCATTER = 1150;
const STAGGER = 380;

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

/** Where the name's dots sit: a regular lattice sampled from the rendered text. */
function nameLattice(width, height, budget) {
  const scratch = document.createElement('canvas');
  scratch.width = width;
  scratch.height = height;
  const ctx = scratch.getContext('2d', { willReadFrequently: true });
  const lines = width < 720 ? NAME : [NAME.join(' ')];
  const family = '600 100px Geist, "Segoe UI", system-ui, sans-serif';

  ctx.font = family;
  const widest = Math.max(...lines.map((line) => ctx.measureText(line).width));
  const size = Math.min((width * 0.86 * 100) / widest, height * 0.3);
  ctx.font = family.replace('100px', `${size}px`);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  const middle = Math.min(height * 0.42, 360);
  lines.forEach((line, i) => ctx.fillText(line, width / 2, middle + (i - (lines.length - 1) / 2) * size * 1.02));

  const pixels = ctx.getImageData(0, 0, width, height).data;
  // Coarsen the lattice until the name fits in the dots we have.
  for (let step = 4; step < 40; step++) {
    const points = [];
    for (let y = step / 2; y < height; y += step) {
      for (let x = step / 2; x < width; x += step) {
        if (pixels[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] > 128) points.push({ x, y });
      }
    }
    if (points.length <= budget) return points;
  }
  return [];
}

export default function HeroField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const root = document.documentElement;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let width = 0;
    let height = 0;
    let dots = [];
    let frame = 0;
    let visible = true;
    let introStart = root.classList.contains('intro-play') && !still ? -1 : null; // -1: waiting for first frame
    let colours = { ink: '#16150f', accent: '#cf4318' };

    const readColours = () => {
      const styles = getComputedStyle(root);
      colours = {
        ink: styles.getPropertyValue('--ink').trim() || colours.ink,
        accent: styles.getPropertyValue('--accent').trim() || colours.accent,
      };
    };

    // The field fades out toward the left so it never sits behind the text.
    const fade = (x, y) => {
      const d = Math.hypot((x - width * 0.88) / (width * 0.9), (y - height * 0.28) / (height * 0.95));
      return Math.min(1, Math.max(0, (0.78 - d) / 0.53));
    };

    const build = () => {
      dots = [];
      for (let y = GAP / 2; y < height; y += GAP) {
        for (let x = GAP / 2; x < width; x += GAP) dots.push({ hx: x, hy: y, fade: fade(x, y) });
      }
      if (introStart === null) return;

      // Hand each lattice point of the name to the nearest-ranked grid dot, left to right,
      // so the letters come apart sideways rather than every dot crossing the screen.
      const points = nameLattice(width, height, dots.length).sort((a, b) => a.x - b.x);
      const order = dots.map((_, i) => i).sort((a, b) => dots[a].hx - dots[b].hx);
      const stride = dots.length / Math.max(points.length, 1);
      points.forEach((point, i) => {
        const dot = dots[order[Math.floor(i * stride)]];
        dot.sx = point.x;
        dot.sy = point.y;
        dot.hot = Math.random() < 0.07;
      });
      dots.forEach((dot) => {
        dot.delay = Math.random() * STAGGER;
      });
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      // A resize mid-intro just ends it; the letters would no longer line up.
      if (introStart !== null && introStart !== -1) endIntro();
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      build();
      draw(performance.now());
    };

    const endIntro = () => {
      introStart = null;
      root.classList.remove('intro-play');
    };

    const skipIntro = () => {
      if (introStart === null || introStart === -1) return;
      const elapsed = performance.now() - introStart;
      if (elapsed < HOLD_UNTIL) introStart -= HOLD_UNTIL - elapsed;
    };

    const draw = (now) => {
      const t = now / 1000;
      if (introStart === -1) introStart = now;
      const elapsed = introStart === null ? Infinity : now - introStart;
      if (elapsed > HOLD_UNTIL + SCATTER + STAGGER) endIntro();
      const appear = Math.min(elapsed / FADE_IN, 1);

      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;

      for (const dot of dots) {
        // 0 while the dot is part of the name, 1 once it is home in the grid.
        const settle = introStart === null ? 1 : easeInOut(Math.min(Math.max((elapsed - HOLD_UNTIL - dot.delay) / SCATTER, 0), 1));
        const inName = dot.sx !== undefined;
        const x = inName ? lerp(dot.sx, dot.hx, settle) : dot.hx;
        const y = inName ? lerp(dot.sy, dot.hy, settle) : dot.hy;

        const wave = still ? 0.5 : (Math.sin(dot.hx * 0.012 + dot.hy * 0.018 + t * 0.9) + 1) / 2;
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const pull = Math.max(0, 1 - distance / REACH);
        const eased = pull * pull * settle;
        const push = eased * 10;

        const restAlpha = (0.1 + wave * 0.12 + eased * 0.7) * (eased > 0.04 ? 1 : dot.fade);
        const alpha = lerp(inName ? 0.92 * appear : 0, restAlpha, settle);
        if (alpha < 0.01) continue;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = eased > 0.04 || (dot.hot && settle < 0.85) ? colours.accent : colours.ink;
        ctx.beginPath();
        ctx.arc(
          x + (distance ? (dx / distance) * push : 0),
          y + (distance ? (dy / distance) * push : 0),
          lerp(1.9, 1.1 + wave * 0.5 + eased * 2.4, settle),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      if (visible || introStart !== null) draw(now);
      frame = requestAnimationFrame(loop);
    };

    const onMove = (event) => {
      const box = canvas.getBoundingClientRect();
      pointer.tx = event.clientX - box.left;
      pointer.ty = event.clientY - box.top;
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };
    const repaint = () => {
      readColours();
      draw(performance.now());
    };

    readColours();
    resize();

    const themeWatch = new MutationObserver(repaint);
    themeWatch.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    schemeQuery.addEventListener('change', repaint);

    const viewWatch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    viewWatch.observe(canvas);

    const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    skipEvents.forEach((type) => window.addEventListener(type, skipIntro, { passive: true }));
    window.addEventListener('resize', resize);
    if (!still) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      themeWatch.disconnect();
      viewWatch.disconnect();
      schemeQuery.removeEventListener('change', repaint);
      skipEvents.forEach((type) => window.removeEventListener(type, skipIntro));
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero__field" aria-hidden="true" />;
}
