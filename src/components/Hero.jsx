import { Fragment } from 'react';
import portrait from '../assets/profile.webp';
import { facts, profile } from '../data/content.js';
import HeroField from './HeroField.jsx';

const title = 'Web developer building clean interfaces, useful tools, and the odd';
const accent = 'video game.';

// Each word rises out of its own clipped line, one after the other.
function Words({ text, from = 0, as: Tag = 'span' }) {
  return text.split(' ').map((word, i) => (
    // The space sits outside the clipped box, or the words would run together.
    <Fragment key={`${word}-${i}`}>
      <span className="word">
        <Tag style={{ '--i': from + i }}>{word}</Tag>
      </span>{' '}
    </Fragment>
  ));
}

export default function Hero() {
  const offset = title.split(' ').length;

  return (
    <section className="hero" id="top">
      <HeroField />
      <div className="container hero__inner">
        <div className="hero__id rise" style={{ '--d': 0 }}>
          <img className="hero__portrait" src={portrait} alt="Austin Croucher" width="64" height="64" />
          <p className="eyebrow">
            {profile.role} <span aria-hidden="true">·</span> {profile.location}
          </p>
        </div>

        <h1 className="hero__title" aria-label={`${title} ${accent}`}>
          <span aria-hidden="true">
            <Words text={title} />
            <Words text={accent} from={offset} as="em" />
          </span>
        </h1>

        <p className="hero__lede rise" style={{ '--d': 1 }}>
          I’m Austin. For the past three years I’ve shipped client work at The Design Cell. Outside
          of that I build things end to end: a home app my household runs on every day, and two
          games in Unity.
        </p>

        <div className="hero__actions rise" style={{ '--d': 2 }}>
          <a className="button button--solid" href="#work">
            See the work <span aria-hidden="true">↓</span>
          </a>
          <a className="button" href={profile.resume} target="_blank" rel="noreferrer">
            Résumé <span aria-hidden="true">↗</span>
          </a>
          <a className="button" href={`mailto:${profile.email}`}>
            Email me
          </a>
        </div>

        <dl className="facts rise" style={{ '--d': 3 }}>
          {facts.map((fact) => (
            <div key={fact.label} className="facts__item">
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
