import { useEffect, useState } from 'react';
import { profile } from '../data/content.js';
import ThemeToggle from './ThemeToggle.jsx';

const links = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav({ onPalette }) {
  const [active, setActive] = useState(null);

  // Highlight the link for whichever section is crossing the middle of the screen.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const watched = ['top', 'work', 'earlier', 'experience', 'about', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          setActive(id === 'earlier' ? 'work' : id === 'top' ? null : id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    watched.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="nav__brand" href="#top" aria-label="Austin Croucher, back to top">
          Austin Croucher
        </a>
        <nav className="nav__links" aria-label="Sections">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active === link.id ? 'is-active' : undefined}
              aria-current={active === link.id ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
          <a href={profile.resume} target="_blank" rel="noreferrer" className="nav__resume">
            Résumé
          </a>
        </nav>
        <button type="button" className="nav__palette" onClick={onPalette} aria-label="Open the command palette">
          <span>Search</span>
          <kbd>/</kbd>
        </button>
        <ThemeToggle />
      </div>
      <span className="nav__progress" aria-hidden="true" />
    </header>
  );
}
