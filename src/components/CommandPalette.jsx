import { useEffect, useMemo, useRef, useState } from 'react';
import { earlier, profile, projects } from '../data/content.js';
import { toggleTheme } from '../theme.js';

const jump = (id) => () => document.getElementById(id)?.scrollIntoView();

/**
 * Ctrl/Cmd + K (or "/") opens a searchable list of everything the site can do:
 * jump to a section, launch a game, grab the résumé, copy the email, flip the theme.
 */
export default function CommandPalette({ open, onClose, onOpenMedia, onToast }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const commands = useMemo(
    () => [
      ...projects.map((project) => ({ group: 'Work', label: project.title, hint: project.kind, run: jump(project.id) })),
      { group: 'Work', label: 'Retro Rumble', hint: 'Earlier work', run: jump('earlier') },
      ...earlier.feature.games.map((game) => ({
        group: 'Play',
        label: `Play ${game.title}`,
        hint: 'Opens the game',
        run: () => onOpenMedia({ type: 'game', ...game }),
      })),
      { group: 'Go to', label: 'Experience', run: jump('experience') },
      { group: 'Go to', label: 'About', run: jump('about') },
      { group: 'Go to', label: 'Contact', run: jump('contact') },
      { group: 'Go to', label: 'Top of page', run: jump('top') },
      { group: 'Do', label: 'Open résumé', hint: 'PDF', run: () => window.open(profile.resume, '_blank', 'noopener') },
      {
        group: 'Do',
        label: 'Copy email address',
        hint: profile.email,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            onToast('Email copied');
          } catch (e) {
            window.location.href = `mailto:${profile.email}`;
          }
        },
      },
      { group: 'Do', label: 'Switch light / dark theme', run: () => toggleTheme() },
      { group: 'Links', label: 'LinkedIn', hint: '↗', run: () => window.open(profile.linkedin, '_blank', 'noopener') },
      { group: 'Links', label: 'GitHub', hint: '↗', run: () => window.open(profile.github, '_blank', 'noopener') },
    ],
    [onOpenMedia, onToast]
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) => `${command.group} ${command.label} ${command.hint ?? ''}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) {
      setQuery('');
      setCursor(0);
      dialog.showModal();
      inputRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  const run = (command) => {
    onClose();
    // Let the dialog close first so focus and scrolling land on the page.
    setTimeout(command.run, 0);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((i) => Math.min(i + 1, matches.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' && matches[cursor]) {
      event.preventDefault();
      run(matches[cursor]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="Command palette"
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <input
        ref={inputRef}
        className="palette__input"
        type="text"
        placeholder="Search the site, or type a command"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        role="combobox"
        aria-expanded="true"
        aria-controls="palette-list"
        aria-activedescendant={matches[cursor] ? `palette-${cursor}` : undefined}
        autoComplete="off"
        spellCheck="false"
      />
      <ul className="palette__list" id="palette-list" role="listbox">
        {matches.map((command, i) => (
          <li
            key={command.label}
            id={`palette-${i}`}
            role="option"
            aria-selected={i === cursor}
            className={i === cursor ? 'is-active' : undefined}
            onPointerMove={() => setCursor(i)}
            onClick={() => run(command)}
            ref={(node) => i === cursor && node?.scrollIntoView({ block: 'nearest' })}
          >
            <span className="palette__group">{command.group}</span>
            <span className="palette__label">{command.label}</span>
            {command.hint ? <span className="palette__hint">{command.hint}</span> : null}
          </li>
        ))}
        {matches.length === 0 ? <li className="palette__empty">Nothing matches “{query}”.</li> : null}
      </ul>
      <p className="palette__foot">
        <kbd>↑</kbd>
        <kbd>↓</kbd> to move <kbd>Enter</kbd> to run <kbd>Esc</kbd> to close
      </p>
    </dialog>
  );
}
