/*
 * A miniature of the job queue from From Ashes to Orbit.
 *
 * The player never moves a survivor. Clicking creates a designation (a job).
 * Any survivor that is free claims the newest open job, walks to it and does it.
 * One survivor or five use exactly the same rules.
 *
 * This is deliberately simplified: no pathfinding (survivors walk straight), no skills,
 * one resource. It is the shape of the idea, not the game's code.
 *
 * Pure logic, no DOM, so it can be tested on its own. Positions are in cell units:
 * the centre of cell (x, y) is (x + 0.5, y + 0.5).
 */

export const COST = 4; // scrap to start building a module
export const CARRY = 4; // scrap a survivor carries before hauling
export const MAX_WORKERS = 5;

const SPEED = 3.4; // cells per second
const GATHER_EVERY = 0.55; // seconds per scrap
const BUILD_SECONDS = 3;
const NODE_AMOUNT = 8;
const DONE_LINGER = 3; // seconds a finished job stays in the list

// Where scrap piles sit, as fractions of the grid. Fixed so the demo is the same every time.
const NODE_SPOTS = [
  [0.32, 0.2],
  [0.4, 0.78],
  [0.52, 0.5],
  [0.62, 0.18],
  [0.7, 0.82],
  [0.84, 0.34],
  [0.9, 0.7],
];

export function createSim({ cols, rows }) {
  const crate = { x: 1, y: Math.floor(rows / 2) };
  const nodes = [];
  NODE_SPOTS.forEach(([fx, fy], id) => {
    const x = Math.min(cols - 2, Math.max(3, Math.round(fx * (cols - 1))));
    const y = Math.min(rows - 1, Math.max(0, Math.round(fy * (rows - 1))));
    if (!nodes.some((node) => node.x === x && node.y === y)) {
      nodes.push({ id, x, y, amount: NODE_AMOUNT, max: NODE_AMOUNT });
    }
  });

  const sim = {
    cols,
    rows,
    crate,
    nodes,
    workers: [],
    jobs: [],
    sites: [],
    structures: [],
    stock: 0,
    time: 0,
    seq: 0,
    ids: 0,
    notes: [],
    delivered: 0,
  };
  addWorker(sim);
  return sim;
}

export function addWorker(sim) {
  if (sim.workers.length >= MAX_WORKERS) return false;
  sim.workers.push({
    id: sim.workers.length + 1,
    x: sim.crate.x + 0.5,
    y: sim.crate.y + 0.5,
    carry: 0,
    job: null,
    phase: 'idle',
    timer: 0,
  });
  return true;
}

const fail = (reason) => ({ ok: false, reason });
const ok = () => ({ ok: true });

function isOccupied(sim, x, y) {
  return (
    (sim.crate.x === x && sim.crate.y === y) ||
    sim.nodes.some((node) => node.x === x && node.y === y) ||
    sim.sites.some((site) => site.x === x && site.y === y) ||
    sim.structures.some((structure) => structure.x === x && structure.y === y)
  );
}

/** What is under a point (in cell units)? */
export function hit(sim, px, py) {
  const x = Math.floor(px);
  const y = Math.floor(py);
  if (x < 0 || y < 0 || x >= sim.cols || y >= sim.rows) return null;
  const node = sim.nodes.find((n) => n.x === x && n.y === y);
  if (node) return { kind: 'node', node };
  if (sim.crate.x === x && sim.crate.y === y) return { kind: 'crate' };
  if (isOccupied(sim, x, y)) return { kind: 'built', x, y };
  return { kind: 'cell', x, y };
}

export function designateGather(sim, nodeId) {
  const node = sim.nodes.find((n) => n.id === nodeId);
  if (!node) return fail('There is no pile there.');
  if (node.amount <= 0) return fail('That pile is empty.');
  if (sim.jobs.some((job) => job.type === 'gather' && job.node === nodeId && job.status !== 'done')) {
    return fail('Someone is already working that pile.');
  }
  sim.jobs.push({ id: ++sim.ids, type: 'gather', node: nodeId, status: 'open', worker: null, seq: ++sim.seq });
  return ok();
}

export function designateBuild(sim, x, y) {
  if (x < 0 || y < 0 || x >= sim.cols || y >= sim.rows) return fail('That is outside the map.');
  if (isOccupied(sim, x, y)) return fail('Something is already there.');
  if (sim.stock < COST) return fail(`A module costs ${COST} scrap and you have ${sim.stock}. Gather some first.`);

  // Cost is paid when the job is placed; the work itself is queued like any other.
  sim.stock -= COST;
  const site = { id: ++sim.ids, x, y, progress: 0 };
  sim.sites.push(site);
  sim.jobs.push({ id: ++sim.ids, type: 'build', site: site.id, status: 'open', worker: null, seq: ++sim.seq });
  return ok();
}

/** A free cell near storage, for the keyboard-friendly Build button. */
export function suggestBuildCell(sim) {
  const anchor = { x: sim.crate.x + 3, y: sim.crate.y };
  let best = null;
  let bestDistance = Infinity;
  for (let y = 0; y < sim.rows; y++) {
    for (let x = sim.crate.x + 2; x < sim.cols; x++) {
      if (isOccupied(sim, x, y)) continue;
      const distance = Math.hypot(x - anchor.x, y - anchor.y);
      if (distance < bestDistance) {
        best = { x, y };
        bestDistance = distance;
      }
    }
  }
  return best;
}

/** The nearest pile that has scrap and nobody on it, for the Gather button. */
export function suggestPile(sim) {
  const free = sim.nodes.filter(
    (node) =>
      node.amount > 0 &&
      !sim.jobs.some((job) => job.type === 'gather' && job.node === node.id && job.status !== 'done')
  );
  free.sort(
    (a, b) =>
      Math.hypot(a.x - sim.crate.x, a.y - sim.crate.y) - Math.hypot(b.x - sim.crate.x, b.y - sim.crate.y)
  );
  return free[0] ?? null;
}

function moveToward(worker, tx, ty, dt) {
  const dx = tx - worker.x;
  const dy = ty - worker.y;
  const distance = Math.hypot(dx, dy);
  const step = SPEED * dt;
  if (distance <= step) {
    worker.x = tx;
    worker.y = ty;
    return true;
  }
  worker.x += (dx / distance) * step;
  worker.y += (dy / distance) * step;
  return false;
}

function finish(sim, worker) {
  worker.job.status = 'done';
  worker.job.doneAt = sim.time;
  worker.job = null;
  worker.phase = 'idle';
  worker.timer = 0;
}

function updateWorker(sim, worker, dt) {
  if (!worker.job) {
    // Free survivors take the newest open job: what the player clicked last wins.
    const open = sim.jobs.filter((job) => job.status === 'open').sort((a, b) => b.seq - a.seq)[0];
    if (!open) {
      const angle = (worker.id - 1) * 1.25;
      moveToward(worker, sim.crate.x + 0.5 + Math.cos(angle) * 1.15, sim.crate.y + 0.5 + Math.sin(angle) * 1.15, dt);
      worker.phase = 'idle';
      return;
    }
    open.status = 'claimed';
    open.worker = worker.id;
    worker.job = open;
    worker.phase = open.type === 'gather' ? 'toNode' : 'toSite';
    worker.timer = 0;
  }

  const job = worker.job;

  if (job.type === 'gather') {
    const node = sim.nodes.find((n) => n.id === job.node);

    if (worker.phase === 'toNode') {
      if (moveToward(worker, node.x, node.y + 0.5, dt)) {
        worker.phase = 'gathering';
        worker.timer = 0;
      }
    } else if (worker.phase === 'gathering') {
      worker.timer += dt;
      while (worker.timer >= GATHER_EVERY && node.amount > 0 && worker.carry < CARRY) {
        worker.timer -= GATHER_EVERY;
        node.amount -= 1;
        worker.carry += 1;
      }
      if (node.amount === 0 || worker.carry >= CARRY) {
        if (worker.carry > 0) worker.phase = 'toCrate';
        else finish(sim, worker);
      }
    } else if (worker.phase === 'toCrate') {
      // Hauling is automatic once a survivor is full, like the game's auto-haul policy.
      if (moveToward(worker, sim.crate.x + 1.2, sim.crate.y + 0.5, dt)) {
        sim.stock += worker.carry;
        sim.delivered += worker.carry;
        if (sim.delivered === worker.carry) {
          sim.notes.push('First delivery. Scrap in storage is what pays for building.');
        }
        worker.carry = 0;
        if (node.amount > 0) worker.phase = 'toNode';
        else finish(sim, worker);
      }
    }
    return;
  }

  // Build job.
  const site = sim.sites.find((s) => s.id === job.site);
  if (!site) {
    finish(sim, worker);
    return;
  }
  if (worker.phase === 'toSite') {
    if (moveToward(worker, site.x - 0.2, site.y + 0.5, dt)) worker.phase = 'building';
  } else if (worker.phase === 'building') {
    site.progress += dt / BUILD_SECONDS;
    if (site.progress >= 1) {
      sim.sites = sim.sites.filter((s) => s !== site);
      sim.structures.push({ x: site.x, y: site.y });
      if (sim.structures.length === 1) sim.notes.push('First module up. Notice the cost was paid when you placed it; the work was queued.');
      if (sim.structures.length === 3) sim.notes.push('Camp established. Add more survivors and watch the same queue clear faster.');
      finish(sim, worker);
    }
  }
}

export function step(sim, dt) {
  sim.time += dt;
  for (const worker of sim.workers) updateWorker(sim, worker, dt);
  sim.jobs = sim.jobs.filter((job) => job.status !== 'done' || sim.time - job.doneAt < DONE_LINGER);
}

/** What the job list in the UI needs, newest first. */
export function describeJobs(sim) {
  return [...sim.jobs]
    .sort((a, b) => b.seq - a.seq)
    .slice(0, 6)
    .map((job) => ({
      id: job.id,
      title: job.type === 'gather' ? 'Gather scrap' : 'Build module',
      status: job.status,
      worker: job.worker,
    }));
}
