import { useCallback, useEffect, useRef, useState } from 'react';
import {
  COST,
  MAX_WORKERS,
  addWorker,
  createSim,
  describeJobs,
  designateBuild,
  designateGather,
  hit,
  step,
  suggestBuildCell,
  suggestPile,
} from '../lib/colonySim.js';

const INTRO = 'Click a scrap pile to send someone to gather it. Nobody moves unless you queue the work.';

const gridFor = (width) => (width < 560 ? { cols: 16, rows: 10 } : { cols: 28, rows: 14 });

function readColours() {
  const styles = getComputedStyle(document.documentElement);
  const get = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;
  return {
    ink: get('--ink', '#16150f'),
    muted: get('--muted', '#6e6a60'),
    accent: get('--accent', '#cf4318'),
    line: get('--line-strong', 'rgba(22,21,15,0.24)'),
  };
}

/**
 * A playable miniature of the job queue from From Ashes to Orbit. The logic lives in
 * lib/colonySim.js; this component draws it and wires up the controls.
 */
export default function ColonyDemo() {
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const speedRef = useRef(1);
  const [view, setView] = useState(null);
  const [status, setStatus] = useState(INTRO);
  const [speed, setSpeed] = useState(1);

  const snapshot = useCallback(() => {
    const sim = simRef.current;
    if (!sim) return;
    setView({
      stock: sim.stock,
      modules: sim.structures.length,
      workers: sim.workers.length,
      jobs: describeJobs(sim),
    });
    while (sim.notes.length) setStatus(sim.notes.shift());
  }, []);

  const reset = useCallback(() => {
    const canvas = canvasRef.current;
    simRef.current = createSim(gridFor(canvas.parentElement.clientWidth));
    canvas.style.aspectRatio = `${simRef.current.cols} / ${simRef.current.rows}`;
    setStatus(INTRO);
    snapshot();
  }, [snapshot]);

  // Drawing and the simulation loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let colours = readColours();
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();
    let visible = true;

    reset();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (now) => {
      const sim = simRef.current;
      if (!sim || !width) return;
      const cs = width / sim.cols;
      const pulse = calm ? 0 : Math.sin(now / 260);
      ctx.clearRect(0, 0, width, height);

      // Ground: a dot at every cell centre.
      ctx.fillStyle = colours.muted;
      ctx.globalAlpha = 0.25;
      for (let y = 0; y < sim.rows; y++) {
        for (let x = 0; x < sim.cols; x++) ctx.fillRect(x * cs + cs / 2 - 1, y * cs + cs / 2 - 1, 2, 2);
      }
      ctx.globalAlpha = 1;

      // Scrap piles shrink as they are worked.
      for (const node of sim.nodes) {
        const cx = (node.x + 0.5) * cs;
        const cy = (node.y + 0.5) * cs;
        const share = node.amount / node.max;
        ctx.beginPath();
        ctx.arc(cx, cy, cs * (0.1 + 0.3 * share), 0, Math.PI * 2);
        if (node.amount > 0) {
          ctx.fillStyle = colours.muted;
          ctx.globalAlpha = 0.85;
          ctx.fill();
        } else {
          ctx.strokeStyle = colours.line;
          ctx.globalAlpha = 0.6;
          ctx.setLineDash([2, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.globalAlpha = 1;
      }

      // Storage.
      const crateSize = cs * 0.78;
      const crateX = (sim.crate.x + 0.5) * cs - crateSize / 2;
      const crateY = (sim.crate.y + 0.5) * cs - crateSize / 2;
      ctx.strokeStyle = colours.ink;
      ctx.lineWidth = 2;
      ctx.strokeRect(crateX, crateY, crateSize, crateSize);
      ctx.fillStyle = colours.ink;
      ctx.globalAlpha = Math.min(0.12 + sim.stock * 0.03, 0.55);
      ctx.fillRect(crateX, crateY, crateSize, crateSize);
      ctx.globalAlpha = 1;

      // Building sites with a progress sweep, then finished modules.
      for (const site of sim.sites) {
        const x = site.x * cs + cs * 0.1;
        const y = site.y * cs + cs * 0.1;
        const size = cs * 0.8;
        ctx.strokeStyle = colours.accent;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(x, y, size, size);
        ctx.setLineDash([]);
        ctx.fillStyle = colours.accent;
        ctx.globalAlpha = 0.55;
        ctx.fillRect(x, y + size * (1 - site.progress), size, size * site.progress);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = colours.accent;
      for (const built of sim.structures) {
        ctx.beginPath();
        ctx.roundRect(built.x * cs + cs * 0.1, built.y * cs + cs * 0.1, cs * 0.8, cs * 0.8, cs * 0.14);
        ctx.fill();
      }

      // Open and claimed jobs: a ring on the target, and a line from whoever claimed it.
      for (const job of sim.jobs) {
        if (job.status === 'done') continue;
        const target =
          job.type === 'gather'
            ? sim.nodes.find((node) => node.id === job.node)
            : sim.sites.find((site) => site.id === job.site);
        if (!target) continue;
        const tx = (target.x + 0.5) * cs;
        const ty = (target.y + 0.5) * cs;
        ctx.strokeStyle = colours.accent;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = job.status === 'open' ? 0.9 : 0.5;
        ctx.beginPath();
        ctx.arc(tx, ty, cs * (0.5 + (job.status === 'open' ? pulse * 0.06 : 0)), 0, Math.PI * 2);
        ctx.stroke();
        const worker = job.worker && sim.workers.find((w) => w.id === job.worker);
        if (worker) {
          ctx.globalAlpha = 0.35;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(worker.x * cs, worker.y * cs);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.globalAlpha = 1;
      }

      // Survivors, with a pip for each scrap carried.
      for (const worker of sim.workers) {
        const wx = worker.x * cs;
        const wy = worker.y * cs;
        ctx.fillStyle = colours.ink;
        ctx.beginPath();
        ctx.arc(wx, wy, cs * 0.26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = colours.accent;
        for (let i = 0; i < worker.carry; i++) {
          ctx.beginPath();
          ctx.arc(wx - cs * 0.24 + i * cs * 0.16, wy - cs * 0.42, cs * 0.06, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now) => {
      // Capped so a background tab cannot jump far ahead, but generous enough that a slow device
      // still runs in real time; the sub-steps below keep large steps accurate.
      const dt = Math.min((now - last) / 1000, 0.25) * speedRef.current;
      last = now;
      if (visible && simRef.current) {
        // Small sub-steps keep fast-forward from skipping past a destination.
        const steps = Math.max(1, Math.ceil(dt / 0.025));
        for (let i = 0; i < steps; i++) step(simRef.current, dt / steps);
        draw(now);
      }
      frame = requestAnimationFrame(loop);
    };

    resize();
    const sizeWatch = new ResizeObserver(resize);
    sizeWatch.observe(canvas);
    const viewWatch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    viewWatch.observe(canvas);
    const themeWatch = new MutationObserver(() => {
      colours = readColours();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const readout = setInterval(snapshot, 160);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(readout);
      sizeWatch.disconnect();
      viewWatch.disconnect();
      themeWatch.disconnect();
    };
  }, [reset, snapshot]);

  const onPointerDown = (event) => {
    const sim = simRef.current;
    const box = canvasRef.current.getBoundingClientRect();
    const cs = box.width / sim.cols;
    const target = hit(sim, (event.clientX - box.left) / cs, (event.clientY - box.top) / cs);
    if (!target) return;

    let outcome;
    if (target.kind === 'node') outcome = designateGather(sim, target.node.id);
    else if (target.kind === 'cell') outcome = designateBuild(sim, target.x, target.y);
    else if (target.kind === 'crate') {
      outcome = { ok: false, reason: 'That is storage. Gathered scrap ends up here, and it pays for building.' };
    } else outcome = { ok: false, reason: 'Something is already there.' };

    if (!outcome.ok) setStatus(outcome.reason);
    else if (target.kind === 'node') setStatus('Gather queued. The nearest free survivor will take it.');
    else setStatus('Module queued. The scrap is paid now; a survivor will build it when free.');
    snapshot();
  };

  const gatherNext = () => {
    const sim = simRef.current;
    const pile = suggestPile(sim);
    if (!pile) return setStatus('Every pile is taken or empty. Press Reset to start again.');
    designateGather(sim, pile.id);
    setStatus('Gather queued. The nearest free survivor will take it.');
    snapshot();
  };

  const buildNext = () => {
    const sim = simRef.current;
    const cell = suggestBuildCell(sim);
    if (!cell) return setStatus('There is no room left to build.');
    const outcome = designateBuild(sim, cell.x, cell.y);
    setStatus(outcome.ok ? 'Module queued. The scrap is paid now; a survivor will build it when free.' : outcome.reason);
    snapshot();
  };

  const recruit = () => {
    const sim = simRef.current;
    if (addWorker(sim)) setStatus(`Survivor ${sim.workers.length} joined. Same queue, same rules.`);
    snapshot();
  };

  const toggleSpeed = () => {
    const next = speedRef.current === 1 ? 3 : 1;
    speedRef.current = next;
    setSpeed(next);
  };

  return (
    <section className="demo" data-reveal aria-labelledby="demo-title">
      <header className="demo__head">
        <p className="eyebrow">Try the idea</p>
        <h4 id="demo-title">One job queue, one survivor or fifty</h4>
        <p>
          A tiny version of how From Ashes to Orbit assigns work. You never move anyone. You designate jobs, and any
          free survivor claims the newest one, so the same rules run a single scavenger or a whole colony.
        </p>
      </header>

      <div className="demo__layout">
        <div className="demo__main">
          <canvas
            ref={canvasRef}
            className="demo__canvas"
            onPointerDown={onPointerDown}
            role="img"
            aria-label="A small map with scrap piles, a storage crate and survivors. Click a pile to queue gathering, or empty ground to queue a module. The buttons below do the same without a mouse."
          />

          <div className="demo__bar">
            <dl className="demo__stats">
              <div>
                <dt>Scrap</dt>
                <dd>{view?.stock ?? 0}</dd>
              </div>
              <div>
                <dt>Modules</dt>
                <dd>{view?.modules ?? 0}</dd>
              </div>
              <div>
                <dt>Survivors</dt>
                <dd>{view?.workers ?? 1}</dd>
              </div>
            </dl>
            <div className="demo__buttons">
              <button type="button" className="button" onClick={gatherNext}>
                Gather scrap
              </button>
              <button type="button" className="button" onClick={buildNext}>
                Build ({COST})
              </button>
              <button type="button" className="button" onClick={recruit} disabled={(view?.workers ?? 1) >= MAX_WORKERS}>
                Add survivor
              </button>
              <button type="button" className="button" onClick={toggleSpeed} aria-pressed={speed === 3}>
                {speed}× speed
              </button>
              <button type="button" className="button" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
          <p className="demo__status" role="status" aria-live="polite">
            {status}
          </p>
        </div>

        <aside className="demo__queue" aria-label="Job queue">
          <p className="eyebrow">Job queue</p>
          {view?.jobs.length ? (
            <ul>
              {view.jobs.map((job) => (
                <li key={job.id} data-status={job.status}>
                  <span>{job.title}</span>
                  <em>
                    {job.status === 'open' ? 'waiting' : job.status === 'claimed' ? `Survivor ${job.worker}` : 'done'}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <p className="demo__empty">Empty. Everyone is idle until you queue something.</p>
          )}
          <p className="demo__note">
            In the game the same queue is claimed by colonists that path over a navigation mesh, haul automatically and
            earn experience. This version keeps the idea and drops the rest.
          </p>
        </aside>
      </div>
    </section>
  );
}
