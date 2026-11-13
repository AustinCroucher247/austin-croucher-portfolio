import { useCallback, useEffect, useState } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Ticker from './components/Ticker.jsx';
import Work from './components/Work.jsx';
import Earlier from './components/Earlier.jsx';
import Experience from './components/Experience.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import MediaDialog from './components/MediaDialog.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import { earlier } from './data/content.js';
import useReveal from './hooks/useReveal.js';
import useSiteExtras from './hooks/useSiteExtras.js';

export default function App() {
  // One dialog for every demo, game and screenshot. See MediaDialog for the shapes.
  const [media, setMedia] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const closeMedia = useCallback(() => setMedia(null), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const launchInvaders = useCallback(() => {
    setToast('Cheat code accepted');
    setMedia({ type: 'game', ...earlier.feature.games[0] });
  }, []);

  useReveal();
  useSiteExtras({ onPalette: openPalette, onKonami: launchInvaders });

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <Nav onPalette={openPalette} />
      <main>
        <Hero />
        <Ticker />
        <Work onOpen={setMedia} />
        <Earlier onOpen={setMedia} />
        <Experience />
        <About />
      </main>
      <Contact onToast={setToast} />
      <MediaDialog media={media} onClose={closeMedia} />
      <CommandPalette open={paletteOpen} onClose={closePalette} onOpenMedia={setMedia} onToast={setToast} />
      <div className="toast" role="status" aria-live="polite">
        {toast ? <span key={toast}>{toast}</span> : null}
      </div>
    </>
  );
}
