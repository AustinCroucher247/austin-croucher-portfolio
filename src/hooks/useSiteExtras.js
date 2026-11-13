import { useEffect } from 'react';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const typing = (target) => target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/**
 * Page-wide keyboard and pointer extras:
 *   - Ctrl/Cmd + K or "/" opens the command palette
 *   - the Konami code launches Space Invaders
 *   - cards marked [data-glow] get a soft light that follows the cursor
 */
export default function useSiteExtras({ onPalette, onKonami }) {
  useEffect(() => {
    let progress = 0;

    const onKeyDown = (event) => {
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing(event.target))) {
        event.preventDefault();
        onPalette();
        return;
      }
      if (typing(event.target) || document.querySelector('dialog[open]')) return;
      progress = event.key === KONAMI[progress] ? progress + 1 : event.key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        onKonami();
      }
    };

    const onPointerMove = (event) => {
      const card = event.target instanceof Element ? event.target.closest('[data-glow]') : null;
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--gx', `${event.clientX - box.left}px`);
      card.style.setProperty('--gy', `${event.clientY - box.top}px`);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [onPalette, onKonami]);
}
