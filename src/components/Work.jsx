import { projects } from '../data/content.js';
import SectionHead from './SectionHead.jsx';
import HubMock from './HubMock.jsx';
import LoopVideo from './LoopVideo.jsx';
import Stats from './Stats.jsx';

/**
 * A lead visual with a strip of thumbnails. Every image opens the lightbox.
 * If the project has a video, that leads and all images become thumbnails.
 */
function Gallery({ title, media, onOpen }) {
  const open = (index) => onOpen({ type: 'gallery', title, images: media.images, index });
  const thumbsFrom = media.video ? 0 : 1;

  // For the flashlight effect: keep the beam centred on the cursor.
  const aim = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--x', `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty('--y', `${event.clientY - box.top}px`);
  };

  return (
    <div className="gallery">
      {media.video ? (
        <figure className="frame gallery__lead">
          <LoopVideo src={media.video.src} label={media.video.label} />
        </figure>
      ) : (
        <button
          type="button"
          className={`frame gallery__lead${media.flashlight ? ' flashlight' : ''}`}
          onPointerMove={media.flashlight ? aim : undefined}
          onClick={() => open(0)}
        >
          <img src={media.images[0].src} alt={media.images[0].alt} loading="lazy" />
          {media.flashlight ? <span className="flashlight__hint">Move your cursor to look around</span> : null}
        </button>
      )}

      <ul className="gallery__thumbs">
        {media.images.slice(thumbsFrom).map((image, i) => (
          <li key={image.src}>
            <button type="button" className="frame" onClick={() => open(i + thumbsFrom)}>
              <img src={image.src} alt={image.alt} loading="lazy" />
              <span>{image.caption}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Case({ project, number, onOpen }) {
  return (
    <article className="case" id={project.id}>
      <header className="case__head" data-reveal>
        <span className="case__number">{number}</span>
        <h3 className="case__title">{project.title}</h3>
        <p className="case__meta">
          <span>{project.kind}</span>
          <span>{project.year}</span>
          <span className="case__status">{project.status}</span>
        </p>
      </header>

      <div className="case__media" data-reveal>
        {project.media.type === 'hub' ? (
          <HubMock />
        ) : (
          <Gallery title={project.title} media={project.media} onOpen={onOpen} />
        )}
      </div>

      {project.stats ? <Stats items={project.stats} /> : null}

      <div className="case__body" data-reveal>
        <div className="case__intro">
          <p className="case__summary">{project.summary}</p>
          <p>{project.body}</p>
          <ul className="tags" aria-label="Built with">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <ul className="points">
          {project.highlights.map((point) => (
            <li key={point.title}>
              <h4>{point.title}</h4>
              <p>{point.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {project.flow ? (
        <div className="flow" data-reveal>
          <p className="eyebrow">How it fits together</p>
          <ol>
            {project.flow.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </article>
  );
}

export default function Work({ onOpen }) {
  return (
    <section className="section container" id="work">
      <SectionHead index="01" label="Selected work" title="Three things I’m building now.">
        A web app my household depends on, and two games that keep my systems thinking honest.
      </SectionHead>
      {projects.map((project, i) => (
        <Case key={project.id} project={project} number={`0${i + 1}`} onOpen={onOpen} />
      ))}
    </section>
  );
}
