import { useEffect, useState } from 'react';
import { getTheme, onThemeChange, toggleTheme } from '../theme.js';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme);
  useEffect(() => onThemeChange(setTheme), []);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={(event) => toggleTheme(event.currentTarget)}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <span className="theme-toggle__dot" aria-hidden="true" />
      <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
