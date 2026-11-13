import { useEffect, useRef } from 'react';

/*
 * The dot field behind the hero. A grid of dots drifts in a slow wave, and
 * dots near the pointer swell, warm to the accent colour and lean away.
 * It pauses off screen, follows the theme, and draws a single still frame
 * for visitors who prefer reduced motion.
 */

const GAP = 26;
const REACH = 170;

export default function HeroField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let colours = { ink: '#16150f', accent: '#cf4318' };

    const readColours = () => {
      const styles = getComputedStyle(document.documentElement);
      colours = {
        ink: styles.getPropertyValue('--ink').trim() || colours.ink,
        accent: styles.getPropertyValue('--accent').trim() || colours.accent,
      };
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(performance.now());
    };

    const draw = (now) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;

      for (let y = GAP / 2; y < height; y += GAP) {
        for (let x = GAP / 2; x < width; x += GAP) {
          const wave = still ? 0.5 : (Math.sin(x * 0.012 + y * 0.018 + t * 0.9) + 1) / 2;
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const pull = Math.max(0, 1 - distance / REACH);
          const eased = pull * pull;
          const push = eased * 10;
          const px = x + (distance ? (dx / distance) * push : 0);
          const py = y + (distance ? (dy / distance) * push : 0);

          ctx.globalAlpha = 0.1 + wave * 0.12 + eased * 0.7;
          ctx.fillStyle = eased > 0.04 ? colours.accent : colours.ink;
          ctx.beginPath();
          ctx.arc(px, py, 1.1 + wave * 0.5 + eased * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      if (visible) draw(now);
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

    readColours();
    resize();

    const themeWatch = new MutationObserver(() => {
      readColours();
      draw(performance.now());
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onScheme = () => {
      readColours();
      draw(performance.now());
    };
    schemeQuery.addEventListener('change', onScheme);

    const viewWatch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    viewWatch.observe(canvas);

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
      schemeQuery.removeEventListener('change', onScheme);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero__field" aria-hidden="true" />;
}
