import { useEffect, useState } from 'react';
import { profile } from '../data/content.js';

const clock = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: 'numeric', minute: '2-digit' });

/** The current time where I am, so you know whether to expect a quick reply. */
function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(timer);
  }, []);
  return <span>Toronto, {clock.format(now)}</span>;
}

export default function Contact({ onToast }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      onToast('Email copied');
    } catch (e) {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer className="contact" id="contact">
      <div className="container">
        <p className="eyebrow">
          <span className="eyebrow__index">05</span> Contact
        </p>
        <h2 className="contact__title">
          Let’s build <em>something good.</em>
        </h2>
        <div className="contact__row">
          <a className="contact__email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <button type="button" className="button" onClick={copy}>
            Copy
          </button>
        </div>

        <div className="contact__foot">
          <ul className="contact__links">
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.resume} target="_blank" rel="noreferrer">
                Résumé (PDF)
              </a>
            </li>
            <li>
              <a href="#top">Back to top</a>
            </li>
          </ul>
          <p>
            <LocalTime /> · © {new Date().getFullYear()} Austin Croucher · Press <kbd>/</kbd> for commands
          </p>
        </div>
      </div>
    </footer>
  );
}
