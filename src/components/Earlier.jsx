import { earlier } from '../data/content.js';
import SectionHead from './SectionHead.jsx';

function Tags({ items }) {
  return (
    <ul className="tags" aria-label="Built with">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function Earlier({ onOpen }) {
  const { feature, rest } = earlier;

  return (
    <section className="section container" id="earlier">
      <SectionHead index="02" label="Earlier work" title="Where the games habit started.">
        Projects from my first year writing code. Two of the games are playable right here.
      </SectionHead>

      <article className="arcade" data-reveal data-glow>
        <div className="arcade__shots">
          {feature.images.map((image) => (
            <figure className="frame" key={image.src}>
              <img src={image.src} alt={image.alt} loading="lazy" />
            </figure>
          ))}
        </div>
        <div className="arcade__body">
          <p className="card__meta">
            {feature.kind} · {feature.year}
          </p>
          <h3 className="card__title">{feature.title}</h3>
          <p>{feature.summary}</p>
          <Tags items={feature.stack} />
          <div className="card__actions">
            {feature.games.map((game) => (
              <button
                key={game.src}
                type="button"
                className="button button--solid"
                onClick={() => onOpen({ type: 'game', ...game })}
              >
                Play {game.title}
              </button>
            ))}
            <button type="button" className="button" onClick={() => onOpen({ type: 'video', ...feature.video })}>
              Watch the demo
            </button>
          </div>
          <p className="card__hint">Keyboard on desktop, on-screen buttons on a phone.</p>
        </div>
      </article>

      <div className="cards">
        {rest.map((item) => (
          <article className="card" key={item.id} data-reveal data-glow>
            <figure className="frame">
              <img src={item.image.src} alt={item.image.alt} loading="lazy" />
            </figure>
            <p className="card__meta">
              {item.kind} · {item.year}
            </p>
            <h3 className="card__title">{item.title}</h3>
            <p>{item.summary}</p>
            <Tags items={item.stack} />
            <div className="card__actions">
              <button type="button" className="button" onClick={() => onOpen({ type: 'video', ...item.video })}>
                Watch the demo
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
