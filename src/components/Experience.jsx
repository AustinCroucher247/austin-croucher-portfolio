import { education, experience } from '../data/content.js';
import SectionHead from './SectionHead.jsx';

export default function Experience() {
  return (
    <section className="section container" id="experience">
      <SectionHead index="03" label="Experience" title="Agency developer, former restaurant GM." />

      <ol className="timeline">
        {experience.map((job) => (
          <li key={job.org} className="timeline__row" data-reveal>
            <p className="timeline__dates">{job.dates}</p>
            <div className="timeline__role">
              <h3>{job.role}</h3>
              <p>
                {job.org}
                <span>{job.meta}</span>
              </p>
            </div>
            <p className="timeline__text">{job.text}</p>
          </li>
        ))}
      </ol>

      <div className="education" data-reveal>
        <p className="eyebrow">Education</p>
        <ul>
          {education.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>
                {item.org}
                {item.dates ? `, ${item.dates}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
