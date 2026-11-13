import { useEffect, useRef } from 'react';

/** A muted looping clip that only plays while it is on screen. */
export default function LoopVideo({ src, label }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!('IntersectionObserver' in window)) return undefined;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !still) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return <video ref={ref} src={src} aria-label={label} muted loop playsInline preload="metadata" />;
}
