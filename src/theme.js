/*
 * Theme state lives on <html data-theme>, so it works before React loads
 * (see the inline script in index.html). This module is the one place that
 * reads and changes it.
 */

const listeners = new Set();

export function getTheme() {
  const set = document.documentElement.dataset.theme;
  if (set) return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function onThemeChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function apply(next) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch (e) {
    /* private mode: the choice just lasts for this visit */
  }
  listeners.forEach((listener) => listener(next));
}

/**
 * Switches theme. Where the browser supports view transitions, the new
 * theme sweeps out in a circle from `origin` (the element that was pressed).
 */
export function toggleTheme(origin) {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.startViewTransition || calm) {
    apply(next);
    return;
  }

  const box = origin?.getBoundingClientRect();
  const root = document.documentElement;
  root.style.setProperty('--tx', `${box ? box.left + box.width / 2 : window.innerWidth / 2}px`);
  root.style.setProperty('--ty', `${box ? box.top + box.height / 2 : 0}px`);
  root.classList.add('theme-switching');
  document.startViewTransition(() => apply(next)).finished.finally(() => root.classList.remove('theme-switching'));
}
