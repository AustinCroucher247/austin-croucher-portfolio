import { useEffect, useRef, useState } from 'react';

/** Counts up from zero the first time it scrolls into view. */
function CountUp({ to, suffix = '' }) {
  const ref = useRef(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm || !('IntersectionObserver' in window)) return undefined;

    setValue(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1100;
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(to * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export default function Stats({ items }) {
  return (
    <dl className="stats" data-reveal>
      {items.map((item) => (
        <div key={item.label}>
          <dd>
            <CountUp to={item.value} suffix={item.suffix} />
          </dd>
          <dt>{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}
