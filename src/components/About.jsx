import portrait from '../assets/profile.webp';
import { toolbox } from '../data/content.js';
import SectionHead from './SectionHead.jsx';

export default function About() {
  return (
    <section className="section container" id="about">
      <SectionHead index="04" label="About" title="A non-linear route into software." />

      <div className="about">
        <figure className="about__photo frame" data-reveal>
          <img src={portrait} alt="Austin Croucher smiling in front of a brick wall." loading="lazy" />
        </figure>

        <div className="about__text" data-reveal>
          <p className="about__lead">
            I studied philosophy, spent a decade running restaurants, and then moved into
            software. What ties it together is an interest in how people make decisions and how
            small design choices change what they do.
          </p>
          <p>
            Managing a busy restaurant taught me to plan for the bad day, communicate plainly and
            keep a team moving. I bring the same habits to code: clear structure, honest estimates,
            and software that still makes sense to whoever opens it next.
          </p>
          <p>
            I like the work that sits between disciplines: turning a loose idea into a spec,
            spotting the friction in a flow, and building the thing so it gets used the way it was
            meant to. Lately that includes working AI-first, where a language model is part of how I
            build and part of what I ship.
          </p>
        </div>

        <dl className="toolbox" data-reveal>
          {toolbox.map((group) => (
            <div key={group.label}>
              <dt>{group.label}</dt>
              <dd>{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
